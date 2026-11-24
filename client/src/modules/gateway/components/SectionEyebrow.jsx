export function SectionEyebrow({ eyebrow, title, note, action }) {
	return (
		<div className="mb-4 flex items-end justify-between gap-4">
			<div>
				<p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
					{eyebrow}
				</p>
				<h2 className="text-xl font-bold tracking-tight md:text-2xl">
					{title}
				</h2>
				{note && (
					<p className="text-sm text-muted-foreground">{note}</p>
				)}
			</div>
			{action}
		</div>
	);
}
