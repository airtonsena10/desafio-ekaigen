import { Badge } from "@/components/ui/badge";
import type { InspectionStatus } from "@/domain/inspection.types";
import { STATUS_LABELS } from "@/domain/inspection.types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<InspectionStatus, string> = {
	em_preenchimento: "bg-amber-100 text-amber-900 hover:bg-amber-100",
	em_aprovacao: "bg-sky-100 text-sky-900 hover:bg-sky-100",
	aprovada: "bg-emerald-100 text-emerald-900 hover:bg-emerald-100",
	reprovada: "bg-rose-100 text-rose-900 hover:bg-rose-100",
};

export function StatusBadge({
	status,
	className,
}: {
	status: InspectionStatus;
	className?: string;
}) {
	return (
		<Badge className={cn(STATUS_STYLES[status], className)} variant="secondary">
			{STATUS_LABELS[status]}
		</Badge>
	);
}
