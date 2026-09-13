import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createEmptyChecklist } from "@/domain/inspection.constants";
import type { Inspection } from "@/types/inspection.types";

const mockSaveDraft = vi.fn();
const mockExecuteAction = vi.fn();

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock("@/providers/inspection-provider", () => ({
	useInspections: () => ({
		saveDraft: mockSaveDraft,
		executeAction: mockExecuteAction,
	}),
}));

vi.mock("@/providers/role-provider", () => ({
	useRole: () => ({ role: "inspetor" }),
}));

const baseInspection: Inspection = {
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

describe("useInspectionForm", () => {
	beforeEach(() => {
		mockSaveDraft.mockReset();
		mockExecuteAction.mockReset();
	});

	it("não persiste rascunho quando não há alterações", async () => {
		mockSaveDraft.mockResolvedValue({ ok: true, value: baseInspection });
		const { useInspectionForm } = await import("@/hooks/use-inspection-form");
		const { result } = renderHook(() =>
			useInspectionForm({ inspection: baseInspection }),
		);

		await act(async () => {
			await result.current.handleSaveDraft();
		});

		expect(mockSaveDraft).not.toHaveBeenCalled();
	});

	it("salva rascunho após alteração de campo", async () => {
		const updatedInspection = { ...baseInspection, equipamento: "Bomba" };
		mockSaveDraft.mockResolvedValue({ ok: true, value: updatedInspection });
		const { useInspectionForm } = await import("@/hooks/use-inspection-form");
		const { result } = renderHook(() =>
			useInspectionForm({ inspection: baseInspection }),
		);

		act(() => {
			result.current.updateField("equipamento", "Bomba");
		});

		await act(async () => {
			await result.current.saveDraftOnBlur();
		});

		expect(mockSaveDraft).toHaveBeenCalledWith(
			"ins-1",
			expect.objectContaining({ equipamento: "Bomba" }),
			"inspetor",
		);
		expect(result.current.formState.equipamento).toBe("Bomba");
	});

	it("encaminha para revisão após salvar alterações", async () => {
		const updatedInspection = {
			...baseInspection,
			checklist: baseInspection.checklist.map((item) => ({
				...item,
				resposta: "sim" as const,
			})),
		};

		mockSaveDraft.mockResolvedValue({ ok: true, value: updatedInspection });
		mockExecuteAction.mockResolvedValue({
			ok: true,
			value: { ...updatedInspection, status: "em_aprovacao" },
		});

		const { useInspectionForm } = await import("@/hooks/use-inspection-form");
		const onClose = vi.fn();
		const { result } = renderHook(() =>
			useInspectionForm({ inspection: baseInspection, onClose }),
		);

		act(() => {
			result.current.updateField("checklist", updatedInspection.checklist);
		});

		await act(async () => {
			await result.current.handleSubmitForReview();
		});

		expect(mockSaveDraft).toHaveBeenCalled();
		expect(mockExecuteAction).toHaveBeenCalledWith("ins-1", {
			type: "submit_for_review",
			role: "inspetor",
		});
		expect(onClose).toHaveBeenCalled();
	});
});
