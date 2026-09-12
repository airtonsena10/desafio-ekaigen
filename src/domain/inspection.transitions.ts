import type {
	Inspection,
	InspectionAction,
	UserRole,
} from "./inspection.types";
import {
	validateApprove,
	validateDraftUpdate,
	validateReject,
	validateRequiredMetadata,
	validateResubmit,
	validateSubmitForReview,
} from "./inspection.validation";
import { err, ok, type Result } from "./result";

function createHistoryEntry(
	_inspection: Inspection,
	acao: string,
	papel: UserRole,
	detalhes?: string,
) {
	return {
		id: crypto.randomUUID(),
		timestamp: new Date().toISOString(),
		acao,
		papel,
		detalhes,
	};
}

function withUpdatedInspection(
	inspection: Inspection,
	changes: Partial<Inspection>,
	historyEntry: ReturnType<typeof createHistoryEntry>,
): Inspection {
	return {
		...inspection,
		...changes,
		historico: [...inspection.historico, historyEntry],
		updatedAt: new Date().toISOString(),
	};
}

export function applyInspectionAction(
	inspection: Inspection,
	action: InspectionAction,
): Result<Inspection> {
	switch (action.type) {
		case "save_draft": {
			const validationError = validateDraftUpdate(inspection, action.updates);
			if (validationError) {
				return err(validationError);
			}

			const updatedInspection: Inspection = {
				...inspection,
				equipamento: action.updates.equipamento ?? inspection.equipamento,
				setor: action.updates.setor ?? inspection.setor,
				responsavel: action.updates.responsavel ?? inspection.responsavel,
				data: action.updates.data ?? inspection.data,
				checklist: action.updates.checklist ?? inspection.checklist,
			};

			return ok(
				withUpdatedInspection(
					updatedInspection,
					{},
					createHistoryEntry(inspection, "Rascunho salvo", action.role),
				),
			);
		}
		case "submit_for_review": {
			if (action.role !== "inspetor") {
				return err("Somente o inspetor pode encaminhar inspeções.");
			}

			const metadataError = validateRequiredMetadata(inspection);
			if (metadataError) {
				return err(metadataError);
			}

			const validationError = validateSubmitForReview(inspection);
			if (validationError) {
				return err(validationError);
			}

			return ok(
				withUpdatedInspection(
					inspection,
					{
						status: "em_aprovacao",
						motivoReprovacao: undefined,
					},
					createHistoryEntry(
						inspection,
						"Encaminhada para revisão",
						action.role,
					),
				),
			);
		}
		case "approve": {
			const validationError = validateApprove(inspection, action.role);
			if (validationError) {
				return err(validationError);
			}

			return ok(
				withUpdatedInspection(
					inspection,
					{ status: "aprovada", motivoReprovacao: undefined },
					createHistoryEntry(inspection, "Inspeção aprovada", action.role),
				),
			);
		}
		case "reject": {
			const validationError = validateReject(
				inspection,
				action.role,
				action.motivo,
			);
			if (validationError) {
				return err(validationError);
			}

			return ok(
				withUpdatedInspection(
					inspection,
					{
						status: "reprovada",
						motivoReprovacao: action.motivo.trim(),
					},
					createHistoryEntry(
						inspection,
						"Inspeção reprovada",
						action.role,
						action.motivo.trim(),
					),
				),
			);
		}
		case "resubmit": {
			const validationError = validateResubmit(inspection, action.role);
			if (validationError) {
				return err(validationError);
			}

			return ok(
				withUpdatedInspection(
					inspection,
					{
						status: "em_aprovacao",
						motivoReprovacao: undefined,
					},
					createHistoryEntry(
						inspection,
						"Correção reenviada para revisão",
						action.role,
					),
				),
			);
		}
		default: {
			const exhaustiveCheck: never = action;
			return err(`Ação não suportada: ${String(exhaustiveCheck)}`);
		}
	}
}

export function generateProtocol(existingCount: number): string {
	const year = new Date().getFullYear();
	const sequence = String(existingCount + 1).padStart(4, "0");
	return `INS-${year}-${sequence}`;
}
