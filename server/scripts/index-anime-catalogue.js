import { database } from "../src/app/bootstrap/index.js";
import { animeCatalogueIndexingService } from "../src/modules/media/services/index.js";

/**
 * One important distinction: indexedItems: 9404 represents the
 * number of records processed by the indexing job. It does not
 * independently prove that MongoDB contains exactly 9,404
 * distinct anime documents.
 */
async function main() {
	let databaseConnected = false;

	try {
		console.log("Starting Anikoto anime catalogue indexing...");

		await database.connectDatabase();
		databaseConnected = true;

		const progress = await animeCatalogueIndexingService.run({
			// maxPages: 2,

			onProgress(update) {
				if (typeof update === "string") {
					console.log(`[CATALOGUE] ${update}`);
					return;
				}

				const percentage = update.totalPages
					? (
							(update.completedPages / update.totalPages) *
							100
						).toFixed(2)
					: "0.00";

				console.log(
					[
						"[CATALOGUE]",
						`Pages: ${update.completedPages}/${update.totalPages ?? "unknown"}`,
						`Progress: ${percentage}%`,
						`Items processed: ${update.indexedItems}/${update.totalItems ?? "unknown"}`,
						`Next page: ${update.nextPage}`,
					].join(" | "),
				);
			},
		});

		console.log("\nCatalogue indexing result:");
		console.log({
			status: progress.status,
			pagesCompleted: progress.pagesCompleted,
			totalPages: progress.totalPages,
			indexedItems: progress.indexedItems,
			totalItems: progress.totalItems,
			completedAt: progress.completedAt,
		});
	} catch (error) {
		console.error("\n❌ Catalogue indexing failed:");
		console.error(error.message);

		process.exitCode = 1;
	} finally {
		if (databaseConnected) {
			try {
				await database.disconnectDatabase();
			} catch (error) {
				console.error(
					"❌ Failed to disconnect from MongoDB:",
					error.message,
				);

				process.exitCode = 1;
			}
		}
	}
}

main();
