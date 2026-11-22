import { AnimeCatalogueSync } from "../models/index.js";

const CATALOGUE_SYNC_ID = "anikoto-recent-anime";

export const animeCatalogueSyncRepository = {
	async getOrCreate({ perPage = 20 } = {}) {
		return AnimeCatalogueSync.findOneAndUpdate(
			{ _id: CATALOGUE_SYNC_ID },
			{
				$setOnInsert: {
					status: "IDLE",
					nextPage: 1,
					perPage,
					pagesCompleted: 0,
					indexedItems: 0,
				},
			},
			{
				returnDocument: "after",
				upsert: true,
				setDefaultsOnInsert: true,
			},
		);
	},

	async acquireLock({ lockId, leaseMs }) {
		const now = new Date();

		return AnimeCatalogueSync.findOneAndUpdate(
			{
				_id: CATALOGUE_SYNC_ID,
				$or: [
					{ status: { $ne: "RUNNING" } },
					{ lockExpiresAt: { $lte: now } },
					{ lockExpiresAt: null },
					{ lockExpiresAt: { $exists: false } },
				],
			},
			{
				$set: {
					status: "RUNNING",
					lockId,
					lockExpiresAt: new Date(now.getTime() + leaseMs),
					startedAt: now,
					completedAt: null,
					lastError: null,
				},
			},
			{ returnDocument: "after" },
		);
	},

	async renewLock({ lockId, leaseMs }) {
		const now = new Date();

		return AnimeCatalogueSync.updateOne(
			{
				_id: CATALOGUE_SYNC_ID,
				status: "RUNNING",
				lockId,
			},
			{
				$set: {
					lockExpiresAt: new Date(now.getTime() + leaseMs),
				},
			},
		);
	},

	async markPageCompleted({
		lockId,
		page,
		totalPages,
		totalItems,
		indexedItems,
	}) {
		const now = new Date();

		return AnimeCatalogueSync.findOneAndUpdate(
			{
				_id: CATALOGUE_SYNC_ID,
				status: "RUNNING",
				lockId,
				nextPage: page,
			},
			{
				$set: {
					nextPage: page + 1,
					totalPages,
					totalItems,
					lastPageCompletedAt: now,
				},
				$inc: {
					pagesCompleted: 1,
					indexedItems,
				},
			},
			{ returnDocument: "after" },
		);
	},

	async markPaused({ lockId }) {
		return AnimeCatalogueSync.findOneAndUpdate(
			{
				_id: CATALOGUE_SYNC_ID,
				status: "RUNNING",
				lockId,
			},
			{
				$set: {
					status: "PAUSED",
					lockId: null,
					lockExpiresAt: null,
				},
			},
			{ returnDocument: "after" },
		);
	},

	async markCompleted({ lockId }) {
		return AnimeCatalogueSync.findOneAndUpdate(
			{
				_id: CATALOGUE_SYNC_ID,
				status: "RUNNING",
				lockId,
			},
			{
				$set: {
					status: "COMPLETED",
					completedAt: new Date(),
					lockId: null,
					lockExpiresAt: null,
				},
			},
			{ returnDocument: "after" },
		);
	},

	async markFailed({ lockId, page, error }) {
		return AnimeCatalogueSync.findOneAndUpdate(
			{
				_id: CATALOGUE_SYNC_ID,
				status: "RUNNING",
				lockId,
			},
			{
				$set: {
					status: "FAILED",
					lastError: {
						message: error.message,
						page,
						occurredAt: new Date(),
					},
					lockId: null,
					lockExpiresAt: null,
				},
			},
			{ returnDocument: "after" },
		);
	},

	async getProgress() {
		return AnimeCatalogueSync.findById(CATALOGUE_SYNC_ID).lean();
	},
};
