import type { ChecklistItem, Inspection, UserRole } from "@/types/inspection.types";
import type { InspectionActionVisibility } from "@/types/permissions";
import { canEditInspection } from "./inspection.validation";

export type InspectionCardAction = "open" | "review";
export type InspectionCardVariant = "list" | "kanban";

export function getInspectionActionVisibility(
	inspection: Inspection,
	role: UserRole,
): InspectionActionVisibility {
	const editable = canEditInspection(inspection.status);

	const showInspectorActions =
		editable && role === "inspetor" && inspection.status === "em_preenchimento";
	const showResubmitAction =
		inspection.status === "reprovada" && role === "inspetor";
	const showReviewerActions =
		inspection.status === "em_aprovacao" && role === "revisor";

	return {
		showInspectorActions,
		showResubmitAction,
		showReviewerActions,
		hasFooterActions:
			showInspectorActions || showResubmitAction || showReviewerActions,
	};
}

export function countAnsweredChecklistItems(
	source: Inspection | ChecklistItem[],
): number {
	const checklist = Array.isArray(source) ? source : source.checklist;
	return checklist.filter((item) => item.resposta).length;
}

export function getInspectionCardAction(
	inspection: Inspection,
	role: UserRole,
): InspectionCardAction {
	if (role === "revisor" && inspection.status === "em_aprovacao") {
		return "review";
	}

	return "open";
}

export function getInspectionCardActionLabel(
	action: InspectionCardAction,
	variant: InspectionCardVariant,
): string {
	if (action === "review") {
		return "Revisar";
	}

	return variant === "list" ? "Ver detalhes" : "Abrir";
}
