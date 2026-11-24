import { Link } from "react-router-dom";

import { FlockCard } from "@/components/ui/custom/FlockCard";
import { SectionEyebrow } from "./SectionEyebrow.jsx";
import { FeatureGrid } from "@/components/ui/index.js";
import { useMemo, useState } from "react";

/**
 * A section of the flock, rendered as a responsive grid of
 * FlockCards. `emphasis` tweaks the card's render config so
 * that e.g. "long-kept" shows scores more prominently.
 */
export function FlockSection({
	seb = { href: "/updates", linkLabel: "See more" },
	items,
	emphasis = "recent",
	flockAction,
	loading,
	error,
}) {
	const [pasture, setPasture] = useState("All");

	const pastures = useMemo(() => {
		const counts = new Map();
		items.forEach((a) =>
			a.terms_by_type?.genre?.forEach((g) =>
				counts.set(g, (counts.get(g) ?? 0) + 1),
			),
		);
		return [
			"All",
			...[...counts.entries()]
				.sort((a, b) => b[1] - a[1])
				.slice(0, 8)
				.map(([g]) => g),
		];
	}, [items]);

	const visible = useMemo(
		() =>
			pasture === "All"
				? items
				: items.filter((a) =>
						a.terms_by_type?.genre?.includes(pasture),
					),
		[items, pasture],
	);

	if (!items?.length) return null;

	const render =
		emphasis === "longKept"
			? {
					type: true,
					score: true,
					episodeLabel: false,
					animeDescription: true,
					animeDescriptionType: "default",
					caption: true,
				}
			: {
					type: true,
					score: true,
					episodeLabel: true,
					animeDescription: true,
					caption: true,
				};

	return (
		<section className="container mx-auto px-4">
			<SectionEyebrow
				eyebrow={seb.eyebrow}
				title={seb.title}
				note={seb.note}
				action={
					<Link
						to={seb.href}
						className="text-xs font-medium text-primary hover:underline"
					>
						{seb.linkLabel}
					</Link>
				}
			/>

			{flockAction === "graze-pasture" ? (
				<section className="space-y-5">
					{!loading && !error && (
						<div
							role="tablist"
							aria-label="Pastures"
							className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none"
						>
							{pastures.map((g) => (
								<button
									key={g}
									role="tab"
									aria-selected={pasture === g}
									onClick={() => setPasture(g)}
									className={
										"shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
										(pasture === g
											? "border-primary bg-primary text-primary-foreground"
											: "border-border bg-card text-muted-foreground hover:text-foreground")
									}
								>
									{g}
								</button>
							))}
						</div>
					)}

					{error ? (
						<p className="text-destructive">{error}</p>
					) : (
						<div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
							{loading
								? Array.from({ length: 12 }).map((_, i) => (
										<div key={i} className="space-y-2">
											<Skeleton className="aspect-2/3 rounded-xl" />
											<Skeleton className="h-4 w-4/5" />
											<Skeleton className="h-3 w-1/2" />
										</div>
									))
								: visible.map((a) => (
										<FlockCard
											key={a.id}
											anime={a}
											render={{
												type: true,
												score: true,
												episodeLabel: true,
												animeDescription: true,
												animeDescriptionType: "default",
												caption: true,
											}}
										/>
									))}
						</div>
					)}
				</section>
			) : (
				<FeatureGrid columns={5}>
					{items.map((anime) => (
						<FlockCard
							key={anime.id}
							anime={anime}
							render={render}
						/>
					))}
				</FeatureGrid>
			)}

			{/* <FeatureGrid columns={5}>
				{items.map((anime) => (
					<FlockCard key={anime.id} anime={anime} render={render} />
				))}
			</FeatureGrid> */}
		</section>
	);
}
