Now we have:

```text
~\client\src\App.jsx
```

```jsx
import { AppProviders, AppRouter } from "./app/index.js";

export default function App() {
	return (
		<AppProviders>
			<div className="min-h-screen">
				<AppRouter />
			</div>
		</AppProviders>
	);
}
```

```text
~\client\src\app\providers\AppProviders.jsx
```

```jsx
import { ThemeProvider } from "@/platform/theme/index.js";
import { HelmetProvider } from "react-helmet-async";

export function AppProviders({ children }) {
	return (
		<ThemeProvider>
			<HelmetProvider>{children}</HelmetProvider>
		</ThemeProvider>
	);
}
```

```text
~\client\src\app\router\AppRouter.jsx
```

```jsx
import { BrowserRouter } from "react-router-dom";
import RouterConfiguration from "./RouteConfiguration.jsx";
import { ScrollToTop, SiteHeader } from "../layouts/index.js";

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
```

```text
~\client\src\app\layouts\SiteHeader.jsx
```

```jsx
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
```

```text
~\client\src\app\router\RouteConfiguration.jsx
```

```jsx
import { Navigate, useRoutes } from "react-router-dom";
import { gatewayRoutes } from "../../modules/index.js";

function ApplicationRoutes() {
	return useRoutes([
		...gatewayRoutes,
		{
			path: "*",
			element: <Navigate to="/" replace />,
		},
	]);
}

export default function RouterConfiguration() {
	return <ApplicationRoutes />;
}
```

```text
~\client\src\modules\gateway\routes\gateway.routes.jsx
```

```jsx
import { AnimeLayout } from "../layouts/index.js";
import { Landing, Player, Updates } from "../pages/index.js";

const gatewayRoutes = [
	{
		path: "/",
		element: <Landing />,
	},
	{
		element: <AnimeLayout />,
		children: [
			{
				path: "/updates",
				element: <Updates />,
			},
			{
				path: "/anime/:id",
				element: <Player />,
			},
		],
	},
];

export default gatewayRoutes;
```

```text
~\client\src\modules\gateway\pages\Landing.jsx
```

```jsx
import { MetaDataInsert } from "@/lib/index.js";
import { platform } from "@/platform/config/index.js";

const Landing = () => {
	return (
		<>
			<MetaDataInsert title={platform.name} />

			<div>Landing</div>
		</>
	);
};

export default Landing;
```

```text
~\client\src\modules\gateway\layouts\AnimeLayout.jsx
```

```jsx
import { Outlet } from "react-router-dom";

const AnimeLayout = () => {
	return (
		<div>
			<Outlet />
		</div>
	);
};

export default AnimeLayout;
```

```text
~\client\src\modules\gateway\pages\Updates.jsx
```

```jsx
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
```

```text
~\client\src\components\ui\custom\AnimeGrid.jsx
```

```jsx
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { FlockCard } from "./FlockCard";
import { Skeleton } from "@/components/ui/skeleton";
import NextAndPrevious from "./NextAndPrevious";
import { FeatureGrid } from "./layout/index.js";
import { useSearchParams } from "react-router-dom";

const PER_PAGE = 20;

function getPageFromSearchParams(searchParams) {
	const rawPage = searchParams.get("page");

	if (rawPage === null) {
		return {
			page: 1,
			isValid: true,
			shouldNormalize: false,
		};
	}

	const parsedPage = Number(rawPage);

	const isValid =
		/^[1-9]\d*$/.test(rawPage) && Number.isSafeInteger(parsedPage);

	return {
		page: isValid ? parsedPage : 1,
		isValid,
		shouldNormalize: !isValid || rawPage === "1",
	};
}

function getPageNumbers(currentPage, totalPages) {
	if (totalPages <= 1) return [1];

	const pages = [1];

	const start = Math.max(2, currentPage - 1);
	const end = Math.min(totalPages - 1, currentPage + 1);

	if (start > 2) {
		pages.push("ellipsis");
	}

	for (let page = start; page <= end; page++) {
		pages.push(page);
	}

	if (end < totalPages - 1) {
		pages.push("ellipsis");
	}

	pages.push(totalPages);

	return pages;
}

export const AnimeGrid = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const {
		page,
		isValid: isValidPageParam,
		shouldNormalize,
	} = getPageFromSearchParams(searchParams);

	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let active = true;
		let shouldRefetch = false;

		setLoading(true);
		setError(null);

		/**
		 * Normalize malformed or noncanonical page parameters.
		 */
		if (shouldNormalize) {
			setSearchParams(
				(previousParams) => {
					const nextParams = new URLSearchParams(previousParams);

					nextParams.delete("page");

					return nextParams;
				},
				{ replace: true },
			);

			return () => {
				active = false;
			};
		}

		api.recent(page, PER_PAGE)
			.then((response) => {
				if (!active) return;

				const totalPages = Math.max(
					1,
					Number(response.pagination?.total_pages) || 1,
				);

				/**
				 * Correct page requests exceeding the available pages.
				 */
				if (page > totalPages) {
					shouldRefetch = true;

					setSearchParams(
						(previousParams) => {
							const nextParams = new URLSearchParams(
								previousParams,
							);

							if (totalPages === 1) {
								nextParams.delete("page");
							} else {
								nextParams.set("page", String(totalPages));
							}

							return nextParams;
						},
						{ replace: true },
					);

					return;
				}

				setResult(response);
			})
			.catch((err) => {
				if (active) {
					setError(err.message);
				}
			})
			.finally(() => {
				if (active && !shouldRefetch) {
					setLoading(false);
				}
			});

		return () => {
			active = false;
		};
	}, [page, shouldNormalize, setSearchParams]);

	const totalPages = result?.pagination?.total_pages ?? 1;
	const pageNumbers = getPageNumbers(page, totalPages);

	const handlePageChange = (event, nextPage) => {
		event.preventDefault();

		if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
			return;
		}

		setSearchParams((previousParams) => {
			const nextParams = new URLSearchParams(previousParams);

			if (nextPage === 1) {
				nextParams.delete("page");
			} else {
				nextParams.set("page", String(nextPage));
			}

			return nextParams;
		});
	};

	if (error) {
		return <p className="text-destructive">{error}</p>;
	}

	if (loading || !result) {
		return (
			<FeatureGrid columns={5}>
				{Array.from({ length: PER_PAGE }).map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="aspect-2/3 rounded-xl" />
						<Skeleton className="h-4 w-4/5" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				))}
			</FeatureGrid>
		);
	}

	return (
		<div className="space-y-8">
			<FeatureGrid columns={5}>
				{result.items.map((anime) => (
					<FlockCard
						key={anime.id}
						anime={anime}
						render={{
							type: true,
							score: true,
							episodeLabel: true,
							animeDescription: true,
							caption: true,
						}}
					/>
				))}
			</FeatureGrid>

			<NextAndPrevious
				handlePageChange={handlePageChange}
				page={page}
				pageNumbers={pageNumbers}
				totalPages={totalPages}
			/>
		</div>
	);
};
```

```text
~\client\src\components\ui\custom\FlockCard.jsx
```

```jsx
import { Link } from "react-router-dom";
import { Play, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const FlockCard = ({
	anime,
	imgLoader = "lazy",
	render = {
		type: false,
		score: false,
		episodeLabel: false,
		animeDescription: false,
		overlayDescription: false,
		caption: false,
	},
}) => {
	const type = anime.terms_by_type?.type?.[0];
	const genres = anime.terms_by_type?.genre?.slice(0, 2) ?? [];
	const score =
		Number(anime.score) > 0 ? Number(anime.score).toFixed(1) : null;
	const airing = anime.status === "Currently Airing";

	const released = anime.is_sub || null;
	const total = anime.episodes || null;
	const episodeLabel =
		released && total && airing
			? `EP ${released} / ${total}`
			: total
				? `${total} eps`
				: released
					? `EP ${released}`
					: null;

	return (
		<Link
			to={`/anime/${anime.id}`}
			className="group mx-auto block w-full max-w-40 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-44 lg:max-w-48"
		>
			<article>
				<div className="relative aspect-2/3 overflow-hidden rounded-xl bg-muted ring-1 ring-border transition group-hover:ring-2 group-hover:ring-primary">
					{anime.poster && (
						<img
							src={anime.poster}
							alt={anime.title}
							loading={imgLoader}
							className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					)}

					<div className="absolute inset-x-0 top-0 flex items-start justify-between p-1.5 sm:p-2">
						{render.caption && (
							<div className="flex gap-1">
								{anime.is_sub ? (
									<Badge
										variant="secondary"
										className="rounded"
									>
										SUB
									</Badge>
								) : null}
								{anime.is_dub ? (
									<Badge className="rounded">DUB</Badge>
								) : null}
							</div>
						)}
						{render.score && score && (
							<span className="flex items-center gap-0.5 rounded bg-black/65 px-1 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm sm:gap-1 sm:text-[11px]">
								<Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400 sm:h-3 sm:w-3" />
								{score}
							</span>
						)}
					</div>

					<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/40 to-transparent p-1.5 pt-8 sm:p-2 sm:pt-10">
						{render.episodeLabel && episodeLabel && (
							<span className="text-[10px] font-semibold text-white sm:text-[11px]">
								{episodeLabel}
							</span>
						)}
					</div>

					<div className="absolute inset-0 hidden place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 sm:grid">
						<span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
							<Play className="h-4 w-4 fill-current" />
						</span>
					</div>
				</div>

				{render.animeDescription && (
					<div className="mt-1.5 space-y-0.5 px-0.5 sm:mt-2 sm:space-y-1">
						<h3 className="line-clamp-2 min-h-8 text-xs leading-4 font-semibold sm:min-h-10 sm:text-sm sm:leading-5">
							{anime.title}
						</h3>
						<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:gap-2 sm:text-xs">
							{airing && (
								<span className="flex items-center gap-1 text-primary">
									<span className="h-1.5 w-1.5 rounded-full bg-primary" />
									Airing
								</span>
							)}
							{[type, anime.year].filter(Boolean).join(" · ")}
						</div>
					</div>
				)}

				{render.overlayDescription && (
					<div className="absolute rounded-b-xl inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-3 pt-10">
						<p className="line-clamp-2 text-xs font-semibold text-white">
							{anime.title}
						</p>
					</div>
				)}
			</article>
		</Link>
	);
};
```

```text
\client\src\lib\api.js
```

```js
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

async function getResponse(path, options = {}) {
	const res = await fetch(`${BASE}${path}`, options);
	const json = await res.json();

	if (!res.ok || json?.success === false) {
		throw new Error(
			json?.error?.message ?? `Request failed (${res.status})`,
		);
	}

	return json;
}

async function get(path, options = {}) {
	const json = await getResponse(path, options);
	return json.data;
}

export const api = {
	recent: async (page = 1, perPage = 20) => {
		const json = await getResponse(
			`/anime/recent?page=${page}&perPage=${perPage}`,
		);

		return {
			items: json.data,
			pagination: json.meta,
		};
	},

	search: (query, { limit = 10, signal } = {}) => {
		const params = new URLSearchParams({
			q: query,
			limit: String(limit),
		});

		return get(`/anime/search?${params.toString()}`, { signal });
	},

	series: (id) => get(`/anime/series/${id}`),
};
```

```text
~\client\src\modules\gateway\pages\Player.jsx
```

```jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";

import { api } from "@/lib/api";
import { Frame } from "@/components/ui/custom/Frame";
import { EpisodeList } from "@/components/ui/custom/EpisodeList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MetaDataInsert } from "@/lib/index.js";

const Player = () => {
	const [data, setData] = useState(null);
	const [active, setActive] = useState(null);
	const [mode, setMode] = useState("sub");
	const [error, setError] = useState(null);
	const [expanded, setExpanded] = useState(false);

	const { id } = useParams();

	useEffect(() => {
		setData(null);
		setError(null);
		setExpanded(false);
		api.series(id)
			.then((d) => {
				setData(d);
				setActive(d.episodes?.[0] ?? null);
			})
			.catch((e) => setError(e.message));
	}, [id]);

	if (error) return <p className="text-destructive">{error}</p>;

	if (!data) {
		return (
			<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<Skeleton className="aspect-video rounded-xl" />
				<Skeleton className="h-72 rounded-xl" />
			</div>
		);
	}

	if (!data.anime)
		return <p className="text-destructive">Series not found.</p>;

	const { anime, episodes } = data;

	// If DUB doesn't exist for this episode we fall back to SUB
	const hasDub = Boolean(active?.embedUrls?.dub);
	const src = active?.embedUrls?.[mode] ?? active?.embedUrls?.sub;

	const rawTitle = active?.title || active?.jpTitle || "";
	const isGeneric = /^episode\s*\d+$/i.test(rawTitle.trim());
	const episodeTitle = !active
		? ""
		: isGeneric || !rawTitle
			? `Episode ${active.number}`
			: `EP ${active.number}: ${rawTitle}`;

	const genres = anime.termsByType?.genre ?? [];
	const type = anime.termsByType?.type?.[0];
	const score =
		Number(anime.score) > 0 ? Number(anime.score).toFixed(1) : null;

	const facts = [type, anime.year, anime.season, anime.status].filter(
		Boolean,
	);

	return (
		<>
			<MetaDataInsert
				title={anime.title || anime.native || anime.alternative}
			/>

			<div className="space-y-6">
				<div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
					<section className="overflow-hidden rounded-xl border border-border bg-card">
						{src ? (
							<Frame
								src={src}
								title={`${anime.title} – EP ${active.number}`}
							/>
						) : (
							<div className="grid aspect-video place-items-center bg-muted text-sm text-muted-foreground">
								No episodes available yet.
							</div>
						)}

						<div className="flex items-center justify-between gap-3 px-4 py-3">
							<p className="min-w-0 truncate text-sm font-medium md:text-base">
								{episodeTitle}
							</p>

							<div className="flex shrink-0 overflow-hidden rounded-full border border-border">
								<Button
									size="sm"
									variant={
										mode === "sub" ? "default" : "ghost"
									}
									className="rounded-none"
									onClick={() => setMode("sub")}
								>
									SUB
								</Button>
								<Button
									size="sm"
									variant={
										mode === "dub" && hasDub
											? "default"
											: "ghost"
									}
									className="rounded-none"
									disabled={!hasDub}
									onClick={() => setMode("dub")}
								>
									DUB
								</Button>
							</div>
						</div>
					</section>

					<EpisodeList
						episodes={episodes}
						activeId={active?._id}
						onSelect={setActive}
					/>
				</div>

				<section className="flex gap-4 md:gap-6">
					{anime.poster && (
						<img
							src={anime.poster}
							alt={anime.title}
							className="aspect-2/3 w-28 shrink-0 self-start rounded-xl object-cover ring-1 ring-border sm:w-40"
						/>
					)}

					<div className="min-w-0 space-y-3">
						<div>
							<h1 className="text-xl font-bold tracking-tight md:text-2xl">
								{anime.title}
							</h1>
							{anime.native && (
								<p className="text-sm text-muted-foreground">
									{anime.native}
								</p>
							)}
						</div>

						<div className="flex flex-wrap items-center gap-2 text-xs">
							{score && (
								<span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-semibold">
									<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
									{score}
								</span>
							)}
							{facts.map((f) => (
								<span
									key={f}
									className="rounded-md bg-muted px-2 py-1 capitalize"
								>
									{f}
								</span>
							))}
							{genres.map((g) => (
								<span
									key={g}
									className="rounded-md border border-border px-2 py-1 text-muted-foreground"
								>
									{g}
								</span>
							))}
						</div>

						{anime.description && (
							<div>
								<p
									className={
										"text-sm leading-relaxed text-muted-foreground " +
										(expanded ? "" : "line-clamp-4")
									}
								>
									{anime.description}
								</p>
								<button
									onClick={() => setExpanded((v) => !v)}
									className="mt-1 text-xs font-medium text-primary"
								>
									{expanded ? "Show less" : "Read more"}
								</button>
							</div>
						)}
					</div>
				</section>
			</div>
		</>
	);
};

export default Player;
```

```text
~\client\src\index.css
```

```css
/* npx shadcn@latest init --preset bdvw9FeS --pointer */

@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/inter";

@custom-variant dark (&:is(.dark *));

@theme inline {
	--font-heading: var(--font-sans);
	--font-sans: "Inter Variable", sans-serif;
	--color-sidebar-ring: var(--sidebar-ring);
	--color-sidebar-border: var(--sidebar-border);
	--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
	--color-sidebar-accent: var(--sidebar-accent);
	--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
	--color-sidebar-primary: var(--sidebar-primary);
	--color-sidebar-foreground: var(--sidebar-foreground);
	--color-sidebar: var(--sidebar);
	--color-chart-5: var(--chart-5);
	--color-chart-4: var(--chart-4);
	--color-chart-3: var(--chart-3);
	--color-chart-2: var(--chart-2);
	--color-chart-1: var(--chart-1);
	--color-ring: var(--ring);
	--color-input: var(--input);
	--color-border: var(--border);
	--color-destructive: var(--destructive);
	--color-accent-foreground: var(--accent-foreground);
	--color-accent: var(--accent);
	--color-muted-foreground: var(--muted-foreground);
	--color-muted: var(--muted);
	--color-secondary-foreground: var(--secondary-foreground);
	--color-secondary: var(--secondary);
	--color-primary-foreground: var(--primary-foreground);
	--color-primary: var(--primary);
	--color-popover-foreground: var(--popover-foreground);
	--color-popover: var(--popover);
	--color-card-foreground: var(--card-foreground);
	--color-card: var(--card);
	--color-foreground: var(--foreground);
	--color-background: var(--background);
	--radius-sm: calc(var(--radius) * 0.6);
	--radius-md: calc(var(--radius) * 0.8);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) * 1.4);
	--radius-2xl: calc(var(--radius) * 1.8);
	--radius-3xl: calc(var(--radius) * 2.2);
	--radius-4xl: calc(var(--radius) * 2.6);
}

:root {
	--background: oklch(0.985 0.008 300);
	--foreground: oklch(0.2 0.04 285);
	--card: oklch(1 0 0);
	--card-foreground: oklch(0.2 0.04 285);
	--popover: oklch(1 0 0);
	--popover-foreground: oklch(0.2 0.04 285);
	--primary: oklch(0.62 0.22 8);
	--primary-foreground: oklch(0.99 0 0);
	--secondary: oklch(0.95 0.02 295);
	--secondary-foreground: oklch(0.25 0.05 285);
	--muted: oklch(0.95 0.015 295);
	--muted-foreground: oklch(0.5 0.03 285);
	--accent: oklch(0.94 0.04 5);
	--accent-foreground: oklch(0.3 0.08 5);
	--destructive: oklch(0.577 0.245 27.325);
	--border: oklch(0.9 0.015 295);
	--input: oklch(0.9 0.015 295);
	--ring: oklch(0.62 0.22 8);

	--chart-1: oklch(0.871 0.006 286.286);
	--chart-2: oklch(0.552 0.016 285.938);
	--chart-3: oklch(0.442 0.017 285.786);
	--chart-4: oklch(0.37 0.013 285.805);
	--chart-5: oklch(0.274 0.006 286.033);
	--radius: 0.625rem;
	--sidebar: oklch(0.985 0 0);
	--sidebar-foreground: oklch(0.141 0.005 285.823);
	--sidebar-primary: oklch(0.21 0.006 285.885);
	--sidebar-primary-foreground: oklch(0.985 0 0);
	--sidebar-accent: oklch(0.967 0.001 286.375);
	--sidebar-accent-foreground: oklch(0.21 0.006 285.885);
	--sidebar-border: oklch(0.92 0.004 286.32);
	--sidebar-ring: oklch(0.705 0.015 286.067);
}

.dark {
	--background: oklch(0.15 0.03 285);
	--foreground: oklch(0.97 0.005 300);
	--card: oklch(0.2 0.04 285);
	--card-foreground: oklch(0.97 0.005 300);
	--popover: oklch(0.2 0.04 285);
	--popover-foreground: oklch(0.97 0.005 300);
	--primary: oklch(0.72 0.19 5);
	--primary-foreground: oklch(0.15 0.03 285);
	--secondary: oklch(0.27 0.05 285);
	--secondary-foreground: oklch(0.97 0.005 300);
	--muted: oklch(0.25 0.045 285);
	--muted-foreground: oklch(0.72 0.03 290);
	--accent: oklch(0.3 0.08 350);
	--accent-foreground: oklch(0.97 0.005 300);
	--destructive: oklch(0.704 0.191 22.216);
	--border: oklch(1 0 0 / 10%);
	--input: oklch(1 0 0 / 15%);
	--ring: oklch(0.72 0.19 5);

	--chart-1: oklch(0.871 0.006 286.286);
	--chart-2: oklch(0.552 0.016 285.938);
	--chart-3: oklch(0.442 0.017 285.786);
	--chart-4: oklch(0.37 0.013 285.805);
	--chart-5: oklch(0.274 0.006 286.033);
	--sidebar: oklch(0.21 0.006 285.885);
	--sidebar-foreground: oklch(0.985 0 0);
	--sidebar-primary: oklch(0.488 0.243 264.376);
	--sidebar-primary-foreground: oklch(0.985 0 0);
	--sidebar-accent: oklch(0.274 0.006 286.033);
	--sidebar-accent-foreground: oklch(0.985 0 0);
	--sidebar-border: oklch(1 0 0 / 10%);
	--sidebar-ring: oklch(0.552 0.016 285.938);
}

@layer base {
	* {
		@apply border-border outline-ring/50;
	}
	body {
		@apply bg-background text-foreground;
	}
	button:not(:disabled),
	[role="button"]:not(:disabled) {
		cursor: pointer;
	}
	html {
		@apply font-sans;
	}
}
```

```text
~\server\src\app\app.js
```

```js
import express from "express";
import cookieParser from "cookie-parser";
import { cors, env } from "./config/index.js";
import routes from "./routes/api.js";
import { errorHandler } from "./lib/index.js";

const app = express();

app.use(cors);

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1", routes);

app.use(errorHandler);

export default app;
```

```text
~\server\src\app\routes\api.js
```

```js
import { Router } from "express";
import { database } from "../bootstrap/index.js";
import { success } from "../lib/index.js";
import { mediaRoutes } from "../../modules/index.js";

const router = Router();

/**
 * Health check
 */
router.get("/health", (req, res) => {
	const databaseConnected = database.isDatabaseConnected();

	return success(
		res,
		{
			status: databaseConnected ? "healthy" : "degraded",
			api: "up",
			database: databaseConnected ? "connected" : "disconnected",
		},
		databaseConnected
			? "API is healthy."
			: "API is running but database is unavailable.",
	);
});

router.use("/anime", mediaRoutes);

export default router;
```

```text
~\server\src\modules\media\routes\media.routes.js
```

```js
import { Router } from "express";
import { mediaController } from "../controllers/index.js";
import {
	recentQuerySchema,
	searchQuerySchema,
	seriesParamsSchema,
} from "../validators/index.js";
import { validate } from "../../../app/index.js";

const router = Router();

router.get(
	"/recent",
	validate(recentQuerySchema, "query"),
	mediaController.list,
);

/**
 * One architectural distinction worth preserving: this
 * search endpoint should only query MongoDB. It should
 * not call Anikoto. The catalogue indexing process is
 * now responsible for populating the local search source.
 */
router.get(
	"/search",
	validate(searchQuerySchema, "query"),
	mediaController.search,
);

router.get(
	"/series/:id",
	validate(seriesParamsSchema, "params"),
	mediaController.series,
);

export default router;
```

and here is the example of what this routes return:

```rest
GET {{baseUrl}}/anime/recent?page=3&perPage=2
```

Response:

```json
{
	"success": true,
	"message": "Recent anime fetched.",
	"data": [
		{
			"id": 6414,
			"title": "BEYBLADE X",
			"alternative": "BEYBLADE X",
			"titles": "ベイブレードエックス; ベイブレイド X, Beyblade X, ベイブレードエックス",
			"native": "BEYBLADE X",
			"slug": "beyblade-x-aj6fn",
			"rating": "PG",
			"poster": "https://cdn.anipixcdn.co/thumbnail/be19b5f3f1fab3af9028503f50c864db.png",
			"is_dub": 134,
			"is_sub": 141,
			"description": "At the heart of X City stands the impressive X Tower, an interconnected twin-skyscraper structure that symbolizes the pinnacle of every Beyblade player's dream. The building serves as the official headquarters for professional Beybattles, where competitors strive to ascend all one hundred floors; at its summit, the reigning champions, Team Pendragon, await contenders worthy of challenging their title. Bird Kazami, an amateur Blader, arrives in the city eager to turn professional. However, he and his teammates are crushed in their first qualifying match, prompting his companions to give up and disband their team. Fortunately, Bird is soon approached by the easygoing Ekusu Kurosu. In disguise as \"Kamen X\" to hide his identity as a former member of the undefeated Team Pendragon, Ekusu wants to climb the tower all over again. To complete their new group, they recruit skilled Beyblade expert and savvy social media influencer Multi Nanairo. Driven by their individual goals, the trio wins their preliminary rounds, launching their careers as Team Persona. Bird and his new friends must navigate the world of corporate sponsorships, earn the fickle public's support, and defeat many formidable opponents—all in their quest to reach X Tower's peak.",
			"aired": "Oct 06, 2023",
			"season": "Fall",
			"year": 2023,
			"duration": "24 min",
			"status": "Finished Airing",
			"score": "6.88",
			"mal_id": "56566",
			"episodes": "",
			"ani_id": "165159",
			"source": "manga",
			"s_id": 18632,
			"background_image": "",
			"updated_at": "2026-11-23 14:01:38",
			"next_air_schedule_time": 1795773600,
			"next_air_ep": 142,
			"terms_by_type": {
				"genre": ["Action", "Adventure", "Kids", "Sports"],
				"producers": ["ADK Emotions", "TV Tokyo"],
				"studios": ["OLM"],
				"type": ["TV"]
			}
		},
		{
			"id": 9073,
			"title": "So What's Wrong with Getting Reborn as a Goblin?",
			"alternative": "Tensei Goblin dakedo Shitsumon Aru?",
			"titles": "転ゴブ, เกิดใหม่เป็นก็อบลินแล้วไง มีคำถามอะไรไหม?, Tengobu",
			"native": "転生ゴブリンだけど質問ある？",
			"slug": "so-what-s-wrong-with-getting-reborn-as-a-goblin-b414a",
			"rating": "",
			"poster": "https://cdn.anipixcdn.co/thumbnail/4213e1e10e0dac150c03d344ac3bd930.jpg",
			"is_sub": 8,
			"description": "Office worker Akira Yagami's altruistic nature usually gets him the short end of the stick. When he dies after saving a kid from oncoming traffic...he reincarnates in another world as a goblin?! Normally, goblins only live for seven days, but Akira's newfound powers let him defy the species' normal life span... and are the key to his path to becoming the strongest goblin ever! (Source: Yen Press)",
			"aired": "Oct 5, 2026 to ?",
			"season": "fall",
			"year": 2026,
			"duration": "",
			"status": "Currently Airing",
			"score": "6.84",
			"mal_id": "63712",
			"episodes": "12",
			"ani_id": "209219",
			"source": "manga",
			"s_id": 312030,
			"background_image": "",
			"updated_at": "2026-11-23 13:10:33",
			"next_air_schedule_time": 1796043600,
			"next_air_ep": 9,
			"terms_by_type": {
				"genre": ["Fantasy"],
				"producers": ["Hakuhodo DY Music & Pictures", "INCS toenter"],
				"studios": ["Bakkka"],
				"type": ["TV"]
			}
		}
	],
	"meta": { "page": 3, "per_page": 2, "total": 9404, "total_pages": 4702 }
}
```

```rest
GET {{baseUrl}}/anime/search?q=Horimiya
```

Response:

```json
{
	"success": true,
	"message": "Anime search results fetched.",
	"data": [
		{
			"_id": 8013,
			"alternative": "Hori-san to Miyamura-kun",
			"native": "堀さんと宮村くん",
			"poster": "https://cdn.anipixcdn.co/thumbnail/ddd9dda6bfaf0bb1525a8a27c3ee6131.jpg",
			"slug": "hori-san-to-miyamura-kun-py65z",
			"title": "Hori-san to Miyamura-kun",
			"titles": "Horimiya, Hori-san to Miyamura-kun, 堀さんと宮村くん",
			"year": 2012
		},
		{
			"_id": 5821,
			"alternative": "Horimiya",
			"native": "ホリミヤ",
			"poster": "https://cdn.anipixcdn.co/thumbnail/16f88bcb1b253282c0414e4539984174.jpg",
			"slug": "horimiya-qv8ul",
			"title": "Horimiya",
			"titles": "Hori-san and Miyamura-kun",
			"year": 2021
		},
		{
			"_id": 6534,
			"alternative": "Horimiya: Piece",
			"native": "ホリミヤ -piece-",
			"poster": "https://cdn.anipixcdn.co/thumbnail/dda594513217fac90bbe56e5248d576c.png",
			"slug": "horimiya-the-missing-pieces-joi77",
			"title": "Horimiya: The Missing Pieces",
			"titles": "",
			"year": 2023
		}
	]
}
```

```rest
GET {{baseUrl}}/anime/series/60
```

Response:

```json
{
	"success": true,
	"message": "Series fetched.",
	"data": {
		"anime": {
			"_id": 60,
			"__v": 0,
			"aired": "Sep 17, 2016",
			"alternative": "Koe no Katachi",
			"createdAt": "2026-11-12T08:25:43.430Z",
			"description": "As a wild youth, elementary school student Shouya Ishida sought to beat boredom in the cruelest ways. When the deaf Shouko Nishimiya transfers into his class, Shouya and the rest of his class thoughtlessly bully her for fun. However, when her mother notifies the school, he is singled out and blamed for everything done to her. With Shouko transferring out of the school, Shouya is left at the mercy of his classmates. He is heartlessly ostracized all throughout elementary and middle school, while teachers turn a blind eye.\r\n\r\nNow in his third year of high school, Shouya is still plagued by his wrongdoings as a young boy. Sincerely regretting his past actions, he sets out on a journey of redemption: to meet Shouko once more and make amends.\r\n\r\nKoe no Katachi tells the heartwarming tale of Shouya's reunion with Shouko and his honest attempts to redeem himself, all while being continually haunted by the shadows of his past.\r\n \r\n[Written by MAL Rewrite]",
			"episodesCount": "",
			"fetchedAt": "2026-11-23T17:45:12.581Z",
			"isDub": 1,
			"isSub": 1,
			"malId": "28851",
			"native": "聲の形",
			"poster": "https://cdn.anipixcdn.co/thumbnail/6512bd43d9caa6e02c990b0a82652dca.jpg",
			"rating": "PG-13",
			"score": "8.96",
			"season": "fall",
			"slug": "a-silent-voice-fghla",
			"sourceUpdatedAt": "2024-10-17T15:17:17.000Z",
			"status": "Finished Airing",
			"termsByType": { "type": ["Movie"] },
			"title": "A Silent Voice",
			"titles": "The Shape of Voice",
			"updatedAt": "2026-11-23T17:45:12.603Z",
			"year": 2016,
			"seriesFetchedAt": "2026-11-23T17:45:12.581Z"
		},
		"episodes": [
			{
				"_id": 914,
				"animeId": 60,
				"number": 1,
				"title": "Full",
				"jpTitle": "Full",
				"embedId": "50465",
				"embedUrls": {
					"sub": "https://megaplay.buzz/stream/s-2/50465/sub",
					"dub": "https://megaplay.buzz/stream/s-2/50465/dub"
				},
				"sourceUpdatedAt": "2024-10-17T15:17:17.000Z",
				"fetchedAt": "2026-11-23T17:45:12.581Z",
				"__v": 0,
				"createdAt": "2026-11-23T17:45:12.594Z",
				"updatedAt": "2026-11-23T17:45:12.594Z"
			}
		],
		"cached": false
	}
}
```

I have shared this much so that you get the vivid description of what the current version of the site entails.

The task is to populate the <Landing /> page with the necessary information that makes an Anime landing page. I don't want for it to look similar to that of other sites out there. If possible it should be unique, for one i named the site Shepherd thus we could stem it's layout, rendered information, e.t.c from this idea. Actually the actual reason to why i named it as so is still vague to me, the thought just came to mind. A deeper reasoning to why i named it as so could come later, for now the actual definition of the term Shepherd could be used as a reference point.
