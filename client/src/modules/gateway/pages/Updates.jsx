import { MetaDataInsert } from "@/lib/index.js";
import { AnimeGrid } from "@/components/ui/custom/AnimeGrid";

const Updates = () => {
	return (
		<>
			<MetaDataInsert title="Updates" />

			<section className="space-y-6">
				<h1 className="text-2xl font-bold tracking-tight md:text-3xl">
					Recently updated
				</h1>
				<AnimeGrid />
			</section>
		</>
	);
};

export default Updates;
