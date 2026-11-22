import { Anime } from "../models/index.js";

// console.log("[SERVER] Anime model imported by repository:", {
// 	file: import.meta.url,
// 	modelName: Anime.modelName,
// 	termsByType: Anime.schema.path("termsByType")?.instance,
// 	genre: Anime.schema.path("termsByType.genre")?.instance,
// 	studios: Anime.schema.path("termsByType.studios")?.instance,
// 	type: Anime.schema.path("termsByType.type")?.instance,
// });

export const animeRepository = {
	async upsertMany(rawAnimes, fetchedAt = new Date()) {
		if (!rawAnimes.length) return;

		const ops = rawAnimes.map((a) => ({
			updateOne: {
				filter: { _id: a.id },
				update: {
					$set: {
						// _id: a.id,
						title: a.title,
						alternative: a.alternative,
						titles: a.titles,
						native: a.native,
						slug: a.slug,
						rating: a.rating,
						poster: a.poster,
						description: a.description,
						aired: a.aired,
						season: a.season,
						year: a.year,
						status: a.status,
						score: a.score,
						malId: a.mal_id,
						episodesCount: a.episodes,
						isDub: a.is_dub,
						isSub: a.is_sub,
						termsByType: a.terms_by_type || {},
						sourceUpdatedAt: a.updated_at
							? new Date(a.updated_at)
							: undefined,
						fetchedAt,
					},
				},
				upsert: true,
			},
		}));

		// await Anime.bulkWrite(ops, { ordered: false });
		try {
			const result = await Anime.bulkWrite(ops, { ordered: false });
			if (
				result.upsertedCount + result.modifiedCount === 0 &&
				ops.length > 0
			) {
				console.warn(
					`anime bulkWrite: 0 of ${ops.length} ops affected`,
				);
			}
		} catch (err) {
			console.error("anime bulkWrite failed:", err.message);
			if (err.writeErrors?.length) {
				console.error("first writeError:", err.writeErrors[0].errmsg);
			}
			throw err;
		}

		// ...

		// try {
		// 	const result = await Anime.bulkWrite(ops, { ordered: false });

		// 	console.log("[SERVER] Anime bulkWrite:", {
		// 		operations: ops.length,
		// 		acknowledged: result.acknowledged,
		// 		matched: result.matchedCount,
		// 		modified: result.modifiedCount,
		// 		upserted: result.upsertedCount,
		// 	});

		// 	if (
		// 		result.acknowledged &&
		// 		result.matchedCount === 0 &&
		// 		result.upsertedCount === 0 &&
		// 		ops.length > 0
		// 	) {
		// 		console.warn(
		// 			`[SERVER] Anime bulkWrite: no documents matched or inserted (${ops.length} operations).`,
		// 		);
		// 	}
		// } catch (err) {
		// 	console.error("[SERVER] Anime bulkWrite failed:", err.message);

		// 	if (err.writeErrors?.length) {
		// 		console.error(
		// 			"[SERVER] First write error:",
		// 			err.writeErrors[0].errmsg,
		// 		);
		// 	}

		// 	throw err;
		// }

		// ...

		// try {
		// 	const result = await Anime.bulkWrite(ops, { ordered: false });

		// 	console.log("[SERVER] Runtime Anime schema:", {
		// 		termsByType: Anime.schema.path("termsByType")?.instance,
		// 		genre: Anime.schema.path("termsByType.genre")?.instance,
		// 		studios: Anime.schema.path("termsByType.studios")?.instance,
		// 		producers: Anime.schema.path("termsByType.producers")?.instance,
		// 		type: Anime.schema.path("termsByType.type")?.instance,
		// 	});

		// 	console.log("[SERVER] Anime model registration:", {
		// 		modelName: Anime.modelName,
		// 		modelFileSchemaPaths: Object.keys(Anime.schema.paths),
		// 		registeredModels: Object.keys(Anime.db.models),
		// 	});

		// 	// const animeId = Number(rawAnimes[0].id);

		// 	// const mongooseDocument = await Anime.findById(animeId).lean();

		// 	// const nativeDocument = await Anime.collection.findOne({
		// 	// 	_id: animeId,
		// 	// });

		// 	// console.log("[SERVER] Anime persistence verification:", {
		// 	// 	animeId,
		// 	// 	mongooseFound: Boolean(mongooseDocument),
		// 	// 	nativeFound: Boolean(nativeDocument),
		// 	// 	mongooseDocument,
		// 	// 	nativeDocument,
		// 	// });

		// 	// console.log("[SERVER] Anime bulkWrite raw result:");

		// 	// console.dir(result, { depth: null });

		// 	// console.log("[SERVER] Anime bulkWrite result inspection:", {
		// 	// 	resultType: result?.constructor?.name,
		// 	// 	resultKeys: result ? Object.keys(result) : [],
		// 	// 	acknowledged: result?.acknowledged,

		// 	// 	matchedCount: result?.matchedCount,
		// 	// 	modifiedCount: result?.modifiedCount,
		// 	// 	upsertedCount: result?.upsertedCount,

		// 	// 	legacyMatched: result?.nMatched,
		// 	// 	legacyModified: result?.nModified,
		// 	// 	legacyUpserted: result?.nUpserted,

		// 	// 	rawResult: result?.result,
		// 	// });

		// 	// console.log("[SERVER] Anime model inspection:", {
		// 	// 	modelName: Anime.modelName,
		// 	// 	collectionName: Anime.collection.collectionName,
		// 	// 	databaseName: Anime.db.name,
		// 	// 	connectionReadyState: Anime.db.readyState,
		// 	// 	schemaIdType: Anime.schema.path("_id")?.instance,
		// 	// });
		// } catch (err) {
		// 	console.error("[SERVER] Anime bulkWrite failed:", err);

		// 	throw err;
		// }
	},

	async findById(id) {
		return Anime.findById(Number(id)).lean();
	},

	async findManyByIds(ids) {
		return Anime.find({ _id: { $in: ids.map(Number) } }).lean();
	},

	async isFresh(id, ttlMs) {
		const doc = await Anime.findById(Number(id)).select("fetchedAt").lean();
		if (!doc?.fetchedAt) return false;
		return Date.now() - new Date(doc.fetchedAt).getTime() < ttlMs;
	},

	async isSeriesFresh(id, ttlMs) {
		const doc = await Anime.findById(Number(id))
			.select("seriesFetchedAt")
			.lean();

		if (!doc?.seriesFetchedAt) return false;

		return Date.now() - new Date(doc.seriesFetchedAt).getTime() < ttlMs;
	},

	async markSeriesFetched(id, fetchedAt = new Date()) {
		await Anime.updateOne(
			{ _id: Number(id) },
			{ $set: { seriesFetchedAt: fetchedAt } },
		);
	},
};
