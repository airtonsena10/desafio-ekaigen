import { AlertTriangle } from "lucide-react";

interface InspectionRejectionAlertProps {
	motivo: string;
}

export function InspectionRejectionAlert({
	motivo,
}: InspectionRejectionAlertProps) {
	return (
		<div className="flex gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-950">
			<AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600" />
			<div>
				<p className="font-medium">Motivo da reprovação</p>
				<p className="mt-0.5 text-rose-800">{motivo}</p>
			</div>
		</div>
	);
}
