import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";

import { api } from "@/lib/api";
import { Frame } from "@/components/ui/custom/Frame";
import { EpisodeList } from "@/components/ui/custom/EpisodeList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MetaDataInsert } from "@/lib/index.js";

const Player = () => {
	const [data, setData] = useState(null);
	const [active, setActive] = useState(null);
	const [mode, setMode] = useState("sub");
	const [error, setError] = useState(null);
	const [expanded, setExpanded] = useState(false);

	const { id } = useParams();

	useEffect(() => {
		setData(null);
		setError(null);
		setExpanded(false);
		api.series(id)
			.then((d) => {
				setData(d);
				setActive(d.episodes?.[0] ?? null);
			})
			.catch((e) => setError(e.message));
	}, [id]);

	if (error) return <p className="text-destructive">{error}</p>;

	if (!data) {
		return (
			<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<Skeleton className="aspect-video rounded-xl" />
				<Skeleton className="h-72 rounded-xl" />
			</div>
		);
	}

	if (!data.anime)
		return <p className="text-destructive">Series not found.</p>;

	const { anime, episodes } = data;

	// If DUB doesn't exist for this episode we fall back to SUB
	const hasDub = Boolean(active?.embedUrls?.dub);
	const src = active?.embedUrls?.[mode] ?? active?.embedUrls?.sub;

	const rawTitle = active?.title || active?.jpTitle || "";
	const isGeneric = /^episode\s*\d+$/i.test(rawTitle.trim());
	const episodeTitle = !active
		? ""
		: isGeneric || !rawTitle
			? `Episode ${active.number}`
			: `EP ${active.number}: ${rawTitle}`;

	const genres = anime.termsByType?.genre ?? [];
	const type = anime.termsByType?.type?.[0];
	const score =
		Number(anime.score) > 0 ? Number(anime.score).toFixed(1) : null;

	const facts = [type, anime.year, anime.season, anime.status].filter(
		Boolean,
	);

	return (
		<>
			<MetaDataInsert
				title={anime.title || anime.native || anime.alternative}
			/>

			<div className="space-y-6">
				<div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
					<section className="overflow-hidden rounded-xl border border-border bg-card">
						{src ? (
							<Frame
								src={src}
								title={`${anime.title} – EP ${active.number}`}
							/>
						) : (
							<div className="grid aspect-video place-items-center bg-muted text-sm text-muted-foreground">
								No episodes available yet.
							</div>
						)}

						<div className="flex items-center justify-between gap-3 px-4 py-3">
							<p className="min-w-0 truncate text-sm font-medium md:text-base">
								{episodeTitle}
							</p>

							<div className="flex shrink-0 overflow-hidden rounded-full border border-border">
								<Button
									size="sm"
									variant={
										mode === "sub" ? "default" : "ghost"
									}
									className="rounded-none"
									onClick={() => setMode("sub")}
								>
									SUB
								</Button>
								<Button
									size="sm"
									variant={
										mode === "dub" && hasDub
											? "default"
											: "ghost"
									}
									className="rounded-none"
									disabled={!hasDub}
									onClick={() => setMode("dub")}
								>
									DUB
								</Button>
							</div>
						</div>
					</section>

					<EpisodeList
						episodes={episodes}
						activeId={active?._id}
						onSelect={setActive}
					/>
				</div>

				<section className="flex gap-4 md:gap-6">
					{anime.poster && (
						<img
							src={anime.poster}
							alt={anime.title}
							className="aspect-2/3 w-28 shrink-0 self-start rounded-xl object-cover ring-1 ring-border sm:w-40"
						/>
					)}

					<div className="min-w-0 space-y-3">
						<div>
							<h1 className="text-xl font-bold tracking-tight md:text-2xl">
								{anime.title}
							</h1>
							{anime.native && (
								<p className="text-sm text-muted-foreground">
									{anime.native}
								</p>
							)}
						</div>

						<div className="flex flex-wrap items-center gap-2 text-xs">
							{score && (
								<span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-semibold">
									<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
									{score}
								</span>
							)}
							{facts.map((f) => (
								<span
									key={f}
									className="rounded-md bg-muted px-2 py-1 capitalize"
								>
									{f}
								</span>
							))}
							{genres.map((g) => (
								<span
									key={g}
									className="rounded-md border border-border px-2 py-1 text-muted-foreground"
								>
									{g}
								</span>
							))}
						</div>

						{anime.description && (
							<div>
								<p
									className={
										"text-sm leading-relaxed text-muted-foreground " +
										(expanded ? "" : "line-clamp-4")
									}
								>
									{anime.description}
								</p>
								<button
									onClick={() => setExpanded((v) => !v)}
									className="mt-1 text-xs font-medium text-primary"
								>
									{expanded ? "Show less" : "Read more"}
								</button>
							</div>
						)}
					</div>
				</section>
			</div>
		</>
	);
};

export default Player;
