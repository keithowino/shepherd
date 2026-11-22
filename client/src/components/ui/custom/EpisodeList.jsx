import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const RANGE_SIZE = 100;

export function EpisodeList({ episodes, activeId, onSelect }) {
	const [range, setRange] = useState(0);

	const ranges = Math.ceil(episodes.length / RANGE_SIZE);

	const visible = useMemo(
		() => episodes.slice(range * RANGE_SIZE, (range + 1) * RANGE_SIZE),
		[episodes, range],
	);

	return (
		<div className="flex flex-col rounded-xl border border-border bg-card">
			<div className="flex items-center justify-between border-b border-border px-4 py-3">
				<h2 className="text-sm font-semibold">Episodes</h2>
				<span className="text-xs text-muted-foreground">{episodes.length}</span>
			</div>

			{/* Only appears for long series (100+ eps) */}
			{ranges > 1 && (
				<div className="flex gap-1.5 overflow-x-auto border-b border-border px-3 py-2">
					{Array.from({ length: ranges }).map((_, i) => {
						const from = episodes[i * RANGE_SIZE]?.number;
						const to = episodes[Math.min((i + 1) * RANGE_SIZE, episodes.length) - 1]?.number;
						return (
							<button
								key={i}
								onClick={() => setRange(i)}
								className={cn(
									"shrink-0 rounded-full px-3 py-1 text-xs transition-colors",
									i === range
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground hover:bg-muted/70",
								)}
							>
								{from}-{to}
							</button>
						);
					})}
				</div>
			)}

			{/* Fixed max height + internal scroll: 1000 episodes never stretch the page */}
			<div className="max-h-72 overflow-y-auto overscroll-contain p-3 lg:max-h-[28rem]">
				<div className="grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1.5">
					{visible.map((ep) => {
						const isActive = ep._id === activeId;
						return (
							<button
								key={ep._id}
								onClick={() => onSelect(ep)}
								title={ep.title || `Episode ${ep.number}`}
								aria-current={isActive ? "true" : undefined}
								className={cn(
									"h-9 rounded-md border text-sm font-medium transition-colors",
									isActive
										? "border-primary bg-primary text-primary-foreground"
										: "border-border bg-muted/50 hover:border-primary/60 hover:bg-muted",
								)}
							>
								{ep.number}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
