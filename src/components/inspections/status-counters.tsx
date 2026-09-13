"use client";

import { STATUS_THEME } from "@/components/inspections/status-theme";
import { countByStatus } from "@/domain/inspection.queries";
import type { Inspection, InspectionStatus } from "@/domain/inspection.types";
import { INSPECTION_STATUSES, STATUS_LABELS } from "@/domain/inspection.types";
import { useInspectionFilters } from "@/hooks/use-inspection-filters";
import { cn } from "@/lib/utils";

export function StatusCounters({ inspections }: { inspections: Inspection[] }) {
	const counts = countByStatus(inspections);
	const { status: activeStatus, toggleStatus } = useInspectionFilters();

	return (
		<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
			{INSPECTION_STATUSES.map((status: InspectionStatus) => {
				const theme = STATUS_THEME[status];
				const isActive = activeStatus === status;

				return (
					<button
						key={status}
						type="button"
						aria-pressed={isActive}
						aria-label={`Filtrar por ${STATUS_LABELS[status]} (${counts[status]})`}
						onClick={() => toggleStatus(status)}
						className={cn(
							"rounded-xl border px-3 py-2 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							theme.column,
							isActive && "ring-2 ring-offset-2 ring-offset-background",
							isActive && theme.ring,
						)}
					>
						<div className="flex items-center gap-2">
							<span className={cn("size-2 rounded-full", theme.dot)} />
							<span className={cn("text-xs font-semibold", theme.label)}>
								{STATUS_LABELS[status]}
							</span>
						</div>
						<p
							className={cn(
								"mt-1 text-2xl font-semibold tabular-nums",
								theme.counter,
							)}
						>
							{counts[status]}
						</p>
						<p className="mt-1 text-[11px] text-muted-foreground">
							{isActive
								? "Filtro ativo • clique para limpar"
								: "Clique para filtrar"}
						</p>
					</button>
				);
			})}
		</div>
	);
}
