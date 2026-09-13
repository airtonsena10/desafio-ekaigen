import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createEmptyChecklist } from "@/domain/inspection.constants";
import type { Inspection } from "@/types/inspection.types";
import { InspectionProvider } from "@/providers/inspection-provider";
import { RoleProvider } from "@/providers/role-provider";

const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mockPush }),
	usePathname: () => "/inspecoes",
	useSearchParams: () => mockSearchParams,
}));

import { SearchFilters } from "@/components/inspections/search-filters";
import { StatusCounters } from "@/components/inspections/status-counters";

afterEach(() => {
	cleanup();
	mockPush.mockClear();
});

const sampleInspection: Inspection = {
	id: "1",
	protocolo: "INS-2026-0001",
	equipamento: "Compressor",
	setor: "Produção",
	responsavel: "Ana",
	data: "2026-09-10",
	status: "em_aprovacao",
	checklist: createEmptyChecklist().map((item) => ({
		...item,
		resposta: "sim" as const,
	})),
	historico: [],
	createdAt: "2026-09-10T10:00:00.000Z",
	updatedAt: "2026-09-10T10:00:00.000Z",
};

function renderWithProviders(ui: ReactElement) {
	return render(
		<RoleProvider>
			<InspectionProvider>{ui}</InspectionProvider>
		</RoleProvider>,
	);
}

describe("StatusCounters", () => {
	it("renders counts by status", () => {
		render(
			<StatusCounters
				inspections={[
					sampleInspection,
					{ ...sampleInspection, id: "2", status: "aprovada" },
				]}
			/>,
		);

		expect(screen.getByText("Em aprovação")).toBeInTheDocument();
		expect(screen.getByText("Aprovada")).toBeInTheDocument();
	});

	it("filters by status when clicked", async () => {
		const user = userEvent.setup();

		render(
			<StatusCounters
				inspections={[
					sampleInspection,
					{ ...sampleInspection, id: "2", status: "aprovada" },
				]}
			/>,
		);

		await user.click(
			screen.getByRole("button", { name: "Filtrar por Em aprovação (1)" }),
		);

		expect(mockPush).toHaveBeenCalledWith("/inspecoes?status=em_aprovacao", {
			scroll: false,
		});
	});
});

describe("InspectionDetail actions", () => {
	it("does not show edit buttons for approved inspection", async () => {
		const { InspectionDetail } = await import(
			"@/components/inspections/inspection-detail"
		);

		renderWithProviders(
			<InspectionDetail
				inspection={{ ...sampleInspection, status: "aprovada" }}
			/>,
		);

		expect(screen.queryByText("Salvar rascunho")).not.toBeInTheDocument();
		expect(
			screen.queryByText("Encaminhar para revisão"),
		).not.toBeInTheDocument();
	});
});

describe("Search interaction", () => {
	it("filters list through user input", async () => {
		const user = userEvent.setup();
		const onQueryChange = vi.fn();

		render(
			<SearchFilters
				query=""
				status="all"
				onQueryChange={onQueryChange}
				onStatusChange={vi.fn()}
			/>,
		);

		await user.type(screen.getByLabelText("Buscar inspeções"), "compressor");
		expect(onQueryChange).toHaveBeenCalled();
	});
});
