import {
	INSPECTION_STATUSES,
	isInspectionStatus,
} from "@/domain/inspection.constants";
import type { Inspection, InspectionStatus } from "@/types/inspection.types";

export function parseInspectionStatus(value: string): InspectionStatus | null {
	return isInspectionStatus(value) ? value : null;
}

export function parseInspectionFilterStatus(
	value: string | null,
): InspectionStatus | "all" {
	if (!value || value === "all") {
		return "all";
	}

	return parseInspectionStatus(value) ?? "all";
}

export function countByStatus(
	inspections: Inspection[],
): Record<InspectionStatus, number> {
	return inspections.reduce(
		(counts, inspection) => {
			counts[inspection.status] += 1;
			return counts;
		},
		{
			em_preenchimento: 0,
			em_aprovacao: 0,
			aprovada: 0,
			reprovada: 0,
		},
	);
}

export function groupInspectionsByStatus(
	inspections: Inspection[],
): Record<InspectionStatus, Inspection[]> {
	const groups: Record<InspectionStatus, Inspection[]> = {
		em_preenchimento: [],
		em_aprovacao: [],
		aprovada: [],
		reprovada: [],
	};

	for (const status of INSPECTION_STATUSES) {
		groups[status] = inspections.filter(
			(inspection) => inspection.status === status,
		);
	}

	return groups;
}

export function filterInspections(
	inspections: Inspection[],
	query: string,
	status: InspectionStatus | "all",
): Inspection[] {
	const normalizedQuery = query.trim().toLowerCase();

	return inspections.filter((inspection) => {
		const matchesStatus = status === "all" || inspection.status === status;
		if (!matchesStatus) {
			return false;
		}

		if (!normalizedQuery) {
			return true;
		}

		const searchable = [
			inspection.protocolo,
			inspection.equipamento,
			inspection.setor,
			inspection.responsavel,
		]
			.join(" ")
			.toLowerCase();

		return searchable.includes(normalizedQuery);
	});
}
