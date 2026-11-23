export default function FeatureGrid({ children, columns = 3, className }) {
	const columnLayouts = {
		1: "grid-cols-1",
		2: "grid-cols-1 sm:grid-cols-2",
		3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
		4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
		5: "max-[375px]:grid-cols-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6",
	};

	const gridCols = columnLayouts[columns] ?? columnLayouts[3];

	return (
		<div
			className={`grid max-[375px]:gap-x-2 gap-x-3 md:gap-x-5 gap-y-5 md:gap-y-6 ${gridCols} ${className}`}
		>
			{children}
		</div>
	);
}
