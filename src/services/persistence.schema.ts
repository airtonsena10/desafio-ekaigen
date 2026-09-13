import type {
	ChecklistItem,
	ChecklistItemId,
	HistoryEntry,
	Inspection,
	InspectionStatus,
	UserRole,
	YesNo,
} from "@/domain/inspection.types";
import type { PersistedState } from "./persistence";

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.length > 0;
}

function isString(value: unknown): value is string {
	return typeof value === "string";
}

function isYesNo(value: unknown): value is YesNo {
	return value === "sim" || value === "nao";
}

function isUserRole(value: unknown): value is UserRole {
	return value === "inspetor" || value === "revisor";
}

function isInspectionStatus(value: unknown): value is InspectionStatus {
	return (
		value === "em_preenchimento" ||
		value === "em_aprovacao" ||
		value === "aprovada" ||
		value === "reprovada"
	);
}

function isChecklistItemId(value: unknown): value is ChecklistItemId {
	return (
		value === "identificacao" || value === "avarias" || value === "protecoes"
	);
}

function isChecklistItem(value: unknown): value is ChecklistItem {
	if (!isRecord(value)) {
		return false;
	}

	if (!isChecklistItemId(value.id) || !isString(value.pergunta)) {
		return false;
	}

	if (value.resposta !== null && !isYesNo(value.resposta)) {
		return false;
	}

	if (value.observacao !== undefined && typeof value.observacao !== "string") {
		return false;
	}

	return true;
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
	if (!isRecord(value)) {
		return false;
	}

	return (
		isNonEmptyString(value.id) &&
		isString(value.timestamp) &&
		isString(value.acao) &&
		isUserRole(value.papel) &&
		(value.detalhes === undefined || isString(value.detalhes))
	);
}

function isInspection(value: unknown): value is Inspection {
	if (!isRecord(value)) {
		return false;
	}

	if (
		!isNonEmptyString(value.id) ||
		!isString(value.protocolo) ||
		!isString(value.equipamento) ||
		!isString(value.setor) ||
		!isString(value.responsavel) ||
		!isString(value.data) ||
		!isInspectionStatus(value.status) ||
		!isString(value.createdAt) ||
		!isString(value.updatedAt)
	) {
		return false;
	}

	if (
		!Array.isArray(value.checklist) ||
		!value.checklist.every(isChecklistItem)
	) {
		return false;
	}

	if (
		!Array.isArray(value.historico) ||
		!value.historico.every(isHistoryEntry)
	) {
		return false;
	}

	if (
		value.motivoReprovacao !== undefined &&
		typeof value.motivoReprovacao !== "string"
	) {
		return false;
	}

	return true;
}

export function parsePersistedState(value: unknown): PersistedState | null {
	if (!isRecord(value)) {
		return null;
	}

	if (
		!Array.isArray(value.inspections) ||
		typeof value.protocolCounter !== "number" ||
		!Number.isFinite(value.protocolCounter)
	) {
		return null;
	}

	if (!value.inspections.every(isInspection)) {
		return null;
	}

	return {
		inspections: value.inspections,
		protocolCounter: value.protocolCounter,
	};
}
