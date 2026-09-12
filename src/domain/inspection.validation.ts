import type {
	ChecklistItem,
	Inspection,
	InspectionDraftUpdate,
	InspectionStatus,
	UserRole,
} from "./inspection.types";

const MIN_REJECTION_REASON_LENGTH = 10;

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

export function validateRequiredMetadata(
	inspection: Inspection,
): string | null {
	if (!inspection.equipamento.trim()) {
		return "Informe o equipamento.";
	}

	if (!inspection.setor.trim()) {
		return "Informe o setor.";
	}

	if (!inspection.responsavel.trim()) {
		return "Informe o responsável.";
	}

	if (!inspection.data.trim()) {
		return "Informe a data.";
	}

	return null;
}

export function validateCreateInspectionInput(input: {
	equipamento: string;
	setor: string;
	responsavel: string;
	data: string;
}): string | null {
	return validateRequiredMetadata({
		id: "",
		protocolo: "",
		equipamento: input.equipamento,
		setor: input.setor,
		responsavel: input.responsavel,
		data: input.data,
		status: "em_preenchimento",
		checklist: [],
		historico: [],
		createdAt: "",
		updatedAt: "",
	});
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
