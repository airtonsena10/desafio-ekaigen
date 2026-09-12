export type InspectionStatus =
	| "em_preenchimento"
	| "em_aprovacao"
	| "aprovada"
	| "reprovada";

export type YesNo = "sim" | "nao";

export type UserRole = "inspetor" | "revisor";

export type ChecklistItemId = "identificacao" | "avarias" | "protecoes";

export interface ChecklistItem {
	id: ChecklistItemId;
	pergunta: string;
	resposta: YesNo | null;
	observacao?: string;
}

export interface HistoryEntry {
	id: string;
	timestamp: string;
	acao: string;
	papel: UserRole;
	detalhes?: string;
}

export interface Inspection {
	id: string;
	protocolo: string;
	equipamento: string;
	setor: string;
	responsavel: string;
	data: string;
	status: InspectionStatus;
	checklist: ChecklistItem[];
	historico: HistoryEntry[];
	motivoReprovacao?: string;
	createdAt: string;
	updatedAt: string;
}

export interface InspectionDraftUpdate {
	equipamento?: string;
	setor?: string;
	responsavel?: string;
	data?: string;
	checklist?: ChecklistItem[];
}

export type InspectionAction =
	| { type: "save_draft"; role: UserRole; updates: InspectionDraftUpdate }
	| { type: "submit_for_review"; role: UserRole }
	| { type: "approve"; role: UserRole }
	| { type: "reject"; role: UserRole; motivo: string }
	| { type: "resubmit"; role: UserRole };

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
