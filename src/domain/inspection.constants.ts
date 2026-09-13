import type { ChecklistItem, InspectionStatus } from "@/types/inspection.types";

export function isInspectionStatus(value: unknown): value is InspectionStatus {
	return (
		value === "em_preenchimento" ||
		value === "em_aprovacao" ||
		value === "aprovada" ||
		value === "reprovada"
	);
}

export const INSPECTION_STATUSES: InspectionStatus[] = [
	"em_preenchimento",
	"em_aprovacao",
	"aprovada",
	"reprovada",
];

export const STATUS_LABELS: Record<InspectionStatus, string> = {
	em_preenchimento: "Em preenchimento",
	em_aprovacao: "Em aprovação",
	aprovada: "Aprovada",
	reprovada: "Reprovada",
};

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
	{
		id: "identificacao",
		pergunta: "Identificação legível?",
		resposta: null,
	},
	{
		id: "avarias",
		pergunta: "Equipamento sem avarias aparentes?",
		resposta: null,
	},
	{
		id: "protecoes",
		pergunta: "Proteções fixadas?",
		resposta: null,
	},
];

export function createEmptyChecklist(): ChecklistItem[] {
	return DEFAULT_CHECKLIST.map((item) => ({ ...item, resposta: null }));
}
