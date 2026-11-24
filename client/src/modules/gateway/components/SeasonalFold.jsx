import { Link } from "react-router-dom";
import { Star } from "lucide-react";

import { SectionEyebrow } from "./SectionEyebrow.jsx";

/**
 * A seasonal "fold" — one large feature poster beside a
 * vertical stack of companions. Editorial, not a grid; the
 * shepherd gathers this season's flock into a single fold.
 */
export function SeasonalFold({ seb, items }) {
	if (!items?.length) return null;

	const [feature, ...rest] = items;
	const companions = rest.slice(0, 4);

	return (
		<section className="container mx-auto px-4">
			<SectionEyebrow
				eyebrow={
					seb.eyebrow
						? `Seasonal fold · ${seb.eyebrow}`
						: "Seasonal fold"
				}
			/>

			<div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
				{/* Feature */}
				<Link
					to={`/anime/${feature.id}`}
					className="group relative overflow-hidden rounded-2xl ring-1 ring-border transition hover:ring-2 hover:ring-primary"
				>
					<div className="aspect-16/10 w-full">
						{feature.poster ? (
							<img
								src={feature.poster}
								alt={feature.title}
								className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
							/>
						) : (
							<div className="h-full w-full bg-muted" />
						)}
					</div>

					<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-4 pt-16 md:p-6 md:pt-20">
						<p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
							{feature.type ?? "Series"}
							{feature.year ? ` · ${feature.year}` : ""}
						</p>
						<h3 className="mt-1 line-clamp-2 text-lg font-bold text-white md:text-2xl">
							{feature.title}
						</h3>
						{feature.description && (
							<p className="mt-2 line-clamp-2 max-w-xl text-xs text-white/80 md:text-sm">
								{feature.description}
							</p>
						)}
					</div>
				</Link>

				{/* Companions */}
				<div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:grid-rows-4">
					{companions.map((anime) => (
						<Link
							key={anime.id}
							to={`/anime/${anime.id}`}
							className="group flex items-center gap-3 rounded-xl p-1 transition hover:bg-muted/60"
						>
							<div className="relative aspect-2/3 w-14 shrink-0 overflow-hidden rounded-md ring-1 ring-border">
								{anime.poster && (
									<img
										src={anime.poster}
										alt={anime.title}
										loading="lazy"
										className="h-full w-full object-cover"
									/>
								)}
							</div>
							<div className="min-w-0">
								<p className="line-clamp-2 text-xs font-semibold leading-tight sm:text-sm">
									{anime.title}
								</p>
								<p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
									{anime.score != null && (
										<>
											<Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
											{anime.score.toFixed(1)}
											<span aria-hidden>·</span>
										</>
									)}
									{anime.type ?? "TV"}
								</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
