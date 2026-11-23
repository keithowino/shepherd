import { BrowserRouter } from "react-router-dom";
import RouterConfiguration from "./RouteConfiguration.jsx";
import { ScrollToTop, SiteHeader } from "../layouts/index.js";

const THEME_CYCLE = ["light", "dark", "system"];

export function AppRouter() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<SiteHeader />
			<main className="container mx-auto px-4 py-6 md:py-8">
				<RouterConfiguration />
			</main>
		</BrowserRouter>
	);
}
