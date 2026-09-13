import { STATUS_THEME } from "@/components/inspections/status-theme";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/domain/inspection.constants";
import type { InspectionStatus } from "@/types/inspection.types";
import { cn } from "@/lib/utils";

export function StatusBadge({
	status,
	className,
}: {
	status: InspectionStatus;
	className?: string;
}) {
	const theme = STATUS_THEME[status];

	return (
		<Badge
			className={cn(
				"gap-1.5 border px-2.5 py-1 text-xs font-semibold tracking-tight",
				theme.badge,
				className,
			)}
			variant="secondary"
		>
			<span className={cn("size-2 rounded-full", theme.dot)} />
			{STATUS_LABELS[status]}
		</Badge>
	);
}
