export interface SimulationSettings {
	delayMs: number;
	shouldFail: boolean;
}

const DEFAULT_DELAY_MS = 300;

function readEnvDelay(): number {
	const rawValue = process.env.NEXT_PUBLIC_SIMULATE_DELAY_MS;
	if (!rawValue) {
		return DEFAULT_DELAY_MS;
	}

	const parsed = Number.parseInt(rawValue, 10);
	return Number.isNaN(parsed) ? DEFAULT_DELAY_MS : parsed;
}

function readEnvFailure(): boolean {
	return process.env.NEXT_PUBLIC_SIMULATE_FAILURE === "true";
}

let runtimeSettings: SimulationSettings = {
	delayMs: readEnvDelay(),
	shouldFail: readEnvFailure(),
};

export function getSimulationSettings(): SimulationSettings {
	return { ...runtimeSettings };
}

export function updateSimulationSettings(
	settings: Partial<SimulationSettings>,
): SimulationSettings {
	runtimeSettings = {
		...runtimeSettings,
		...settings,
	};
	return getSimulationSettings();
}

export function resetSimulationSettings(): SimulationSettings {
	runtimeSettings = {
		delayMs: readEnvDelay(),
		shouldFail: readEnvFailure(),
	};
	return getSimulationSettings();
}

export async function simulateAsyncOperation<T>(
	operation: () => T,
): Promise<T> {
	const { delayMs, shouldFail } = getSimulationSettings();

	if (delayMs > 0) {
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
	}

	if (shouldFail) {
		throw new Error("Falha simulada na operação de dados.");
	}

	return operation();
}
