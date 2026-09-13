import { describe, expect, it } from "vitest";
import {
	getDraftPayload,
	serializeDraftPayload,
} from "@/domain/inspection.draft";
import type { Inspection } from "@/domain/inspection.types";
import { createEmptyChecklist } from "@/domain/inspection.types";

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

describe("inspection.draft", () => {
	it("extrai apenas os campos editáveis do rascunho", () => {
		const inspection = buildInspection();

		expect(getDraftPayload(inspection)).toEqual({
			equipamento: "Compressor",
			setor: "Produção",
			responsavel: "Ana",
			data: "2026-09-10",
			checklist: inspection.checklist,
		});
	});

	it("serializa payloads equivalentes com a mesma string", () => {
		const inspection = buildInspection();
		const payload = getDraftPayload(inspection);

		expect(serializeDraftPayload(payload)).toBe(serializeDraftPayload(payload));
	});

	it("detecta alterações no payload serializado", () => {
		const inspection = buildInspection();
		const original = serializeDraftPayload(getDraftPayload(inspection));
		const changed = serializeDraftPayload(
			getDraftPayload(buildInspection({ equipamento: "Bomba" })),
		);

		expect(original).not.toBe(changed);
	});
});
