import { createEmptyChecklist } from "@/domain/inspection.constants";
import type { Inspection } from "@/types/inspection.types";

function createHistory(
	id: string,
	timestamp: string,
	acao: string,
	papel: "inspetor" | "revisor",
	detalhes?: string,
) {
	return { id, timestamp, acao, papel, detalhes };
}

const baseDate = "2026-09-10T10:00:00.000Z";

export const MOCK_INSPECTIONS: Inspection[] = [
	{
		id: "ins-001",
		protocolo: "INS-2026-0001",
		equipamento: "Compressor AR-01",
		setor: "Produção",
		responsavel: "Ana Souza",
		data: "2026-09-10",
		status: "em_preenchimento",
		checklist: createEmptyChecklist().map((item, index) =>
			index === 0 ? { ...item, resposta: "sim" as const } : item,
		),
		historico: [
			createHistory("h-001", baseDate, "Inspeção criada", "inspetor"),
			createHistory(
				"h-002",
				"2026-09-10T11:00:00.000Z",
				"Rascunho salvo",
				"inspetor",
			),
		],
		createdAt: baseDate,
		updatedAt: "2026-09-10T11:00:00.000Z",
	},
	{
		id: "ins-002",
		protocolo: "INS-2026-0002",
		equipamento: "Empilhadeira EP-12",
		setor: "Logística",
		responsavel: "Bruno Lima",
		data: "2026-09-09",
		status: "em_preenchimento",
		checklist: createEmptyChecklist(),
		historico: [
			createHistory("h-003", baseDate, "Inspeção criada", "inspetor"),
		],
		createdAt: baseDate,
		updatedAt: baseDate,
	},
	{
		id: "ins-003",
		protocolo: "INS-2026-0003",
		equipamento: "Caldeira CL-03",
		setor: "Utilidades",
		responsavel: "Carla Mendes",
		data: "2026-09-08",
		status: "em_aprovacao",
		checklist: createEmptyChecklist().map((item) => ({
			...item,
			resposta: "sim" as const,
		})),
		historico: [
			createHistory("h-004", baseDate, "Inspeção criada", "inspetor"),
			createHistory(
				"h-005",
				"2026-09-09T09:00:00.000Z",
				"Encaminhada para revisão",
				"inspetor",
			),
		],
		createdAt: baseDate,
		updatedAt: "2026-09-09T09:00:00.000Z",
	},
	{
		id: "ins-004",
		protocolo: "INS-2026-0004",
		equipamento: "Torno CNC-07",
		setor: "Manutenção",
		responsavel: "Diego Alves",
		data: "2026-09-07",
		status: "em_aprovacao",
		checklist: createEmptyChecklist().map((item, index) =>
			index === 1
				? {
						...item,
						resposta: "nao" as const,
						observacao: "Pequeno amassado lateral.",
					}
				: { ...item, resposta: "sim" as const },
		),
		historico: [
			createHistory("h-006", baseDate, "Inspeção criada", "inspetor"),
			createHistory(
				"h-007",
				"2026-09-08T14:00:00.000Z",
				"Encaminhada para revisão",
				"inspetor",
			),
		],
		createdAt: baseDate,
		updatedAt: "2026-09-08T14:00:00.000Z",
	},
	{
		id: "ins-005",
		protocolo: "INS-2026-0005",
		equipamento: "Gerador GE-02",
		setor: "Energia",
		responsavel: "Eduarda Pires",
		data: "2026-09-06",
		status: "aprovada",
		checklist: createEmptyChecklist().map((item) => ({
			...item,
			resposta: "sim" as const,
		})),
		historico: [
			createHistory("h-008", baseDate, "Inspeção criada", "inspetor"),
			createHistory(
				"h-009",
				"2026-09-07T08:00:00.000Z",
				"Encaminhada para revisão",
				"inspetor",
			),
			createHistory(
				"h-010",
				"2026-09-07T10:00:00.000Z",
				"Inspeção aprovada",
				"revisor",
			),
		],
		createdAt: baseDate,
		updatedAt: "2026-09-07T10:00:00.000Z",
	},
	{
		id: "ins-006",
		protocolo: "INS-2026-0006",
		equipamento: "Ponte Rolante PR-04",
		setor: "Produção",
		responsavel: "Felipe Nunes",
		data: "2026-09-05",
		status: "aprovada",
		checklist: createEmptyChecklist().map((item) => ({
			...item,
			resposta: "sim" as const,
		})),
		historico: [
			createHistory("h-011", baseDate, "Inspeção criada", "inspetor"),
			createHistory(
				"h-012",
				"2026-09-06T08:00:00.000Z",
				"Encaminhada para revisão",
				"inspetor",
			),
			createHistory(
				"h-013",
				"2026-09-06T11:00:00.000Z",
				"Inspeção aprovada",
				"revisor",
			),
		],
		createdAt: baseDate,
		updatedAt: "2026-09-06T11:00:00.000Z",
	},
	{
		id: "ins-007",
		protocolo: "INS-2026-0007",
		equipamento: "Extrusora EX-09",
		setor: "Produção",
		responsavel: "Gabriela Rocha",
		data: "2026-09-04",
		status: "reprovada",
		motivoReprovacao: "Proteção lateral solta identificada na revisão.",
		checklist: createEmptyChecklist().map((item, index) =>
			index === 2
				? { ...item, resposta: "nao" as const, observacao: "Parafuso frouxo." }
				: { ...item, resposta: "sim" as const },
		),
		historico: [
			createHistory("h-014", baseDate, "Inspeção criada", "inspetor"),
			createHistory(
				"h-015",
				"2026-09-05T08:00:00.000Z",
				"Encaminhada para revisão",
				"inspetor",
			),
			createHistory(
				"h-016",
				"2026-09-05T12:00:00.000Z",
				"Inspeção reprovada",
				"revisor",
				"Proteção lateral solta identificada na revisão.",
			),
		],
		createdAt: baseDate,
		updatedAt: "2026-09-05T12:00:00.000Z",
	},
	{
		id: "ins-008",
		protocolo: "INS-2026-0008",
		equipamento: "Inversor IV-11",
		setor: "Automacao",
		responsavel: "Henrique Dias",
		data: "2026-09-03",
		status: "reprovada",
		motivoReprovacao: "Identificação ilegível e sem etiqueta reserva.",
		checklist: createEmptyChecklist().map((item, index) =>
			index === 0
				? {
						...item,
						resposta: "nao" as const,
						observacao: "Etiqueta desbotada.",
					}
				: { ...item, resposta: "sim" as const },
		),
		historico: [
			createHistory("h-017", baseDate, "Inspeção criada", "inspetor"),
			createHistory(
				"h-018",
				"2026-09-04T08:00:00.000Z",
				"Encaminhada para revisão",
				"inspetor",
			),
			createHistory(
				"h-019",
				"2026-09-04T15:00:00.000Z",
				"Inspeção reprovada",
				"revisor",
				"Identificação ilegível e sem etiqueta reserva.",
			),
		],
		createdAt: baseDate,
		updatedAt: "2026-09-04T15:00:00.000Z",
	},
	{
		id: "ins-009",
		protocolo: "INS-2026-0009",
		equipamento: "Bomba BM-15",
		setor: "Utilidades",
		responsavel: "Isabela Costa",
		data: "2026-09-02",
		status: "em_aprovacao",
		checklist: createEmptyChecklist().map((item) => ({
			...item,
			resposta: "sim" as const,
		})),
		historico: [
			createHistory("h-020", baseDate, "Inspeção criada", "inspetor"),
			createHistory(
				"h-021",
				"2026-09-03T09:00:00.000Z",
				"Encaminhada para revisão",
				"inspetor",
			),
		],
		createdAt: baseDate,
		updatedAt: "2026-09-03T09:00:00.000Z",
	},
	{
		id: "ins-010",
		protocolo: "INS-2026-0010",
		equipamento: "Esteira ES-20",
		setor: "Logística",
		responsavel: "João Pedro",
		data: "2026-09-01",
		status: "em_preenchimento",
		checklist: createEmptyChecklist().map((item, index) =>
			index < 2 ? { ...item, resposta: "sim" as const } : item,
		),
		historico: [
			createHistory("h-022", baseDate, "Inspeção criada", "inspetor"),
			createHistory(
				"h-023",
				"2026-09-02T10:00:00.000Z",
				"Rascunho salvo",
				"inspetor",
			),
		],
		createdAt: baseDate,
		updatedAt: "2026-09-02T10:00:00.000Z",
	},
];

export function createSeedState() {
	return {
		inspections: MOCK_INSPECTIONS,
		protocolCounter: MOCK_INSPECTIONS.length,
	};
}
