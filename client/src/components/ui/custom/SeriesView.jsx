import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Frame } from "./Frame";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "@/components/ui/index.js";
import { Card, CardContent } from "@/components/ui/card";

export const editEpisodeTitle = (title) => {
	return title.spit(" ").slice(0, 2);
};

export const SeriesView = ({ id, onBack }) => {
	const [data, setData] = useState(null);
	const [active, setActive] = useState(null);
	const [mode, setMode] = useState("sub");
	const [error, setError] = useState(null);

	useEffect(() => {
		setData(null);
		setError(null);
		api.series(id)
			.then((d) => {
				setData(d);
				setActive(d.episodes?.[0] ?? null);
			})
			.catch((e) => setError(e.message));
	}, [id]);

	if (error) return <p className="text-destructive">{error}</p>;
	if (!data) return <p>Loading…</p>;
	if (!data.anime)
		return <p className="text-destructive">Series not found.</p>;

	const { anime, episodes } = data;

	const src = active?.embedUrls?.[mode] ?? active?.embedUrls?.sub;

	const episodeTitle =
		(active?.title || active?.jpTitle)
			.split(" ")
			.slice(0, 1)
			.join("")
			.toLowerCase() === "episode";

	console.log(episodeTitle);

	return (
		<div className="space-y-4">
			<Button variant="ghost" onClick={onBack}>
				← Back
			</Button>

			<FeatureGrid columns={3}>
				<div className="col-span-2 bg-muted rounded-lg">
					{src && (
						<Frame
							src={src}
							title={`${data.anime.title} – EP ${active.number}`}
						/>
					)}

					<div className="flex items-center justify-between py-2 md:py-4 px-2 gap-2">
						<div>
							<p>
								{episodeTitle ? (
									<span className="">
										{active?.title || active?.jpTitle}
									</span>
								) : (
									<span className="truncate">
										{active?.title || active?.jpTitle}
										{` EP: ${active?.number}`}
									</span>
								)}
							</p>
						</div>
						<div>
							<Button
								size="sm"
								variant={mode === "sub" ? "default" : "outline"}
								onClick={() => setMode("sub")}
							>
								SUB
							</Button>
							<Button
								size="sm"
								variant={mode === "dub" ? "default" : "outline"}
								disabled={!active?.embedUrls?.dub}
								onClick={() => setMode("dub")}
							>
								DUB
							</Button>
						</div>
					</div>
				</div>

				<Card>
					<CardContent className="flex flex-wrap gap-2">
						{episodes.map((ep) => (
							<Button
								key={ep._id ?? ep.id}
								size="sm"
								variant={
									active?._id === ep._id ||
									active?.id === ep.id
										? "default"
										: "outline"
								}
								className="bg-amber-400"
								onClick={() => setActive(ep)}
							>
								EP {ep.number}
							</Button>
						))}
					</CardContent>
				</Card>
			</FeatureGrid>

			<div className="flex gap-4">
				{anime.poster && (
					<img
						src={anime.poster}
						alt={data.anime.title}
						className="w-32 rounded-lg"
					/>
				)}
				<div>
					<h2 className="text-xl font-semibold">
						{data.anime.title}
					</h2>
					<p className="text-sm text-muted-foreground line-clamp-3">
						{data.anime.description}
					</p>
				</div>
			</div>
		</div>
	);
};
