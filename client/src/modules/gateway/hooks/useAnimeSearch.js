import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_DELAY = 300;
const DEFAULT_LIMIT = 10;

const INITIAL_STATE = {
	results: [],
	status: "idle",
	error: null,
};

export function useAnimeSearch(
	query,
	{
		limit = DEFAULT_LIMIT,
		minLength = MIN_QUERY_LENGTH,
		debounceMs = DEBOUNCE_DELAY,
	} = {},
) {
	const [state, setState] = useState(INITIAL_STATE);

	useEffect(() => {
		const normalizedQuery = query.trim();

		// Do not search for queries that are too short.
		if (normalizedQuery.length < minLength) {
			setState(INITIAL_STATE);
			return;
		}

		// Clear old results while waiting for the next request.
		setState({
			results: [],
			status: "debouncing",
			error: null,
		});

		let controller;

		const timeoutId = setTimeout(() => {
			controller = new AbortController();

			setState((current) => ({
				...current,
				status: "loading",
				error: null,
			}));

			api.search(normalizedQuery, {
				limit,
				signal: controller.signal,
			})
				.then((results) => {
					if (!controller.signal.aborted) {
						setState({
							results,
							status: "success",
							error: null,
						});
					}
				})
				.catch((err) => {
					// Ignore requests that were intentionally cancelled.
					if (controller.signal.aborted) {
						return;
					}

					setState({
						results: [],
						status: "error",
						error: err.message,
					});
				});
		}, debounceMs);

		// Cleanup runs when the query changes or the component unmounts.
		return () => {
			clearTimeout(timeoutId);
			controller?.abort();
		};
	}, [query, limit, minLength, debounceMs]);

	return {
		...state,
		isLoading: state.status === "loading",
		isDebouncing: state.status === "debouncing",
	};
}
