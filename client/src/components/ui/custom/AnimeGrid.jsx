import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import NextAndPrevious from "./NextAndPrevious";
import { FeatureGrid } from "./layout/index.js";
import { useSearchParams } from "react-router-dom";
import { FlockCard } from "./FlockCard";

const PER_PAGE = 20;

function getPageFromSearchParams(searchParams) {
	const rawPage = searchParams.get("page");

	if (rawPage === null) {
		return {
			page: 1,
			isValid: true,
			shouldNormalize: false,
		};
	}

	const parsedPage = Number(rawPage);

	const isValid =
		/^[1-9]\d*$/.test(rawPage) && Number.isSafeInteger(parsedPage);

	return {
		page: isValid ? parsedPage : 1,
		isValid,
		shouldNormalize: !isValid || rawPage === "1",
	};
}

function getPageNumbers(currentPage, totalPages) {
	if (totalPages <= 1) return [1];

	const pages = [1];

	const start = Math.max(2, currentPage - 1);
	const end = Math.min(totalPages - 1, currentPage + 1);

	if (start > 2) {
		pages.push("ellipsis");
	}

	for (let page = start; page <= end; page++) {
		pages.push(page);
	}

	if (end < totalPages - 1) {
		pages.push("ellipsis");
	}

	pages.push(totalPages);

	return pages;
}

export const AnimeGrid = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const {
		page,
		isValid: isValidPageParam,
		shouldNormalize,
	} = getPageFromSearchParams(searchParams);

	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let active = true;
		let shouldRefetch = false;

		setLoading(true);
		setError(null);

		/**
		 * Normalize malformed or noncanonical page parameters.
		 */
		if (shouldNormalize) {
			setSearchParams(
				(previousParams) => {
					const nextParams = new URLSearchParams(previousParams);

					nextParams.delete("page");

					return nextParams;
				},
				{ replace: true },
			);

			return () => {
				active = false;
			};
		}

		api.recent(page, PER_PAGE)
			.then((response) => {
				if (!active) return;

				const totalPages = Math.max(
					1,
					Number(response.pagination?.total_pages) || 1,
				);

				/**
				 * Correct page requests exceeding the available pages.
				 */
				if (page > totalPages) {
					shouldRefetch = true;

					setSearchParams(
						(previousParams) => {
							const nextParams = new URLSearchParams(
								previousParams,
							);

							if (totalPages === 1) {
								nextParams.delete("page");
							} else {
								nextParams.set("page", String(totalPages));
							}

							return nextParams;
						},
						{ replace: true },
					);

					return;
				}

				setResult(response);
			})
			.catch((err) => {
				if (active) {
					setError(err.message);
				}
			})
			.finally(() => {
				if (active && !shouldRefetch) {
					setLoading(false);
				}
			});

		return () => {
			active = false;
		};
	}, [page, shouldNormalize, setSearchParams]);

	const totalPages = result?.pagination?.total_pages ?? 1;
	const pageNumbers = getPageNumbers(page, totalPages);

	const handlePageChange = (event, nextPage) => {
		event.preventDefault();

		if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
			return;
		}

		setSearchParams((previousParams) => {
			const nextParams = new URLSearchParams(previousParams);

			if (nextPage === 1) {
				nextParams.delete("page");
			} else {
				nextParams.set("page", String(nextPage));
			}

			return nextParams;
		});
	};

	if (error) {
		return <p className="text-destructive">{error}</p>;
	}

	if (loading || !result) {
		return (
			<FeatureGrid columns={5}>
				{Array.from({ length: PER_PAGE }).map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="aspect-2/3 rounded-xl" />
						<Skeleton className="h-4 w-4/5" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				))}
			</FeatureGrid>
		);
	}

	return (
		<div className="space-y-8">
			<FeatureGrid columns={5}>
				{result.items.map((anime) => (
					<FlockCard
						key={anime.id}
						anime={anime}
						render={{
							type: true,
							score: true,
							episodeLabel: true,
							animeDescription: true,
							caption: true,
						}}
					/>
				))}
			</FeatureGrid>

			<NextAndPrevious
				handlePageChange={handlePageChange}
				page={page}
				pageNumbers={pageNumbers}
				totalPages={totalPages}
			/>
		</div>
	);
};
