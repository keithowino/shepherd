import { Link } from "react-router-dom";
import { SectionEyebrow } from "./SectionEyebrow.jsx";
import { FlockCard } from "@/components/ui/custom/FlockCard.jsx";

/**
 * Airing shows, framed as the part of the flock the shepherd
 * visits daily. Horizontal scroll because airing is an
 * open-ended stream, not a bounded set.
 */
export function PastureStrip({ items }) {
	if (!items?.length) return null;

	return (
		<section className="container mx-auto px-4">
			<SectionEyebrow
				eyebrow="The Night Watch"
				title="Next to wake"
				note="Episodes landing soon, counted down for you."
				action={
					<Link
						to="/updates"
						className="text-xs font-medium text-primary hover:underline"
					>
						See all updates
					</Link>
				}
			/>

			<div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 scrollbar-none mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] pt-3">
				{items.map((anime) => (
					<FlockCard
						key={anime.id}
						anime={anime}
						className="w-36 shrink-0 snap-start sm:w-40"
						render={{
							animeDescription: true,
							animeDescriptionType: "countdown",
							score: true,
						}}
					/>
				))}
			</div>
		</section>
	);
}
