import { describe, expect, it } from "vitest";
import { countByStatus, filterInspections } from "@/domain/inspection.queries";
import {
	applyInspectionAction,
	generateProtocol,
} from "@/domain/inspection.transitions";
import type { Inspection } from "@/domain/inspection.types";
import { createEmptyChecklist } from "@/domain/inspection.types";
import {
	canEditInspection,
	validateApprove,
	validateChecklistComplete,
	validateCreateInspectionInput,
	validateDraftUpdate,
	validateReject,
	validateRequiredMetadata,
	validateResubmit,
	validateSubmitForReview,
} from "@/domain/inspection.validation";

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

describe("inspection.validation", () => {
	it("validates checklist complete and observation for nao", () => {
		const incomplete = createEmptyChecklist();
		expect(validateChecklistComplete(incomplete)).toContain(
			"Responda a pergunta",
		);

		const withMissingObservation = createEmptyChecklist().map((item, index) =>
			index === 0
				? { ...item, resposta: "nao" as const }
				: { ...item, resposta: "sim" as const },
		);
		expect(validateChecklistComplete(withMissingObservation)).toContain(
			"observação",
		);
		expect(validateChecklistComplete(completeChecklist())).toBeNull();
	});

	it("validates metadata and draft rules", () => {
		expect(canEditInspection("aprovada")).toBe(false);
		expect(canEditInspection("reprovada")).toBe(true);

		const approved = buildInspection({ status: "aprovada" });
		expect(validateDraftUpdate(approved, { equipamento: "Novo" })).toContain(
			"não pode ser alterada",
		);

		const draft = buildInspection({
			checklist: createEmptyChecklist().map((item, index) =>
				index === 0
					? { ...item, resposta: "nao" as const }
					: { ...item, resposta: "sim" as const },
			),
		});
		expect(
			validateDraftUpdate(draft, { checklist: draft.checklist }),
		).toContain("observação");

		expect(
			validateRequiredMetadata(buildInspection({ equipamento: "" })),
		).toContain("equipamento");
		expect(validateRequiredMetadata(buildInspection({ setor: "" }))).toContain(
			"setor",
		);
		expect(
			validateRequiredMetadata(buildInspection({ responsavel: "" })),
		).toContain("responsável");
		expect(validateRequiredMetadata(buildInspection({ data: "" }))).toContain(
			"data",
		);

		expect(
			validateCreateInspectionInput({
				equipamento: "",
				setor: "",
				responsavel: "",
				data: "",
			}),
		).toBe(
			"Preencha os campos: equipamento, setor, responsável e data.",
		);
	});

	it("validates submit, approve, reject and resubmit rules", () => {
		const complete = buildInspection({ checklist: completeChecklist() });

		expect(validateSubmitForReview(complete)).toBeNull();
		expect(
			validateSubmitForReview(buildInspection({ status: "em_aprovacao" })),
		).toContain("Somente inspeções");

		expect(
			validateApprove(buildInspection({ status: "em_aprovacao" }), "revisor"),
		).toBeNull();
		expect(
			validateApprove(buildInspection({ status: "em_aprovacao" }), "inspetor"),
		).toContain("revisor");
		expect(
			validateApprove(
				buildInspection({ status: "em_preenchimento" }),
				"revisor",
			),
		).toContain("em aprovação");

		expect(
			validateReject(
				buildInspection({ status: "em_aprovacao" }),
				"revisor",
				"curto",
			),
		).toContain("10 caracteres");
		expect(
			validateReject(
				buildInspection({ status: "em_aprovacao" }),
				"revisor",
				"motivo suficiente para reprovar",
			),
		).toBeNull();
		expect(
			validateReject(
				buildInspection({ status: "em_aprovacao" }),
				"inspetor",
				"x",
			),
		).toContain("revisor");

		expect(
			validateResubmit(
				buildInspection({
					status: "reprovada",
					checklist: completeChecklist(),
				}),
				"inspetor",
			),
		).toBeNull();
		expect(
			validateResubmit(buildInspection({ status: "reprovada" }), "revisor"),
		).toContain("inspetor");
	});

	it("filters and counts inspections", () => {
		const inspections = [
			buildInspection({
				id: "1",
				protocolo: "INS-2026-0001",
				status: "em_preenchimento",
			}),
			buildInspection({
				id: "2",
				protocolo: "INS-2026-0002",
				status: "aprovada",
			}),
		];

		expect(filterInspections(inspections, "0001", "all")).toHaveLength(1);
		expect(filterInspections(inspections, "", "aprovada")).toHaveLength(1);
		expect(filterInspections(inspections, "inexistente", "all")).toHaveLength(
			0,
		);
		expect(countByStatus(inspections).em_preenchimento).toBe(1);
	});
});

describe("inspection.transitions", () => {
	it("generates protocol with sequence", () => {
		expect(generateProtocol(0)).toBe(`INS-${new Date().getFullYear()}-0001`);
	});

	it("applies submit, approve, reject and resubmit", () => {
		const draft = buildInspection({ checklist: completeChecklist() });

		const submitted = applyInspectionAction(draft, {
			type: "submit_for_review",
			role: "inspetor",
		});
		expect(submitted.ok).toBe(true);
		if (!submitted.ok) {
			return;
		}
		expect(submitted.value.status).toBe("em_aprovacao");

		const approved = applyInspectionAction(submitted.value, {
			type: "approve",
			role: "revisor",
		});
		expect(approved.ok).toBe(true);

		const rejected = applyInspectionAction(submitted.value, {
			type: "reject",
			role: "revisor",
			motivo: "Motivo válido para reprovação",
		});
		expect(rejected.ok).toBe(true);
		if (!rejected.ok) {
			return;
		}

		const corrected = applyInspectionAction(
			{
				...rejected.value,
				checklist: completeChecklist(),
			},
			{
				type: "save_draft",
				role: "inspetor",
				updates: { checklist: completeChecklist() },
			},
		);
		expect(corrected.ok).toBe(true);

		const resubmitted = applyInspectionAction(
			{ ...rejected.value, checklist: createEmptyChecklist() },
			{
				type: "resubmit",
				role: "inspetor",
			},
		);
		expect(resubmitted.ok).toBe(false);

		const resubmittedValid = applyInspectionAction(
			{ ...rejected.value, checklist: completeChecklist() },
			{ type: "resubmit", role: "inspetor" },
		);
		expect(resubmittedValid.ok).toBe(true);
	});

	it("rejects invalid actions", () => {
		const draft = buildInspection();
		expect(
			applyInspectionAction(draft, {
				type: "submit_for_review",
				role: "revisor",
			}).ok,
		).toBe(false);
		expect(
			applyInspectionAction(draft, { type: "approve", role: "revisor" }).ok,
		).toBe(false);
	});
});
