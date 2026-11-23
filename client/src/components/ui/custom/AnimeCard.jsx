import { Link } from "react-router-dom";
import { Play, Star } from "lucide-react";

export const AnimeCard = ({ anime }) => {
	const type = anime.terms_by_type?.type?.[0];
	const genres = anime.terms_by_type?.genre?.slice(0, 2) ?? [];
	const score =
		Number(anime.score) > 0 ? Number(anime.score).toFixed(1) : null;
	const airing = anime.status === "Currently Airing";

	// "8 / 12" while airing, just the total once finished
	const released = anime.is_sub || null;
	const total = anime.episodes || null;
	const episodeLabel =
		released && total && airing
			? `EP ${released} / ${total}`
			: total
				? `${total} eps`
				: released
					? `EP ${released}`
					: null;

	return (
		<Link
			to={`/anime/${anime.id}`}
			className="group mx-auto block w-full max-w-40 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-44 lg:max-w-48"
		>
			<article>
				{/* Fixed 2:3 frame => every card has the same poster size */}
				<div className="relative aspect-2/3 overflow-hidden rounded-lg bg-muted ring-1 ring-border transition group-hover:ring-2 group-hover:ring-primary">
					{anime.poster && (
						<img
							src={anime.poster}
							alt={anime.title}
							loading="lazy"
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					)}

					<div className="absolute inset-x-0 top-0 flex items-start justify-between p-1.5 sm:p-2">
						{type ? (
							<span className="rounded-md bg-black/65 px-1 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm sm:text-[11px]">
								{type}
							</span>
						) : (
							<span />
						)}
						{score && (
							<span className="flex items-center gap-0.5 rounded bg-black/65 px-1 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm sm:gap-1 sm:text-[11px]">
								<Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400 sm:h-3 sm:w-3" />
								{score}
							</span>
						)}
					</div>

					<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/40 to-transparent p-1.5 pt-8 sm:p-2 sm:pt-10">
						{episodeLabel && (
							<span className="text-[10px] font-semibold text-white sm:text-[11px]">
								{episodeLabel}
							</span>
						)}
					</div>

					{/* Hover-only affordance: hidden on touch screens by the hover media query */}
					<div className="absolute inset-0 hidden place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 sm:grid">
						<span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
							<Play className="h-4 w-4 fill-current" />
						</span>
					</div>
				</div>

				<div className="mt-1.5 space-y-0.5 px-0.5 sm:mt-2 sm:space-y-1">
					{/* min-h reserves two lines so long and short titles line up */}
					<h3 className="line-clamp-2 min-h-8 text-xs leading-4 font-semibold sm:min-h-10 sm:text-sm sm:leading-5">
						{anime.title}
					</h3>
					<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:gap-2 sm:text-xs">
						{airing && (
							<span className="flex items-center gap-1 text-primary">
								<span className="h-1.5 w-1.5 rounded-full bg-primary" />
								Airing
							</span>
						)}
						{anime.year && <span>{anime.year}</span>}
						{genres[0] && (
							<span
								className="hidden truncate sm:inline"
								title={genres.join(", ")}
							>
								{genres.join(", ")}
							</span>
						)}
					</div>
				</div>
			</article>
		</Link>
	);
};
