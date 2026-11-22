// import { useState } from "react";
// import { AnimeGrid } from "@/components/ui/custom/AnimeGrid";
// import { SeriesView } from "@/components/ui/custom/SeriesView";
// import { useTheme } from "./platform/theme";
// import { motion } from "framer-motion";
// import { Moon, Sun, Monitor } from "lucide-react";

// import { Link } from "react-router-dom";
import { AppProviders, AppRouter } from "./app/index.js";
// import { useTheme } from "./platform/theme/index.js";
// import { motion } from "framer-motion";
// import { Moon, Sun, Monitor } from "lucide-react";

// const THEME_CYCLE = ["light", "dark", "system"];

// const App = () => {
// 	const { theme, setTheme } = useTheme();
// 	const [seriesId, setSeriesId] = useState(null);

// 	const cycleTheme = () => {
// 		const currentIndex = THEME_CYCLE.indexOf(theme);
// 		const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
// 		setTheme(nextTheme);
// 	};

// 	const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

// 	// Position the thumb based on the current theme
// 	const thumbPosition = theme === "light" ? 2 : theme === "dark" ? 28 : 15;

// 	const label =
// 		theme === "dark"
// 			? "Switch to system theme"
// 			: theme === "light"
// 				? "Switch to dark theme"
// 				: "Switch to light theme";

// 	return (
// 		<div className="min-h-screen">
// 			<div className="container mx-auto py-8 px-4 space-y-6">
// 				<section className="flex items-center justify-between p-5 bg-primary rounded-xl text-primary-foreground">
// 					<h1 className="uppercase">SHEPHERD</h1>

// 					<button
// 						onClick={cycleTheme}
// 						aria-label={label}
// 						title={label}
// 						className="relative inline-flex h-8 w-14 items-center border border-border bg-muted hover:bg-muted/70 transition-colors"
// 					>
// 						<motion.div
// 							animate={{ x: thumbPosition }}
// 							transition={{
// 								type: "spring",
// 								stiffness: 500,
// 								damping: 30,
// 							}}
// 							className="absolute flex h-6 w-6 items-center justify-center bg-primary text-primary-foreground"
// 						>
// 							<Icon className="h-3.5 w-3.5" />
// 						</motion.div>
// 					</button>
// 				</section>

// 				{seriesId == null ? (
// 					<AnimeGrid onSelect={setSeriesId} />
// 				) : (
// 					<SeriesView
// 						id={seriesId}
// 						onBack={() => setSeriesId(null)}
// 					/>
// 				)}
// 			</div>
// 		</div>
// 	);
// };

// export default App;

// // ...

// const THEME_CYCLE = ["light", "dark", "system"];

export default function App() {
	// const { theme, setTheme } = useTheme();

	// const cycleTheme = () => {
	// 	const currentIndex = THEME_CYCLE.indexOf(theme);
	// 	const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
	// 	setTheme(nextTheme);
	// };

	// const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

	// // Position the thumb based on the current theme
	// const thumbPosition = theme === "light" ? 2 : theme === "dark" ? 28 : 15;

	// const label =
	// 	theme === "dark"
	// 		? "Switch to system theme"
	// 		: theme === "light"
	// 			? "Switch to dark theme"
	// 			: "Switch to light theme";
	return (
		<AppProviders>
			<div className="min-h-screen">
				<div className="container mx-auto py-8 px-4 space-y-6">
					{/* <section className="flex items-center justify-between p-5 bg-primary rounded-xl text-primary-foreground">
						<Link to="/">SHEPHERD</Link>

						<button
							onClick={cycleTheme}
							aria-label={label}
							title={label}
							className="relative inline-flex h-8 w-14 items-center border border-border bg-muted hover:bg-muted/70 transition-colors"
						>
							<motion.div
								animate={{ x: thumbPosition }}
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 30,
								}}
								className="absolute flex h-6 w-6 items-center justify-center bg-primary text-primary-foreground"
							>
								<Icon className="h-3.5 w-3.5" />
							</motion.div>
						</button>
					</section> */}
					<AppRouter />
				</div>
			</div>
		</AppProviders>
	);
}
