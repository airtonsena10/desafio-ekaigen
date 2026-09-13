import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createEmptyChecklist } from "@/domain/inspection.constants";
import type { Inspection } from "@/types/inspection.types";
import { useSelectedInspection } from "@/hooks/use-selected-inspection";

const inspection: Inspection = {
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
};

describe("useSelectedInspection", () => {
	it("retorna null quando não há seleção", () => {
		const { result } = renderHook(() =>
			useSelectedInspection({
				selectedId: null,
				inspections: [inspection],
				pendingInspection: null,
			}),
		);

		expect(result.current).toBeNull();
	});

	it("prioriza inspeção pendente recém-criada", () => {
		const pending = { ...inspection, equipamento: "Bomba" };

		const { result } = renderHook(() =>
			useSelectedInspection({
				selectedId: inspection.id,
				inspections: [inspection],
				pendingInspection: pending,
			}),
		);

		expect(result.current?.equipamento).toBe("Bomba");
	});

	it("busca inspeção na lista quando não há pendência", () => {
		const { result } = renderHook(() =>
			useSelectedInspection({
				selectedId: inspection.id,
				inspections: [inspection],
				pendingInspection: null,
			}),
		);

		expect(result.current?.id).toBe("ins-1");
	});
});
