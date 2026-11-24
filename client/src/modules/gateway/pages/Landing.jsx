import { MetaDataInsert } from "@/lib/index.js";
import { platform } from "@/platform/config/index.js";
import { Skeleton } from "@/components/ui/skeleton";

import { useLandingData } from "../hooks/index.js";
import {
	FlockSection,
	HeroShepherd,
	PastureStrip,
	SeasonalFold,
} from "../components/index.js";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Dices } from "lucide-react";

const Landing = () => {
	const { flock, airing, arrivals, seasonalPick, longKept, loading, error } =
		useLandingData();
	const navigate = useNavigate();

	const sendStray = () => {
		if (!flock.length) return;
		const pick = flock[Math.floor(Math.random() * flock.length)];
		navigate(`/anime/${pick.id}`);
	};

	return (
		<>
			<MetaDataInsert title={platform.name} />

			<HeroShepherd
				flock={flock}
				vettedFlock={[...airing, ...arrivals]}
				loading={loading}
				onStray={sendStray}
			/>

			{error && (
				<div className="container mx-auto px-4 py-6">
					<p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
						{error}
					</p>
				</div>
			)}

			{loading ? (
				<LandingSkeleton />
			) : (
				<div className="space-y-12 py-6 md:space-y-16 md:py-10">
					<PastureStrip items={airing} />

					<FlockSection
						// seb={{
						// 	eyebrow: "The Flock",
						// 	title: "Grazing right now",
						// 	note: "Freshly updated, straight from the pasture.",
						// 	href: "/updates",
						// 	linkLabel: "See all recent",
						// }}
						items={flock}
						loading={loading}
						error={error}
						flockAction="graze-pasture"
					/>

					<FlockSection
						seb={{
							eyebrow: "The Flock",
							title: "Grazing right now",
							note: "Freshly updated, straight from the pasture.",
							href: "/updates",
							linkLabel: "See all recent",
						}}
						items={arrivals}
					/>

					<SeasonalFold
						seb={{ eyebrow: seasonalPick.label }}
						items={seasonalPick.items}
					/>

					<FlockSection
						seb={{
							eyebrow: "Long-kept flock · finished & scored",
							href: "/updates",
							linkLabel: "See all",
						}}
						emphasis="longKept"
						items={longKept}
					/>

					<StrayBanner
						onStray={sendStray}
						disabled={loading || !flock.length}
					/>
				</div>
			)}
		</>
	);
};

/**
|--------------------------------------------------
| the stray 
|--------------------------------------------------
*/
function StrayBanner({ onStray, disabled }) {
	return (
		<section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center md:p-12">
			<div
				aria-hidden
				className="absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
			/>
			<p className="relative text-xs font-semibold tracking-[0.2em] text-primary uppercase">
				Lost sheep
			</p>
			<h2 className="relative mt-2 text-2xl font-bold tracking-tight md:text-3xl">
				Can&apos;t decide what to watch?
			</h2>
			<p className="relative mx-auto mt-2 max-w-md text-sm text-muted-foreground">
				A good shepherd never leaves anyone wandering. Let us pick one
				from the flock and lead you to it.
			</p>
			<Button
				onClick={onStray}
				disabled={disabled}
				size="lg"
				className="relative mt-6 rounded-full"
			>
				<Dices className="mr-1 h-4 w-4" />
				Lead me somewhere
			</Button>
		</section>
	);
}

function LandingSkeleton() {
	return (
		<div className="space-y-12 py-6 md:py-10">
			<section className="container mx-auto px-4">
				<Skeleton className="mb-4 h-3 w-40" />
				<div className="flex gap-3 overflow-hidden">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton
							key={i}
							className="h-40 w-36 shrink-0 rounded-xl"
						/>
					))}
				</div>
			</section>

			<section className="container mx-auto px-4">
				<Skeleton className="mb-4 h-3 w-40" />
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="aspect-2/3 rounded-xl" />
							<Skeleton className="h-4 w-4/5" />
							<Skeleton className="h-3 w-1/2" />
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

export default Landing;
