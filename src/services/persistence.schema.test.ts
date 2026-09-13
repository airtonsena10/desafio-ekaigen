import { describe, expect, it } from "vitest";
import { createEmptyChecklist } from "@/domain/inspection.constants";
import { parsePersistedState } from "@/services/persistence.schema";

function buildValidState() {
	return {
		protocolCounter: 1,
		inspections: [
			{
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
			},
		],
	};
}

describe("parsePersistedState", () => {
	it("aceita estado persistido válido", () => {
		expect(parsePersistedState(buildValidState())).toEqual(buildValidState());
	});

	it("rejeita payload sem inspections", () => {
		expect(parsePersistedState({ protocolCounter: 1 })).toBeNull();
	});

	it("rejeita inspeção com status inválido", () => {
		const valid = buildValidState();
		const invalidInspection: unknown = {
			...valid.inspections[0],
			status: "invalido",
		};

		expect(
			parsePersistedState({
				...valid,
				inspections: [invalidInspection],
			}),
		).toBeNull();
	});

	it("rejeita checklist malformado", () => {
		const valid = buildValidState();
		const invalidInspection: unknown = {
			...valid.inspections[0],
			checklist: [{ id: "x", pergunta: "?", resposta: null }],
		};

		expect(
			parsePersistedState({
				...valid,
				inspections: [invalidInspection],
			}),
		).toBeNull();
	});
});
