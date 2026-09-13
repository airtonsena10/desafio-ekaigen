import type { Inspection, UserRole } from "./inspection.types";
import { canEditInspection } from "./inspection.validation";

export interface InspectionActionVisibility {
	showInspectorActions: boolean;
	showResubmitAction: boolean;
	showReviewerActions: boolean;
	hasFooterActions: boolean;
}

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

export function countAnsweredChecklistItems(inspection: Inspection): number {
	return inspection.checklist.filter((item) => item.resposta).length;
}
