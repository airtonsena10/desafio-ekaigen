import { parsePersistedState } from "./persistence.schema";
import type { PersistedState } from "@/types/persistence";

export type { PersistedState } from "@/types/persistence";

const STORAGE_KEY = "inspecoes-app-data";

export function createEmptyState(): PersistedState {
	return {
		inspections: [],
		protocolCounter: 0,
	};
}

export function readPersistedState(): PersistedState | null {
	if (typeof window === "undefined") {
		return null;
	}

	const rawValue = window.localStorage.getItem(STORAGE_KEY);
	if (!rawValue) {
		return null;
	}

	try {
		const parsed: unknown = JSON.parse(rawValue);
		return parsePersistedState(parsed);
	} catch {
		return null;
	}
}

export function writePersistedState(state: PersistedState): void {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearPersistedState(): void {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.removeItem(STORAGE_KEY);
}

export function getStorageKey(): string {
	return STORAGE_KEY;
}
