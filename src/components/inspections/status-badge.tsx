import { STATUS_THEME } from "@/components/inspections/status-theme";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/domain/inspection.constants";
import type { InspectionStatus } from "@/types/inspection.types";
import { cn } from "@/lib/utils";

export function StatusBadge({
	status,
	className,
	hideDot = false,
	compact = false,
}: {
	status: InspectionStatus;
	className?: string;
	hideDot?: boolean;
	compact?: boolean;
}) {
	const theme = STATUS_THEME[status];

	return (
		<Badge
			className={cn(
				"max-w-full gap-1.5 border font-semibold tracking-tight",
				compact
					? "h-6 min-w-0 px-2 text-[10px] leading-none"
					: "px-2.5 py-1 text-xs",
				theme.badge,
				className,
			)}
			variant="secondary"
		>
			{hideDot ? null : (
				<span className={cn("size-2 shrink-0 rounded-full", theme.dot)} />
			)}
			<span className="truncate">{STATUS_LABELS[status]}</span>
		</Badge>
	);
}
