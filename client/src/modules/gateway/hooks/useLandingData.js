import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { mergeUniqueFlock, normalizeRecent } from "../lib/normalizeAnime.js";

const PER_PAGE = 24; // one request; a second for variety

/**
 * The landing page needs four views of the same pool:
 *   - recent arrivals (page 1, most recent)
 *   - currently airing (filtered)
 *   - seasonal fold (filtered by current-ish season)
 *   - long-kept flock (finished & scored)
 *
 * We fetch two pages and partition client-side to avoid four
 * round-trips. If the first page is already rich enough we skip
 * the second request entirely.
 */
export function useLandingData() {
	const [flock, setFlock] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let active = true;

		setLoading(true);
		setError(null);

		(async () => {
			try {
				const first = normalizeRecent(await api.recent(1, PER_PAGE));

				if (!active) return;

				// If the first page already has airing shows, we
				// don't need a second round-trip. Otherwise pull
				// one more page for variety.
				const hasAiring = first.items.some((a) => a.airing);

				let second = { items: [], pagination: null };
				if (!hasAiring) {
					second = normalizeRecent(await api.recent(2, PER_PAGE));
				}

				if (!active) return;

				setFlock(mergeUniqueFlock(first, second));
			} catch (err) {
				if (active) setError(err.message);
			} finally {
				if (active) setLoading(false);
			}
		})();

		return () => {
			active = false;
		};
	}, []);

	/**
	 * Derive section views from the single merged flock. Memoized
	 * so child components can rely on referential stability.
	 */
	const views = useMemo(() => {
		const airing = flock.filter((a) => a.airing).slice(0, 8);

		// "New to the flock" — most recent 8 that aren't already
		// surfaced in the airing strip, so the page doesn't repeat.
		const airingIds = new Set(airing.map((a) => a.id));
		const arrivals = flock.filter((a) => !airingIds.has(a.id)).slice(0, 8);

		// Seasonal fold: prefer the current year + a season
		// derived from the airing/anime data; fall back to the
		// most common (season, year) pair in the flock.
		const seasonalPick = pickSeasonal(flock);

		// Long-kept flock: finished, scored, sorted by score desc.
		const longKept = [...flock]
			.filter((a) => !a.airing && a.score != null)
			.sort((a, b) => b.score - a.score)
			.slice(0, 6);

		return { airing, arrivals, seasonalPick, longKept };
	}, [flock]);

	return { flock, ...views, loading, error };
}

/**
 * Picks the (season, year) that appears most in the flock and
 * returns its members. If nothing repeats, uses the newest year.
 */
function pickSeasonal(flock) {
	const tally = new Map();

	for (const a of flock) {
		if (!a.season || !a.year) continue;
		const key = `${String(a.season).toLowerCase()}|${a.year}`;
		tally.set(key, (tally.get(key) ?? 0) + 1);
	}

	if (tally.size === 0) return { label: null, items: [] };

	let bestKey = null;
	let bestCount = 0;
	for (const [key, count] of tally) {
		if (count > bestCount) {
			bestCount = count;
			bestKey = key;
		}
	}

	if (!bestKey) return { label: null, items: [] };

	const [season, year] = bestKey.split("|");
	const items = flock
		.filter(
			(a) =>
				String(a.season).toLowerCase() === season &&
				String(a.year) === year,
		)
		.slice(0, 5);

	return {
		label: `${capitalize(season)} ${year}`,
		items,
	};
}

function capitalize(s) {
	if (!s) return "";
	return s.charAt(0).toUpperCase() + s.slice(1);
}
