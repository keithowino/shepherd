import { AnimeSearch } from "../components/index.js";
import { AnimeGrid } from "@/components/ui/custom/AnimeGrid";

const Landing = () => {
	return (
		<main className="space-y-8">
			<div className="px-4 pt-6">
				<AnimeSearch />
			</div>

			<AnimeGrid />
		</main>
	);
};

export default Landing;
