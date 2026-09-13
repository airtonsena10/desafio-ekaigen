"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type {
	Inspection,
	InspectionAction,
	InspectionDraftUpdate,
} from "@/domain/inspection.types";
import type { Result } from "@/domain/result";
import { toErrorMessage } from "@/lib/error-message";
import {
	type CreateInspectionInput,
	createInspection,
	getInspection,
	listInspections,
	performInspectionAction,
	restoreMockData,
	saveInspectionDraft,
} from "@/services/inspection.repository";

interface InspectionContextValue {
	inspections: Inspection[];
	loading: boolean;
	refreshing: boolean;
	error: string | null;
	selectedId: string | null;
	setSelectedId: (id: string | null) => void;
	refresh: () => Promise<void>;
	createNewInspection: (
		input: CreateInspectionInput,
	) => Promise<Result<Inspection>>;
	saveDraft: (
		id: string,
		updates: InspectionDraftUpdate,
	) => Promise<Result<Inspection>>;
	executeAction: (
		id: string,
		action: InspectionAction,
	) => Promise<Result<Inspection>>;
	resolveInspection: (id: string) => Promise<Result<Inspection>>;
	restoreMock: () => Promise<void>;
}

const InspectionContext = createContext<InspectionContextValue | null>(null);

async function runRepositoryOperation<T>(
	operation: () => Promise<Result<T>>,
	fallbackMessage: string,
): Promise<Result<T>> {
	try {
		return await operation();
	} catch (error) {
		return { ok: false, error: toErrorMessage(error, fallbackMessage) };
	}
}

function updateInspectionInList(
	inspections: Inspection[],
	updatedInspection: Inspection,
): Inspection[] {
	return inspections.map((inspection) =>
		inspection.id === updatedInspection.id ? updatedInspection : inspection,
	);
}

export function InspectionProvider({ children }: { children: ReactNode }) {
	const [inspections, setInspections] = useState<Inspection[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const inspectionsRef = useRef(inspections);
	inspectionsRef.current = inspections;

	const refresh = useCallback(async () => {
		const isInitialLoad = inspectionsRef.current.length === 0;

		if (isInitialLoad) {
			setLoading(true);
		} else {
			setRefreshing(true);
		}

		setError(null);

		try {
			const data = await listInspections();
			setInspections(data);
		} catch (refreshError) {
			setError(
				toErrorMessage(refreshError, "Não foi possível carregar as inspeções."),
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	const createNewInspection = useCallback(
		async (input: CreateInspectionInput) => {
			const result = await runRepositoryOperation(
				() => createInspection(input),
				"Não foi possível criar a inspeção.",
			);

			if (result.ok) {
				await refresh();
			}

			return result;
		},
		[refresh],
	);

	const saveDraft = useCallback(
		async (id: string, updates: InspectionDraftUpdate) => {
			const result = await runRepositoryOperation(
				() => saveInspectionDraft(id, updates),
				"Não foi possível salvar o rascunho.",
			);

			if (result.ok) {
				setInspections((current) =>
					updateInspectionInList(current, result.value),
				);
			}

			return result;
		},
		[],
	);

	const executeAction = useCallback(
		async (id: string, action: InspectionAction) => {
			const result = await runRepositoryOperation(
				() => performInspectionAction(id, action),
				"Não foi possível executar a ação.",
			);

			if (result.ok) {
				setInspections((current) =>
					updateInspectionInList(current, result.value),
				);
			}

			return result;
		},
		[],
	);

	const resolveInspection = useCallback(async (id: string) => {
		const cached = inspectionsRef.current.find(
			(inspection) => inspection.id === id,
		);

		if (cached) {
			return { ok: true as const, value: cached };
		}

		try {
			const inspection = await getInspection(id);
			if (!inspection) {
				return {
					ok: false as const,
					error: "Inspeção não encontrada.",
				};
			}

			setInspections((current) => {
				const exists = current.some((item) => item.id === id);
				if (exists) {
					return updateInspectionInList(current, inspection);
				}

				return [...current, inspection];
			});

			return { ok: true as const, value: inspection };
		} catch (error) {
			return {
				ok: false as const,
				error: toErrorMessage(error, "Não foi possível carregar a inspeção."),
			};
		}
	}, []);

	const restoreMock = useCallback(async () => {
		const isInitialLoad = inspectionsRef.current.length === 0;

		if (isInitialLoad) {
			setLoading(true);
		} else {
			setRefreshing(true);
		}

		setError(null);

		try {
			const data = await restoreMockData();
			setInspections(data);
			setSelectedId(null);
		} catch (restoreError) {
			setError(
				toErrorMessage(
					restoreError,
					"Não foi possível restaurar os dados mock.",
				),
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	const value = useMemo(
		() => ({
			inspections,
			loading,
			refreshing,
			error,
			selectedId,
			setSelectedId,
			refresh,
			createNewInspection,
			saveDraft,
			executeAction,
			resolveInspection,
			restoreMock,
		}),
		[
			inspections,
			loading,
			refreshing,
			error,
			selectedId,
			refresh,
			createNewInspection,
			saveDraft,
			executeAction,
			resolveInspection,
			restoreMock,
		],
	);

	return (
		<InspectionContext.Provider value={value}>
			{children}
		</InspectionContext.Provider>
	);
}

export function useInspections(): InspectionContextValue {
	const context = useContext(InspectionContext);
	if (!context) {
		throw new Error(
			"useInspections deve ser usado dentro de InspectionProvider.",
		);
	}
	return context;
}
