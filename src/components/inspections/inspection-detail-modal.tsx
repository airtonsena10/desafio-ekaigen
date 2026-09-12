"use client";

import { InspectionDetail } from "@/components/inspections/inspection-detail";
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
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>Detalhes da inspeção</DialogTitle>
				</DialogHeader>
				{inspection ? (
					<InspectionDetail
						inspection={inspection}
						onClose={() => onOpenChange(false)}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
}
