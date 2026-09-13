"use client";

import { InspectionDetail } from "@/components/inspections/inspection-detail";
import { StatusBadge } from "@/components/inspections/status-badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Inspection } from "@/domain/inspection.types";

interface InspectionDetailModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	inspection: Inspection | null;
}

export function InspectionDetailModal({
	open,
	onOpenChange,
	inspection,
}: InspectionDetailModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex h-[100dvh] max-h-[100dvh] w-full max-w-full flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-xl sm:border sm:p-0">
				<DialogHeader className="shrink-0 space-y-2 border-b px-4 py-4">
					<div className="flex items-start justify-between gap-3 pr-8">
						<div className="min-w-0 space-y-1">
							<p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
								{inspection?.protocolo}
							</p>
							<DialogTitle className="truncate text-left text-lg">
								{inspection?.equipamento ?? "Detalhes da inspeção"}
							</DialogTitle>
						</div>
						{inspection ? <StatusBadge status={inspection.status} /> : null}
					</div>
				</DialogHeader>
				<div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
					{inspection ? (
						<InspectionDetail
							inspection={inspection}
							onClose={() => onOpenChange(false)}
						/>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
}
