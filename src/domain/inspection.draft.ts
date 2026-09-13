import type { Inspection, InspectionDraftUpdate } from "./inspection.types";

export function getDraftPayload(inspection: Inspection): InspectionDraftUpdate {
	return {
		equipamento: inspection.equipamento,
		setor: inspection.setor,
		responsavel: inspection.responsavel,
		data: inspection.data,
		checklist: inspection.checklist,
	};
}

export function serializeDraftPayload(payload: InspectionDraftUpdate): string {
	return JSON.stringify(payload);
}
