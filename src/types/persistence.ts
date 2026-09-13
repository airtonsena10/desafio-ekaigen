import type { Inspection } from "./inspection.types";

export interface PersistedState {
	inspections: Inspection[];
	protocolCounter: number;
}
