import { Link } from "react-router-dom";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/platform/theme/index.js";
import AnimeSearch from "@/modules/gateway/components/AnimeSearch.jsx";

const THEME_CYCLE = ["light", "dark", "system"];
const ICONS = { light: Sun, dark: Moon, system: Monitor };
const NEXT_LABEL = {
	light: "Switch to dark theme",
	dark: "Switch to system theme",
	system: "Switch to light theme",
};

export function SiteHeader() {
	const { theme, setTheme } = useTheme();
	const Icon = ICONS[theme] ?? Monitor;

	const cycleTheme = () => {
		const next =
			THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];
		setTheme(next);
	};

	return (
		<header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
			<div className="container mx-auto flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
				<Link
					to="/"
					className="flex items-center gap-2 text-lg font-extrabold tracking-tight"
				>
					<span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
						S
					</span>
					Shepherd
				</Link>

				<div className="order-last w-full md:order-0 md:mx-auto md:w-auto md:flex-1 md:max-w-xl">
					<AnimeSearch />
				</div>

				<button
					onClick={cycleTheme}
					aria-label={NEXT_LABEL[theme]}
					title={NEXT_LABEL[theme]}
					className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-border bg-muted/60 transition-colors hover:bg-muted md:ml-0"
				>
					<Icon className="h-4 w-4" />
				</button>
			</div>
		</header>
	);
}
