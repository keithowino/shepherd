import mongoose from "mongoose";

const animeCatalogueSyncSchema = new mongoose.Schema(
	{
		// One indexing state for the Anikoto catalogue.
		_id: {
			type: String,
			default: "anikoto-recent-anime",
		},

		status: {
			type: String,
			enum: ["IDLE", "RUNNING", "PAUSED", "FAILED", "COMPLETED"],
			default: "IDLE",
		},

		// The next page that the indexer should fetch.
		nextPage: {
			type: Number,
			default: 1,
			min: 1,
		},

		perPage: {
			type: Number,
			default: 20,
			min: 1,
		},

		totalPages: {
			type: Number,
			default: null,
		},

		totalItems: {
			type: Number,
			default: null,
		},

		pagesCompleted: {
			type: Number,
			default: 0,
		},

		indexedItems: {
			type: Number,
			default: 0,
		},

		startedAt: Date,
		completedAt: Date,
		lastPageCompletedAt: Date,

		// Identifies the process currently running the indexing job.
		lockId: {
			type: String,
			default: null,
		},

		// Allows another process to resume if the current process crashes.
		lockExpiresAt: {
			type: Date,
			default: null,
		},

		lastError: {
			message: String,
			page: Number,
			occurredAt: Date,
		},
	},
	{
		timestamps: true,
	},
);

export const AnimeCatalogueSync = mongoose.model(
	"AnimeCatalogueSync",
	animeCatalogueSyncSchema,
);
