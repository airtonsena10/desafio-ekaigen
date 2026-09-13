import { describe, expect, it } from "vitest";
import {
	countAnsweredChecklistItems,
	getInspectionActionVisibility,
	getInspectionCardAction,
	getInspectionCardActionLabel,
} from "@/domain/inspection.permissions";
import { createEmptyChecklist } from "@/domain/inspection.constants";
import type { Inspection } from "@/types/inspection.types";

function buildInspection(overrides: Partial<Inspection> = {}): Inspection {
	return {
		id: "ins-1",
		protocolo: "INS-2026-0001",
		equipamento: "Compressor",
		setor: "Produção",
		responsavel: "Ana",
		data: "2026-09-10",
		status: "em_preenchimento",
		checklist: createEmptyChecklist(),
		historico: [],
		createdAt: "2026-09-10T10:00:00.000Z",
		updatedAt: "2026-09-10T10:00:00.000Z",
		...overrides,
	};
}

describe("getInspectionActionVisibility", () => {
	it("mostra ações do inspetor em preenchimento", () => {
		const visibility = getInspectionActionVisibility(
			buildInspection({ status: "em_preenchimento" }),
			"inspetor",
		);

		expect(visibility.showInspectorActions).toBe(true);
		expect(visibility.showReviewerActions).toBe(false);
		expect(visibility.hasFooterActions).toBe(true);
	});

	it("mostra ações do revisor em aprovação", () => {
		const visibility = getInspectionActionVisibility(
			buildInspection({ status: "em_aprovacao" }),
			"revisor",
		);

		expect(visibility.showReviewerActions).toBe(true);
		expect(visibility.showInspectorActions).toBe(false);
	});

	it("mostra reenvio para inspetor em inspeção reprovada", () => {
		const visibility = getInspectionActionVisibility(
			buildInspection({ status: "reprovada" }),
			"inspetor",
		);

		expect(visibility.showResubmitAction).toBe(true);
		expect(visibility.hasFooterActions).toBe(true);
	});
});

describe("getInspectionCardAction", () => {
	it("retorna review para revisor em aprovação", () => {
		expect(
			getInspectionCardAction(
				buildInspection({ status: "em_aprovacao" }),
				"revisor",
			),
		).toBe("review");
	});

	it("retorna open para inspetor", () => {
		expect(
			getInspectionCardAction(
				buildInspection({ status: "em_aprovacao" }),
				"inspetor",
			),
		).toBe("open");
	});
});

describe("getInspectionCardActionLabel", () => {
	it("usa labels por variante", () => {
		expect(getInspectionCardActionLabel("open", "list")).toBe("Ver detalhes");
		expect(getInspectionCardActionLabel("open", "kanban")).toBe("Abrir");
		expect(getInspectionCardActionLabel("review", "kanban")).toBe("Revisar");
	});
});

describe("countAnsweredChecklistItems", () => {
	it("conta apenas itens respondidos", () => {
		const checklist = createEmptyChecklist().map((item, index) => ({
			...item,
			resposta: index === 0 ? ("sim" as const) : null,
		}));

		expect(countAnsweredChecklistItems(buildInspection({ checklist }))).toBe(1);
	});
});
