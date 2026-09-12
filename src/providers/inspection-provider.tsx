"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type {
	Inspection,
	InspectionAction,
	InspectionDraftUpdate,
} from "@/domain/inspection.types";
import type { Result } from "@/domain/result";
import {
	type CreateInspectionInput,
	createInspection,
	listInspections,
	performInspectionAction,
	restoreMockData,
	saveInspectionDraft,
} from "@/services/inspection.repository";

interface InspectionContextValue {
	inspections: Inspection[];
	loading: boolean;
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
	restoreMock: () => Promise<void>;
}

const InspectionContext = createContext<InspectionContextValue | null>(null);

export function InspectionProvider({ children }: { children: ReactNode }) {
	const [inspections, setInspections] = useState<Inspection[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const refresh = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const data = await listInspections();
			setInspections(data);
		} catch (refreshError) {
			const message =
				refreshError instanceof Error
					? refreshError.message
					: "Não foi possível carregar as inspeções.";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	const createNewInspection = useCallback(
		async (input: CreateInspectionInput) => {
			try {
				const result = await createInspection(input);
				if (result.ok) {
					await refresh();
				}
				return result;
			} catch (creationError) {
				const message =
					creationError instanceof Error
						? creationError.message
						: "Não foi possível criar a inspeção.";
				return { ok: false as const, error: message };
			}
		},
		[refresh],
	);

	const saveDraft = useCallback(
		async (id: string, updates: InspectionDraftUpdate) => {
			try {
				const result = await saveInspectionDraft(id, updates);
				if (result.ok) {
					setInspections((current) =>
						current.map((inspection) =>
							inspection.id === id ? result.value : inspection,
						),
					);
				}
				return result;
			} catch (saveError) {
				const message =
					saveError instanceof Error
						? saveError.message
						: "Não foi possível salvar o rascunho.";
				return { ok: false as const, error: message };
			}
		},
		[],
	);

	const executeAction = useCallback(
		async (id: string, action: InspectionAction) => {
			try {
				const result = await performInspectionAction(id, action);
				if (result.ok) {
					setInspections((current) =>
						current.map((inspection) =>
							inspection.id === id ? result.value : inspection,
						),
					);
				}
				return result;
			} catch (actionError) {
				const message =
					actionError instanceof Error
						? actionError.message
						: "Não foi possível executar a ação.";
				return { ok: false as const, error: message };
			}
		},
		[],
	);

	const restoreMock = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await restoreMockData();
			setInspections(data);
			setSelectedId(null);
		} catch (restoreError) {
			const message =
				restoreError instanceof Error
					? restoreError.message
					: "Não foi possível restaurar os dados mock.";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	const value = useMemo(
		() => ({
			inspections,
			loading,
			error,
			selectedId,
			setSelectedId,
			refresh,
			createNewInspection,
			saveDraft,
			executeAction,
			restoreMock,
		}),
		[
			inspections,
			loading,
			error,
			selectedId,
			refresh,
			createNewInspection,
			saveDraft,
			executeAction,
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
