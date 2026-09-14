import type {
	Inspection,
	InspectionAction,
	InspectionStatus,
	UserRole,
} from "@/types/inspection.types";
import {
	validateApprove,
	validateResubmit,
	validateSubmitForReview,
} from "./inspection.validation";

export type KanbanDragResolution =
	| { type: "noop" }
	| { type: "execute"; action: InspectionAction }
	| { type: "open_review" }
	| { type: "invalid"; error: string };

export function resolveKanbanStatusMove(
	inspection: Inspection,
	targetStatus: InspectionStatus,
	role: UserRole,
): KanbanDragResolution {
	if (inspection.status === targetStatus) {
		return { type: "noop" };
	}

	if (
		inspection.status === "em_preenchimento" &&
		targetStatus === "em_aprovacao"
	) {
		if (role !== "inspetor") {
			return {
				type: "invalid",
				error: "Somente o inspetor pode encaminhar inspeções.",
			};
		}

		const validationError = validateSubmitForReview(inspection);
		if (validationError) {
			return { type: "invalid", error: validationError };
		}

		return { type: "execute", action: { type: "submit_for_review", role } };
	}

	if (inspection.status === "em_aprovacao" && targetStatus === "aprovada") {
		const validationError = validateApprove(inspection, role);
		if (validationError) {
			return { type: "invalid", error: validationError };
		}

		return { type: "execute", action: { type: "approve", role } };
	}

	if (inspection.status === "em_aprovacao" && targetStatus === "reprovada") {
		if (role !== "revisor") {
			return {
				type: "invalid",
				error: "Somente o revisor pode reprovar inspeções.",
			};
		}

		return { type: "open_review" };
	}

	if (inspection.status === "reprovada" && targetStatus === "em_aprovacao") {
		const validationError = validateResubmit(inspection, role);
		if (validationError) {
			return { type: "invalid", error: validationError };
		}

		return { type: "execute", action: { type: "resubmit", role } };
	}

	return {
		type: "invalid",
		error: "Transição não permitida entre essas etapas.",
	};
}

export function canDropInspectionOnStatus(
	inspection: Inspection,
	targetStatus: InspectionStatus,
	role: UserRole,
): boolean {
	const resolution = resolveKanbanStatusMove(inspection, targetStatus, role);
	return resolution.type === "execute" || resolution.type === "open_review";
}
