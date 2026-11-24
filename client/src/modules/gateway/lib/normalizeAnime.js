/**
 * Normalizes a record from /anime/recent (snake-ish, `id`) or
 * /anime/series (camel-ish, `_id`) into one shape used by the
 * landing page. Only the fields the landing page reads are mapped.
 */
export function normalizeAnime(raw) {
	if (!raw) return null;

	const terms = raw.terms_by_type ?? raw.termsByType ?? {};

	return {
		id: raw.id ?? raw._id,
		title: raw.title,
		alternative: raw.alternative ?? "",
		native: raw.native ?? "",
		poster: raw.poster ?? "",
		description: raw.description ?? "",
		status: raw.status ?? "",
		season: raw.season ?? "",
		year: raw.year ?? null,
		score: Number(raw.score) > 0 ? Number(raw.score) : null,
		episodes: raw.episodes ?? "",
		released: raw.is_sub ?? null, // subbed episode count so far
		is_sub: Boolean(raw.is_sub ?? raw.isSub),
		is_dub: Boolean(raw.is_dub ?? raw.isDub),
		type: terms.type?.[0] ?? null,
		genres: terms.genre ?? [],
		studios: terms.studios ?? [],
		airing: raw.status === "Currently Airing",
		updatedAt: raw.updated_at ?? raw.updatedAt ?? null,
		nextEpisode: raw.next_air_ep ?? null,
		slug: raw.slug ?? null,
		terms_by_type: terms, // pass-through for FlockCard
	};
}

export function normalizeRecent(response) {
	const items = (response?.items ?? []).map(normalizeAnime).filter(Boolean);
	return { items, pagination: response?.pagination ?? null };
}

/**
 * Merges multiple recent pages, deduping by id. Order preserved by
 * first appearance (most-recent first), which is what "recent" means.
 */
export function mergeUniqueFlock(...lists) {
	const seen = new Set();
	const out = [];

	for (const list of lists) {
		for (const anime of list?.items ?? []) {
			if (seen.has(anime.id)) continue;
			seen.add(anime.id);
			out.push(anime);
		}
	}

	return out;
}
