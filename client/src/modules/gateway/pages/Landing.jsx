import { MetaDataInsert } from "@/lib/index.js";
import { AnimeGrid } from "@/components/ui/custom/AnimeGrid";

import { platform } from "@/platform/config/index.js";

const Landing = () => {
	return (
		<>
			<MetaDataInsert title={platform.name} />

			<section className="space-y-6">
				<h1 className="text-2xl font-bold tracking-tight md:text-3xl">
					Recently updated
				</h1>
				<AnimeGrid />
			</section>
		</>
	);
};

export default Landing;
