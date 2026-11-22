import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { AnimeCard } from "./AnimeCard";
import { Skeleton } from "@/components/ui/skeleton";
import NextAndPrevious from "./NextAndPrevious";
import { FeatureGrid } from "./layout/index.js";

const PER_PAGE = 20;

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
	const [page, setPage] = useState(1);
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let active = true;

		setLoading(true);
		setError(null);

		api.recent(page, PER_PAGE)
			.then((response) => {
				if (active) {
					setResult(response);
				}
			})
			.catch((err) => {
				if (active) {
					setError(err.message);
				}
			})
			.finally(() => {
				if (active) {
					setLoading(false);
				}
			});

		return () => {
			active = false;
		};
	}, [page]);

	const totalPages = result?.pagination?.total_pages ?? 1;
	const pageNumbers = getPageNumbers(page, totalPages);

	const handlePageChange = (event, nextPage) => {
		event.preventDefault();

		if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
			return;
		}

		setPage(nextPage);
	};

	if (error) {
		return <p className="text-destructive">{error}</p>;
	}

	if (loading || !result) {
		return (
			<FeatureGrid columns={4}>
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
			<FeatureGrid columns={4}>
				{result.items.map((anime) => (
					<AnimeCard key={anime.id} anime={anime} />
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
