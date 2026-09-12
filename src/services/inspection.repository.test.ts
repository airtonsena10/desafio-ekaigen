import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createInspection,
	getInspection,
	getRepositoryStateForTests,
	initializeRepositoryForTests,
	listInspections,
	performInspectionAction,
	resetStorage,
	restoreMockData,
	saveInspectionDraft,
} from "@/services/inspection.repository";
import { createSeedState } from "@/services/mock-data";
import {
	clearPersistedState,
	createEmptyState,
	getStorageKey,
	readPersistedState,
	writePersistedState,
} from "@/services/persistence";
import {
	getSimulationSettings,
	resetSimulationSettings,
	simulateAsyncOperation,
	updateSimulationSettings,
} from "@/services/simulation";

describe("simulation", () => {
	it("applies delay and throws when failure is enabled", async () => {
		updateSimulationSettings({ delayMs: 0, shouldFail: true });
		await expect(simulateAsyncOperation(() => "ok")).rejects.toThrow(
			"Falha simulada",
		);
		resetSimulationSettings();
		expect(getSimulationSettings().shouldFail).toBe(false);
	});

	it("uses default delay when env is invalid", () => {
		const original = process.env.NEXT_PUBLIC_SIMULATE_DELAY_MS;
		process.env.NEXT_PUBLIC_SIMULATE_DELAY_MS = "invalid";
		resetSimulationSettings();
		expect(getSimulationSettings().delayMs).toBe(300);
		process.env.NEXT_PUBLIC_SIMULATE_DELAY_MS = original;
	});
});

describe("persistence", () => {
	it("reads and writes persisted state", () => {
		const seed = createSeedState();
		writePersistedState(seed);
		expect(readPersistedState()?.inspections).toHaveLength(
			seed.inspections.length,
		);
		expect(getStorageKey()).toBe("inspecoes-app-data");
	});

	it("returns null for invalid persisted payload", () => {
		window.localStorage.setItem(getStorageKey(), "{invalid");
		expect(readPersistedState()).toBeNull();
	});

	it("clears persisted state", () => {
		writePersistedState(createSeedState());
		clearPersistedState();
		expect(readPersistedState()).toBeNull();
	});
});

describe("inspection.repository", () => {
	beforeEach(() => {
		vi.stubGlobal("crypto", {
			randomUUID: vi.fn(() => "uuid-test"),
		});
		clearPersistedState();
		resetSimulationSettings();
		updateSimulationSettings({ delayMs: 0, shouldFail: false });
	});

	it("seeds on first load and lists inspections", async () => {
		const inspections = await listInspections();
		expect(inspections.length).toBeGreaterThan(0);
		const first = inspections[0];
		const loaded = await getInspection(first.id);
		expect(loaded?.protocolo).toBe(first.protocolo);
	});

	it("creates, saves draft and submits inspection", async () => {
		initializeRepositoryForTests({ inspections: [], protocolCounter: 0 });
		const created = await createInspection({
			equipamento: "Bomba",
			setor: "Utilidades",
			responsavel: "João",
			data: "2026-09-10",
		});
		expect(created.ok).toBe(true);
		if (!created.ok) {
			return;
		}

		const saved = await saveInspectionDraft(created.value.id, {
			checklist: created.value.checklist.map((item) => ({
				...item,
				resposta: "sim",
			})),
		});
		expect(saved.ok).toBe(true);

		const submitted = await performInspectionAction(created.value.id, {
			type: "submit_for_review",
			role: "inspetor",
		});
		expect(submitted.ok).toBe(true);
	});

	it("handles missing inspection and repository reset", async () => {
		initializeRepositoryForTests(createEmptyState());
		const missing = await getInspection("missing");
		expect(missing).toBeNull();

		const action = await performInspectionAction("missing", {
			type: "approve",
			role: "revisor",
		});
		expect(action.ok).toBe(false);

		await resetStorage();
		expect(getRepositoryStateForTests().inspections).toHaveLength(0);
	});

	it("restores mock data", async () => {
		initializeRepositoryForTests({ inspections: [], protocolCounter: 0 });
		const restored = await restoreMockData();
		expect(restored.length).toBeGreaterThan(8);
	});
});
