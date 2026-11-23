import { Badge } from "@/components/ui/badge";

const BadgeWithLeftIcon = ({ children, variant, className, icon }) => {
	const Icon = icon;

	return (
		<div>
			<Badge variant={variant} className={className}>
				{<Icon data-icon="inline-start" className="text-primary" />}
				{children}
			</Badge>
		</div>
	);
};

export default BadgeWithLeftIcon;
