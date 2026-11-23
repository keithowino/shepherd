import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Dices, Moon } from "lucide-react";

import { MetaDataInsert } from "@/lib/index.js";
import { platform } from "@/platform/config/index.js";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import BadgeWithLeftIcon from "@/components/ui/custom/badge/BadgeWithLeftIcon";
import { FlockCard } from "@/components/ui/custom/FlockCard";

const FLOCK_SIZE = 24;

/* ------------------------------ helpers ------------------------------ */

function formatCountdown(unixSeconds, now) {
	const diff = unixSeconds * 1000 - now;
	if (diff <= 0) return "airing now";

	const mins = Math.floor(diff / 60000);
	const days = Math.floor(mins / 1440);
	const hours = Math.floor((mins % 1440) / 60);
	const minutes = mins % 60;

	if (days > 0) return `${days}d ${hours}h`;
	if (hours > 0) return `${hours}h ${minutes}m`;
	return `${minutes}m`;
}

function useNow(intervalMs = 60000) {
	const [now, setNow] = useState(() => Date.now());
	useEffect(() => {
		const t = setInterval(() => setNow(Date.now()), intervalMs);
		return () => clearInterval(t);
	}, [intervalMs]);
	return now;
}

function useFlock() {
	const [state, setState] = useState({
		items: [],
		total: null,
		loading: true,
		error: null,
	});

	useEffect(() => {
		let active = true;
		api.recent(1, FLOCK_SIZE)
			.then((res) => {
				if (!active) return;
				setState({
					items: res.items ?? [],
					total: res.pagination?.total ?? null,
					loading: false,
					error: null,
				});
			})
			.catch((e) => {
				if (active)
					setState({
						items: [],
						total: null,
						loading: false,
						error: e.message,
					});
			});
		return () => {
			active = false;
		};
	}, []);

	return state;
}

/* ---------------------------- decorative bits ---------------------------- */

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

function Hills() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 1440 160"
			preserveAspectRatio="none"
			className="absolute inset-x-0 bottom-0 h-24 w-full md:h-32"
		>
			<path
				d="M0 100 C 240 20, 420 150, 720 90 S 1200 10, 1440 80 L1440 160 L0 160 Z"
				className="fill-primary/10"
			/>
			<path
				d="M0 130 C 300 70, 520 170, 820 120 S 1220 70, 1440 120 L1440 160 L0 160 Z"
				className="fill-primary/20"
			/>
			<path
				d="M0 150 C 360 120, 640 170, 960 145 S 1300 130, 1440 150 L1440 160 L0 160 Z"
				className="fill-background"
			/>
		</svg>
	);
}

/* -------------------------------- hero -------------------------------- */

function Hero({ items, total, loading, onStray }) {
	const stack = items.slice(0, 3);

	return (
		<section className="relative isolate -mx-4 -mt-6 overflow-hidden px-4 pt-12 pb-28 md:-mt-8 md:pt-20 md:pb-36">
			<div
				aria-hidden
				className="absolute inset-0 -z-10 bg-linear-to-b from-accent/60 via-background to-background"
			/>
			<Stars />
			<div
				aria-hidden
				className="absolute top-8 right-[8%] -z-10 h-24 w-24 rounded-full bg-primary/25 blur-2xl md:h-40 md:w-40"
			/>

			<div className="container relative mx-auto grid items-center gap-12 md:grid-cols-[1.15fr_1fr]">
				<div className="space-y-6">
					<BadgeWithLeftIcon
						variant="secondary"
						className="text-xs text-muted-foreground gap-2 backdrop-blur"
						icon={Moon}
					>
						<span className="font-semibold text-foreground">
							shep·herd
						</span>
						<span className="italic">
							one who tends, guards &amp; guides
						</span>
					</BadgeWithLeftIcon>

					<h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
						Every story needs
						<br />
						<span className="text-primary">
							someone watching
						</span>{" "}
						over it.
					</h1>

					<p className="max-w-md text-base text-muted-foreground md:text-lg">
						We keep an eye on the whole flock: new episodes, fresh
						arrivals, the late-night strays. You just show up and
						follow.
					</p>

					<div className="flex flex-wrap items-center gap-3">
						<Button size="lg" className="rounded-full">
							<Link
								to="/updates"
								className="flex gap-1 items-center"
							>
								Walk the flock
								<ArrowRight className="ml-1 h-4 w-4" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="rounded-full"
							onClick={onStray}
							disabled={loading || items.length === 0}
						>
							<Dices className="mr-1 h-4 w-4" />
							Send me a stray
						</Button>
					</div>

					<p className="text-sm text-muted-foreground">
						{total ? (
							<>
								Counting the flock:{" "}
								<span className="font-semibold text-foreground tabular-nums">
									{total.toLocaleString()}
								</span>{" "}
								titles and growing.
							</>
						) : (
							"Counting the flock…"
						)}
					</p>
				</div>

				{/* Overlapping poster stack */}
				<div className="relative mx-auto h-80 w-full max-w-sm md:h-105">
					{loading
						? [0, 1, 2].map((i) => (
								<Skeleton
									key={i}
									className="absolute top-0 h-72 w-44 rounded-xl md:h-90 md:w-56"
									style={{
										left: `${i * 18}%`,
										transform: `rotate(${(i - 1) * 6}deg)`,
									}}
								/>
							))
						: stack.map((a, i) => (
								<div
									className="group absolute top-0 shadow-2xl transition-all duration-300 hover:-translate-y-2"
									style={{
										left: `${i * 20}%`,
										zIndex: i,
										transform: `rotate(${(i - 1) * 6}deg)`,
									}}
								>
									<FlockCard
										key={a.id}
										anime={a}
										imgLoader={i === 0 ? "eager" : "lazy"}
										render={{ overlayDescription: true }}
									/>
								</div>
							))}
				</div>
			</div>

			<Hills />
		</section>
	);
}

/* ---------------------------- the night watch ---------------------------- */

function NightWatch({ items, loading }) {
	const now = useNow();

	const upcoming = useMemo(
		() =>
			items
				.filter(
					(a) =>
						a.next_air_schedule_time &&
						a.next_air_schedule_time * 1000 > Date.now(),
				)
				.sort(
					(a, b) =>
						a.next_air_schedule_time - b.next_air_schedule_time,
				)
				.slice(0, 8),
		[items],
	);

	if (!loading && upcoming.length === 0) return null;

	return (
		<section className="space-y-4">
			<SectionHeading
				eyebrow="The Night Watch"
				title="Next to wake"
				note="Episodes landing soon, counted down for you."
			/>

			<div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
				{loading
					? Array.from({ length: 5 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-24 w-72 shrink-0 rounded-xl"
							/>
						))
					: upcoming.map((a) => (
							<Link
								key={a.id}
								to={`/anime/${a.id}`}
								className="group flex w-72 shrink-0 items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/60"
							>
								<img
									src={a.poster}
									alt=""
									loading="lazy"
									className="h-18 w-12 rounded-md object-cover ring-1 ring-border"
								/>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-semibold">
										{a.title}
									</p>
									<p className="text-xs text-muted-foreground">
										Episode {a.next_air_ep}
									</p>
								</div>
								<div className="text-right">
									<p className="text-[10px] tracking-widest text-muted-foreground uppercase">
										in
									</p>
									<p className="font-mono text-sm font-bold text-primary tabular-nums">
										{formatCountdown(
											a.next_air_schedule_time,
											now,
										)}
									</p>
								</div>
							</Link>
						))}
			</div>
		</section>
	);
}

/* -------------------------- the flock + pastures -------------------------- */

function Flock({ items, loading, error }) {
	const [pasture, setPasture] = useState("All");

	const pastures = useMemo(() => {
		const counts = new Map();
		items.forEach((a) =>
			a.terms_by_type?.genre?.forEach((g) =>
				counts.set(g, (counts.get(g) ?? 0) + 1),
			),
		);
		return [
			"All",
			...[...counts.entries()]
				.sort((a, b) => b[1] - a[1])
				.slice(0, 8)
				.map(([g]) => g),
		];
	}, [items]);

	const visible = useMemo(
		() =>
			pasture === "All"
				? items
				: items.filter((a) =>
						a.terms_by_type?.genre?.includes(pasture),
					),
		[items, pasture],
	);

	return (
		<section className="space-y-5">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<SectionHeading
					eyebrow="The Flock"
					title="Grazing right now"
					note="Freshly updated, straight from the pasture."
				/>
				<Link
					to="/updates"
					className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
				>
					See the whole flock <ArrowRight className="h-4 w-4" />
				</Link>
			</div>

			{/* Pastures */}
			{!loading && !error && (
				<div
					role="tablist"
					aria-label="Pastures"
					className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]"
				>
					{pastures.map((g) => (
						<button
							key={g}
							role="tab"
							aria-selected={pasture === g}
							onClick={() => setPasture(g)}
							className={
								"shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors " +
								(pasture === g
									? "border-primary bg-primary text-primary-foreground"
									: "border-border bg-card text-muted-foreground hover:text-foreground")
							}
						>
							{g}
						</button>
					))}
				</div>
			)}

			{error ? (
				<p className="text-destructive">{error}</p>
			) : (
				<div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
					{loading
						? Array.from({ length: 12 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="aspect-2/3 rounded-xl" />
									<Skeleton className="h-4 w-4/5" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							))
						: visible.map((a) => (
								<FlockCard
									key={a.id}
									anime={a}
									render={{
										type: true,
										score: true,
										episodeLabel: true,
										animeDescription: true,
										caption: true,
									}}
								/>
							))}
				</div>
			)}
		</section>
	);
}

/* ------------------------------- the stray ------------------------------- */

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

/* -------------------------------- shared -------------------------------- */

function SectionHeading({ eyebrow, title, note }) {
	return (
		<div>
			<p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
				{eyebrow}
			</p>
			<h2 className="text-xl font-bold tracking-tight md:text-2xl">
				{title}
			</h2>
			{note && <p className="text-sm text-muted-foreground">{note}</p>}
		</div>
	);
}

/* --------------------------------- page --------------------------------- */

const Landing = () => {
	const navigate = useNavigate();
	const { items, total, loading, error } = useFlock();

	const sendStray = () => {
		if (!items.length) return;
		const pick = items[Math.floor(Math.random() * items.length)];
		navigate(`/anime/${pick.id}`);
	};

	return (
		<>
			<MetaDataInsert title={platform.name} />

			<div className="space-y-14 md:space-y-20">
				<Hero
					items={items}
					total={total}
					loading={loading}
					onStray={sendStray}
				/>
				<NightWatch items={items} loading={loading} />
				<Flock items={items} loading={loading} error={error} />
				<StrayBanner
					onStray={sendStray}
					disabled={loading || !items.length}
				/>
			</div>
		</>
	);
};

export default Landing;
