import type {
	ChecklistItem,
	Inspection,
	InspectionDraftUpdate,
	InspectionStatus,
	UserRole,
} from "@/types/inspection.types";

const MIN_REJECTION_REASON_LENGTH = 10;

export interface MetadataFields {
	equipamento: string;
	setor: string;
	responsavel: string;
	data: string;
}

export function canEditInspection(status: InspectionStatus): boolean {
	return status === "em_preenchimento" || status === "reprovada";
}

export function validateChecklistComplete(
	checklist: ChecklistItem[],
): string | null {
	for (const item of checklist) {
		if (item.resposta === null) {
			return `Responda a pergunta: ${item.pergunta}`;
		}

		if (item.resposta === "nao" && !item.observacao?.trim()) {
			return `Informe uma observação para: ${item.pergunta}`;
		}
	}

	return null;
}

export function validateDraftUpdate(
	inspection: Inspection,
	updates: InspectionDraftUpdate,
): string | null {
	if (!canEditInspection(inspection.status)) {
		return "Inspeção aprovada não pode ser alterada.";
	}

	if (updates.checklist) {
		for (const item of updates.checklist) {
			if (item.resposta === "nao" && !item.observacao?.trim()) {
				return `Informe uma observação para: ${item.pergunta}`;
			}
		}
	}

	return null;
}

export function validateSubmitForReview(inspection: Inspection): string | null {
	if (
		inspection.status !== "em_preenchimento" &&
		inspection.status !== "reprovada"
	) {
		return "Somente inspeções em preenchimento ou reprovadas podem ser encaminhadas.";
	}

	return validateChecklistComplete(inspection.checklist);
}

export function validateApprove(
	inspection: Inspection,
	role: UserRole,
): string | null {
	if (role !== "revisor") {
		return "Somente o revisor pode aprovar inspeções.";
	}

	if (inspection.status !== "em_aprovacao") {
		return "Somente inspeções em aprovação podem ser aprovadas.";
	}

	return null;
}

export function validateReject(
	inspection: Inspection,
	role: UserRole,
	motivo: string,
): string | null {
	if (role !== "revisor") {
		return "Somente o revisor pode reprovar inspeções.";
	}

	if (inspection.status !== "em_aprovacao") {
		return "Somente inspeções em aprovação podem ser reprovadas.";
	}

	const trimmedMotivo = motivo.trim();
	if (trimmedMotivo.length < MIN_REJECTION_REASON_LENGTH) {
		return `Informe um motivo com pelo menos ${MIN_REJECTION_REASON_LENGTH} caracteres.`;
	}

	return null;
}

export function validateResubmit(
	inspection: Inspection,
	role: UserRole,
): string | null {
	if (role !== "inspetor") {
		return "Somente o inspetor pode reenviar inspeções.";
	}

	if (inspection.status !== "reprovada") {
		return "Somente inspeções reprovadas podem ser reenviadas.";
	}

	return validateChecklistComplete(inspection.checklist);
}

function listMissingMetadataFields(input: MetadataFields): string[] {
	const missing: string[] = [];

	if (!input.equipamento.trim()) {
		missing.push("equipamento");
	}

	if (!input.setor.trim()) {
		missing.push("setor");
	}

	if (!input.responsavel.trim()) {
		missing.push("responsável");
	}

	if (!input.data.trim()) {
		missing.push("data");
	}

	return missing;
}

function formatMissingMetadataMessage(missing: string[]): string {
	if (missing.length === 1) {
		const field = missing[0];

		if (field === "equipamento") {
			return "Informe o equipamento.";
		}

		if (field === "setor") {
			return "Informe o setor.";
		}

		if (field === "responsável") {
			return "Informe o responsável.";
		}

		return "Informe a data.";
	}

	const last = missing.at(-1);
	const rest = missing.slice(0, -1);

	return `Preencha os campos: ${rest.join(", ")} e ${last}.`;
}

function getMetadataFieldsFromInspection(
	inspection: Inspection,
): MetadataFields {
	return {
		equipamento: inspection.equipamento,
		setor: inspection.setor,
		responsavel: inspection.responsavel,
		data: inspection.data,
	};
}

export function validateRequiredMetadata(
	inspection: Inspection,
): string | null {
	return validateMetadataFields(getMetadataFieldsFromInspection(inspection));
}

export function validateCreateInspectionInput(
	input: MetadataFields,
): string | null {
	return validateMetadataFields(input);
}

function validateMetadataFields(input: MetadataFields): string | null {
	const missing = listMissingMetadataFields(input);

	if (missing.length === 0) {
		return null;
	}

	return formatMissingMetadataMessage(missing);
}
