import type { Inspection } from "../domain/inspection.types";

const STORAGE_KEY = "inspecoes-app-data";

export interface PersistedState {
	inspections: Inspection[];
	protocolCounter: number;
}

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
		if (
			typeof parsed === "object" &&
			parsed !== null &&
			"inspections" in parsed &&
			"protocolCounter" in parsed &&
			Array.isArray(parsed.inspections) &&
			typeof parsed.protocolCounter === "number"
		) {
			return parsed as PersistedState;
		}
	} catch {
		return null;
	}

	return null;
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
