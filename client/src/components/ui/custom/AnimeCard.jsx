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
			to={`/shepherd/anime/${anime.id}`}
			className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
		>
			<article>
				{/* Fixed 2:3 frame => every card has the same poster size */}
				<div className="relative aspect-2/3 overflow-hidden rounded-xl bg-muted ring-1 ring-border transition group-hover:ring-2 group-hover:ring-primary">
					{anime.poster && (
						<img
							src={anime.poster}
							alt={anime.title}
							loading="lazy"
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					)}

					<div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
						{type ? (
							<span className="rounded-md bg-black/65 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
								{type}
							</span>
						) : (
							<span />
						)}
						{score && (
							<span className="flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
								<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
								{score}
							</span>
						)}
					</div>

					<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/40 to-transparent p-2 pt-10">
						{episodeLabel && (
							<span className="text-[11px] font-semibold text-white">
								{episodeLabel}
							</span>
						)}
					</div>

					<div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
						<span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
							<Play className="h-5 w-5 fill-current" />
						</span>
					</div>
				</div>

				<div className="mt-2 space-y-1 px-0.5">
					{/* min-h reserves two lines so long and short titles line up */}
					<h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5">
						{anime.title}
					</h3>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						{airing && (
							<span className="flex items-center gap-1 text-primary">
								<span className="h-1.5 w-1.5 rounded-full bg-primary" />
								Airing
							</span>
						)}
						{anime.year && <span>{anime.year}</span>}
						{genres[0] && (
							<span className="truncate">
								{genres.join(", ")}
							</span>
						)}
					</div>
				</div>
			</article>
		</Link>
	);
};
