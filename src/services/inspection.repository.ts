import { createEmptyChecklist } from "@/domain/inspection.constants";
import {
	applyInspectionAction,
	generateProtocol,
} from "@/domain/inspection.transitions";
import { validateCreateInspectionInput } from "@/domain/inspection.validation";
import { err, ok } from "@/domain/result";
import { createSeedState } from "./mock-data";
import {
	clearPersistedState,
	createEmptyState,
	readPersistedState,
	writePersistedState,
} from "./persistence";
import { simulateAsyncOperation } from "./simulation";
import type {
	CreateInspectionInput,
	Inspection,
	InspectionAction,
	InspectionDraftUpdate,
	PersistedState,
	Result,
	UserRole,
} from "@/types";

function ensureState(): PersistedState {
	const persisted = readPersistedState();
	if (persisted) {
		return persisted;
	}

	const seed = createSeedState();
	writePersistedState(seed);
	return seed;
}

function saveState(state: PersistedState): void {
	writePersistedState(state);
}

function findInspection(
	state: PersistedState,
	id: string,
): Inspection | undefined {
	return state.inspections.find((inspection) => inspection.id === id);
}

function updateInspectionInState(
	state: PersistedState,
	updatedInspection: Inspection,
): PersistedState {
	return {
		...state,
		inspections: state.inspections.map((inspection) =>
			inspection.id === updatedInspection.id ? updatedInspection : inspection,
		),
	};
}

export async function listInspections(): Promise<Inspection[]> {
	return simulateAsyncOperation(() => {
		const state = ensureState();
		return [...state.inspections].sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
		);
	});
}

export async function getInspection(id: string): Promise<Inspection | null> {
	return simulateAsyncOperation(() => {
		const state = ensureState();
		return findInspection(state, id) ?? null;
	});
}

export async function createInspection(
	input: CreateInspectionInput,
): Promise<Result<Inspection>> {
	return simulateAsyncOperation(() => {
		const validationError = validateCreateInspectionInput(input);
		if (validationError) {
			return err(validationError);
		}

		const state = ensureState();
		const now = new Date().toISOString();
		const protocolCounter = state.protocolCounter + 1;

		const inspection: Inspection = {
			id: crypto.randomUUID(),
			protocolo: generateProtocol(state.protocolCounter),
			equipamento: input.equipamento,
			setor: input.setor,
			responsavel: input.responsavel,
			data: input.data,
			status: "em_preenchimento",
			checklist: createEmptyChecklist(),
			historico: [
				{
					id: crypto.randomUUID(),
					timestamp: now,
					acao: "Inspeção criada",
					papel: "inspetor",
				},
			],
			createdAt: now,
			updatedAt: now,
		};

		saveState({
			inspections: [inspection, ...state.inspections],
			protocolCounter,
		});

		return ok(inspection);
	});
}

export async function saveInspectionDraft(
	id: string,
	updates: InspectionDraftUpdate,
	role: UserRole = "inspetor",
): Promise<Result<Inspection>> {
	return applyAction(id, { type: "save_draft", role, updates });
}

export async function performInspectionAction(
	id: string,
	action: InspectionAction,
): Promise<Result<Inspection>> {
	return applyAction(id, action);
}

async function applyAction(
	id: string,
	action: InspectionAction,
): Promise<Result<Inspection>> {
	return simulateAsyncOperation(() => {
		const state = ensureState();
		const inspection = findInspection(state, id);

		if (!inspection) {
			return err("Inspeção não encontrada.");
		}

		const result = applyInspectionAction(inspection, action);
		if (!result.ok) {
			return result;
		}

		saveState(updateInspectionInState(state, result.value));
		return result;
	});
}

export async function restoreMockData(): Promise<Inspection[]> {
	return simulateAsyncOperation(() => {
		clearPersistedState();
		const seed = createSeedState();
		writePersistedState(seed);
		return seed.inspections;
	});
}

export async function resetStorage(): Promise<void> {
	return simulateAsyncOperation(() => {
		clearPersistedState();
	});
}

export function initializeRepositoryForTests(state?: PersistedState): void {
	clearPersistedState();
	if (state) {
		writePersistedState(state);
	}
}

export function getRepositoryStateForTests(): PersistedState {
	return readPersistedState() ?? createEmptyState();
}
