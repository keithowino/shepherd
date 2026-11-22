import { randomUUID } from "node:crypto";

import { anikotoProvider } from "../providers/index.js";
import { animeRepository } from "../repositories/anime.repository.js";
import { animeCatalogueSyncRepository } from "../repositories/anime-catalogue-sync.repository.js";

const DEFAULT_PER_PAGE = 20;
const DEFAULT_DELAY_MS = 250;
const DEFAULT_LEASE_MS = 10 * 60 * 1000;

function validatePageResponse(response, requestedPage, perPage) {
	const items = response?.data;
	const pagination = response?.pagination;

	if (!Array.isArray(items)) {
		throw new Error(
			`Invalid Anikoto response: expected data array for page ${requestedPage}.`,
		);
	}

	if (!pagination || typeof pagination !== "object") {
		throw new Error(
			`Invalid Anikoto response: pagination metadata missing on page ${requestedPage}.`,
		);
	}

	const {
		page,
		per_page: responsePerPage,
		total,
		total_pages: totalPages,
	} = pagination;

	if (
		page !== requestedPage ||
		responsePerPage !== perPage ||
		!Number.isInteger(total) ||
		total < 0 ||
		!Number.isInteger(totalPages) ||
		totalPages < 0
	) {
		throw new Error(
			`Invalid Anikoto pagination metadata on page ${requestedPage}.`,
		);
	}

	return {
		items,
		total,
		totalPages,
	};
}

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const animeCatalogueIndexingService = {
	// async run({
	// 	perPage = DEFAULT_PER_PAGE,
	// 	delayMs = DEFAULT_DELAY_MS,
	// 	leaseMs = DEFAULT_LEASE_MS,
	// 	onProgress = console.log,
	// } = {}) {
	async run({
		perPage = DEFAULT_PER_PAGE,
		delayMs = DEFAULT_DELAY_MS,
		leaseMs = DEFAULT_LEASE_MS,
		maxPages,
		onProgress = console.log,
	} = {}) {
		if (!Number.isInteger(perPage) || perPage < 1) {
			throw new Error("perPage must be a positive integer.");
		}

		if (!Number.isInteger(delayMs) || delayMs < 0) {
			throw new Error("delayMs must be a non-negative integer.");
		}

		if (!Number.isInteger(leaseMs) || leaseMs < 1) {
			throw new Error("leaseMs must be a positive integer.");
		}

		if (
			maxPages !== undefined &&
			(!Number.isInteger(maxPages) || maxPages < 1)
		) {
			throw new Error(
				"maxPages must be a positive integer when provided.",
			);
		}

		let progress = await animeCatalogueSyncRepository.getOrCreate({
			perPage,
		});

		if (progress.status === "COMPLETED") {
			onProgress("Anime catalogue indexing is already completed.");
			return progress;
		}

		// A resumed run uses the original page size stored in MongoDB.
		perPage = progress.perPage;

		const lockId = randomUUID();

		progress = await animeCatalogueSyncRepository.acquireLock({
			lockId,
			leaseMs,
		});

		if (!progress) {
			throw new Error(
				"Another catalogue indexing process currently holds the lock.",
			);
		}

		let currentPage = progress.nextPage;
		let pagesProcessedThisRun = 0;

		try {
			onProgress(`Starting catalogue indexing from page ${currentPage}.`);

			while (
				progress.totalPages === null ||
				currentPage <= progress.totalPages
			) {
				// Renew the lease before starting another page.
				const renewed = await animeCatalogueSyncRepository.renewLock({
					lockId,
					leaseMs,
				});

				if (renewed.modifiedCount !== 1) {
					throw new Error(
						"Catalogue indexing lock was lost. Stopping safely.",
					);
				}

				onProgress(`Fetching Anikoto page ${currentPage}...`);

				const response = await anikotoProvider.fetchRecent({
					page: currentPage,
					perPage,
				});

				const { items, total, totalPages } = validatePageResponse(
					response,
					currentPage,
					perPage,
				);

				// Persist anime records before advancing the checkpoint.
				await animeRepository.upsertMany(items, new Date());

				progress = await animeCatalogueSyncRepository.markPageCompleted(
					{
						lockId,
						page: currentPage,
						totalPages,
						totalItems: total,
						indexedItems: items.length,
					},
				);

				if (!progress) {
					throw new Error(
						`Could not checkpoint page ${currentPage}. The indexing lock may have been lost.`,
					);
				}

				onProgress({
					status: progress.status,
					completedPages: progress.pagesCompleted,
					totalPages: progress.totalPages,
					indexedItems: progress.indexedItems,
					totalItems: progress.totalItems,
					nextPage: progress.nextPage,
				});

				// currentPage = progress.nextPage;

				// if (currentPage > progress.totalPages) {
				// 	break;
				// }

				// if (delayMs > 0) {
				// 	await wait(delayMs);
				// }

				currentPage = progress.nextPage;
				pagesProcessedThisRun += 1;

				// Stop safely when the requested page limit is reached.
				if (
					maxPages !== undefined &&
					pagesProcessedThisRun >= maxPages &&
					currentPage <= progress.totalPages
				) {
					progress = await animeCatalogueSyncRepository.markPaused({
						lockId,
					});

					if (!progress) {
						throw new Error(
							"Could not pause catalogue indexing. The indexing lock may have been lost.",
						);
					}

					onProgress(
						`Catalogue indexing paused after ${pagesProcessedThisRun} page(s). Resume from page ${progress.nextPage}.`,
					);

					return progress;
				}

				if (currentPage > progress.totalPages) break;
				if (delayMs > 0) await wait(delayMs);
			}

			progress = await animeCatalogueSyncRepository.markCompleted({
				lockId,
			});

			if (!progress) {
				throw new Error(
					"Could not mark catalogue indexing as completed. The indexing lock may have been lost.",
				);
			}

			onProgress("Anime catalogue indexing completed.");

			return progress;
		} catch (error) {
			try {
				await animeCatalogueSyncRepository.markFailed({
					lockId,
					page: currentPage,
					error,
				});
			} catch (progressError) {
				console.error(
					"Could not save catalogue indexing failure:",
					progressError,
				);
			}

			throw error;
		}
	},

	async getProgress() {
		return animeCatalogueSyncRepository.getProgress();
	},
};
