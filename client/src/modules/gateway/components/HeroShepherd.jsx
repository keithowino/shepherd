import { Link } from "react-router-dom";
import { ArrowRight, Compass, Dices } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The hero frames the site as a guide to the flock, not a
 * catalog. The "flock line" beneath the copy is a single
 * edge-bleeding row of poster thumbnails at varying heights,
 * like sheep dotted along a hill.
 */
export function HeroShepherd({ flock, vettedFlock, loading, onStray }) {
	const ribbon = vettedFlock.slice(0, 14);

	return (
		<section className="relative isolate -mx-4 -mt-6 overflow-hidden px-4">
			{/* Soft sunrise wash */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_60%)]"
			/>
			<Stars />

			<div className="container mx-auto px-4 pt-10 pb-8 md:pt-16 md:pb-10">
				<p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
					The shepherd&rsquo;s index
				</p>

				<h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
					Every story needs
					<br />
					<span className="text-primary">someone watching</span> over
					it.
				</h1>

				<p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
					No billboards, no autoplay. Shepherd tends a flock of series
					— airing, finished, the late-night strays, and
					long-forgotten — and brings the ones worth your time
					forward.
				</p>

				<div className="mt-6 flex flex-wrap items-center gap-3">
					<Button
						size="lg"
						className="rounded-full max-[375px]:w-full"
					>
						<Link to="/updates" className="flex gap-1 items-center">
							Walk the flock
							<ArrowRight className="ml-1 h-4 w-4" />
						</Link>
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="rounded-full max-[375px]:w-full"
						onClick={onStray}
						disabled={loading || flock.length === 0}
					>
						<Dices className="mr-1 h-4 w-4" />
						Send me a stray
					</Button>
				</div>
			</div>

			{/* Flock line — signature element */}
			{loading ? (
				<div className="relative -mb-2">
					<div className="flex items-end gap-3 px-4 pb-2 mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
						{Array.from({ length: 14 }).map((_, i) => {
							const tall = i % 3 === 0;

							return (
								<Skeleton
									key={i}
									className={
										"relative shrink-0 rounded-lg" +
										(tall
											? "h-40 w-28 md:h-52 md:w-36"
											: "h-32 w-24 md:h-40 md:w-28")
									}
								/>
							);
						})}
					</div>
				</div>
			) : (
				ribbon.length > 0 && (
					<div className="relative -mb-2 overflow-hidden">
						<div className="flex items-end gap-3 px-4 pb-2 mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
							{ribbon.map((anime, i) => {
								/**
								 * Alternating heights make the row read like
								 * a hillside, not a filmstrip.
								 */
								const tall = i % 3 === 0;
								return (
									<Link
										key={anime.id}
										to={`/anime/${anime.id}`}
										title={anime.title}
										className={
											"group relative shrink-0 overflow-hidden rounded-lg ring-1 ring-border transition " +
											"hover:ring-2 hover:ring-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none " +
											(tall
												? "h-40 w-28 md:h-52 md:w-36"
												: "h-32 w-24 md:h-40 md:w-28")
										}
									>
										{anime.poster ? (
											<img
												src={anime.poster}
												alt={anime.title}
												loading={
													i < 6 ? "eager" : "lazy"
												}
												className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
											/>
										) : (
											<div className="h-full w-full bg-muted" />
										)}
										{anime.airing && (
											<span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
												<span className="h-1 w-1 rounded-full bg-primary" />
												Airing
											</span>
										)}
									</Link>
								);
							})}
						</div>
					</div>
				)
			)}
		</section>
	);
}

/**
|--------------------------------------------------
| decorative bits 
|--------------------------------------------------
*/
function Stars() {
	// Fixed positions so SSR/re-renders stay stable.
	const stars = [
		[8, 12, 2],
		[18, 40, 1],
		[27, 8, 1.5],
		[41, 28, 1],
		[55, 10, 2],
		[63, 36, 1],
		[72, 16, 1.5],
		[83, 6, 1],
		[90, 30, 2],
		[95, 14, 1],
		[12, 62, 1],
		[48, 55, 1.5],
	];
	return (
		<div aria-hidden className="pointer-events-none absolute inset-0">
			{stars.map(([x, y, s], i) => (
				<span
					key={i}
					className="absolute rounded-full bg-foreground/50 motion-safe:animate-pulse"
					style={{
						left: `${x}%`,
						top: `${y}%`,
						width: s * 2,
						height: s * 2,
						animationDelay: `${i * 260}ms`,
						animationDuration: "3.2s",
					}}
				/>
			))}
		</div>
	);
}
