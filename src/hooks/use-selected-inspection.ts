"use client";

import { useMemo } from "react";
import type { Inspection } from "@/domain/inspection.types";

interface UseSelectedInspectionOptions {
	selectedId: string | null;
	inspections: Inspection[];
	pendingInspection: Inspection | null;
}

export function useSelectedInspection({
	selectedId,
	inspections,
	pendingInspection,
}: UseSelectedInspectionOptions): Inspection | null {
	return useMemo(() => {
		if (!selectedId) {
			return null;
		}

		if (pendingInspection?.id === selectedId) {
			return pendingInspection;
		}

		return (
			inspections.find((inspection) => inspection.id === selectedId) ?? null
		);
	}, [inspections, pendingInspection, selectedId]);
}
