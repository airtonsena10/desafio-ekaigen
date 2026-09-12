import { Badge } from "@/components/ui/badge";
import type { Inspection, InspectionStatus } from "@/domain/inspection.types";
import { INSPECTION_STATUSES, STATUS_LABELS } from "@/domain/inspection.types";
import { countByStatus } from "@/domain/inspection.validation";

export function StatusCounters({ inspections }: { inspections: Inspection[] }) {
	const counts = countByStatus(inspections);

	return (
		<div className="flex flex-wrap gap-2">
			{INSPECTION_STATUSES.map((status: InspectionStatus) => (
				<Badge key={status} variant="outline" className="gap-1 px-3 py-1">
					<span>{STATUS_LABELS[status]}</span>
					<span className="font-semibold">{counts[status]}</span>
				</Badge>
			))}
		</div>
	);
}
