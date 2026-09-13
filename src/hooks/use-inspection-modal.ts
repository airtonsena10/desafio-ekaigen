"use client";

import { useCallback, useState } from "react";
import type { Inspection } from "@/domain/inspection.types";
import { useSelectedInspection } from "@/hooks/use-selected-inspection";
import { useInspections } from "@/providers/inspection-provider";

export function useInspectionModal() {
	const { selectedId, setSelectedId, inspections } = useInspections();
	const [pendingInspection, setPendingInspection] = useState<Inspection | null>(
		null,
	);

	const selectedInspection = useSelectedInspection({
		selectedId,
		inspections,
		pendingInspection,
	});

	const openInspection = useCallback(
		(inspection: Inspection) => {
			setPendingInspection(inspection);
			setSelectedId(inspection.id);
		},
		[setSelectedId],
	);

	const openInspectionById = useCallback(
		(id: string) => {
			setSelectedId(id);
		},
		[setSelectedId],
	);

	const closeModal = useCallback(() => {
		setSelectedId(null);
		setPendingInspection(null);
	}, [setSelectedId]);

	const handleModalOpenChange = useCallback(
		(open: boolean) => {
			if (!open) {
				closeModal();
			}
		},
		[closeModal],
	);

	return {
		selectedId,
		selectedInspection,
		modalOpen: selectedId !== null,
		openInspection,
		openInspectionById,
		closeModal,
		handleModalOpenChange,
	};
}
