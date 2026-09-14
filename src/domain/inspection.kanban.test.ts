import { describe, expect, it } from "vitest";
import { createEmptyChecklist } from "@/domain/inspection.constants";
import {
	canDropInspectionOnStatus,
	resolveKanbanStatusMove,
} from "@/domain/inspection.kanban";
import type { Inspection } from "@/types/inspection.types";

function buildInspection(overrides: Partial<Inspection> = {}): Inspection {
	const now = "2026-09-10T10:00:00.000Z";
	return {
		id: "ins-test",
		protocolo: "INS-2026-0099",
		equipamento: "Equipamento Teste",
		setor: "Produção",
		responsavel: "Maria",
		data: "2026-09-10",
		status: "em_preenchimento",
		checklist: createEmptyChecklist(),
		historico: [],
		createdAt: now,
		updatedAt: now,
		...overrides,
	};
}

function completeChecklist() {
	return createEmptyChecklist().map((item) => ({
		...item,
		resposta: "sim" as const,
	}));
}

describe("inspection.kanban", () => {
	it("resolve transições válidas do fluxo", () => {
		const draft = buildInspection({ checklist: completeChecklist() });

		expect(
			resolveKanbanStatusMove(draft, "em_aprovacao", "inspetor"),
		).toEqual({
			type: "execute",
			action: { type: "submit_for_review", role: "inspetor" },
		});

		const inReview = buildInspection({ status: "em_aprovacao" });
		expect(
			resolveKanbanStatusMove(inReview, "aprovada", "revisor"),
		).toEqual({
			type: "execute",
			action: { type: "approve", role: "revisor" },
		});
		expect(resolveKanbanStatusMove(inReview, "reprovada", "revisor")).toEqual({
			type: "open_review",
		});

		const rejected = buildInspection({
			status: "reprovada",
			checklist: completeChecklist(),
		});
		expect(
			resolveKanbanStatusMove(rejected, "em_aprovacao", "inspetor"),
		).toEqual({
			type: "execute",
			action: { type: "resubmit", role: "inspetor" },
		});
	});

	it("bloqueia transições inválidas e papéis incorretos", () => {
		const draft = buildInspection({ checklist: completeChecklist() });

		expect(resolveKanbanStatusMove(draft, "em_aprovacao", "revisor").type).toBe(
			"invalid",
		);
		expect(resolveKanbanStatusMove(draft, "aprovada", "inspetor").type).toBe(
			"invalid",
		);

		const incompleteDraft = buildInspection();
		expect(
			resolveKanbanStatusMove(incompleteDraft, "em_aprovacao", "inspetor").type,
		).toBe("invalid");

		const approved = buildInspection({ status: "aprovada" });
		expect(
			resolveKanbanStatusMove(approved, "em_aprovacao", "revisor").type,
		).toBe("invalid");
	});

	it("identifica colunas que aceitam drop", () => {
		const draft = buildInspection({ checklist: completeChecklist() });

		expect(canDropInspectionOnStatus(draft, "em_aprovacao", "inspetor")).toBe(
			true,
		);
		expect(canDropInspectionOnStatus(draft, "aprovada", "inspetor")).toBe(
			false,
		);
		expect(resolveKanbanStatusMove(draft, "em_preenchimento", "inspetor").type).toBe(
			"noop",
		);
	});
});
