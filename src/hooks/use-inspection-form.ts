"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	getDraftPayload,
	serializeDraftPayload,
} from "@/domain/inspection.draft";
import {
	countAnsweredChecklistItems,
	getInspectionActionVisibility,
} from "@/domain/inspection.permissions";
import type { Inspection, InspectionAction } from "@/domain/inspection.types";
import { canEditInspection } from "@/domain/inspection.validation";
import { flushFocusedField } from "@/lib/flush-focused-field";
import { useInspections } from "@/providers/inspection-provider";
import { useRole } from "@/providers/role-provider";

export type ReviewDecision = "approve" | "reject";

interface UseInspectionFormOptions {
	inspection: Inspection;
	onClose?: () => void;
}

export function useInspectionForm({
	inspection,
	onClose,
}: UseInspectionFormOptions) {
	const { role } = useRole();
	const { saveDraft, executeAction } = useInspections();

	const [formState, setFormState] = useState(inspection);
	const [reviewDecision, setReviewDecision] = useState<ReviewDecision | null>(
		null,
	);
	const [motivoReprovacao, setMotivoReprovacao] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const formStateRef = useRef(formState);
	const lastSavedRef = useRef(
		serializeDraftPayload(getDraftPayload(inspection)),
	);
	const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		formStateRef.current = formState;
	}, [formState]);

	useEffect(() => {
		setFormState(inspection);
		setReviewDecision(null);
		setMotivoReprovacao("");
		lastSavedRef.current = serializeDraftPayload(getDraftPayload(inspection));
	}, [inspection]);

	useEffect(() => {
		return () => {
			if (autoSaveTimerRef.current) {
				clearTimeout(autoSaveTimerRef.current);
			}
		};
	}, []);

	const editable = canEditInspection(formState.status);
	const checklistAnswered = countAnsweredChecklistItems(formState);
	const actionVisibility = getInspectionActionVisibility(formState, role);

	const updateField = useCallback(
		<K extends keyof Inspection>(field: K, value: Inspection[K]) => {
			setFormState((current) => {
				const next = { ...current, [field]: value };
				formStateRef.current = next;
				return next;
			});
		},
		[],
	);

	const persistDraft = useCallback(
		async (options?: { silent?: boolean }): Promise<boolean> => {
			const current = formStateRef.current;
			const payload = getDraftPayload(current);
			const snapshot = serializeDraftPayload(payload);

			if (snapshot === lastSavedRef.current) {
				return true;
			}

			setSubmitting(true);
			const result = await saveDraft(current.id, payload);
			setSubmitting(false);

			if (!result.ok) {
				if (!options?.silent) {
					toast.error(result.error);
				}
				return false;
			}

			lastSavedRef.current = serializeDraftPayload(
				getDraftPayload(result.value),
			);
			setFormState(result.value);
			formStateRef.current = result.value;

			if (!options?.silent) {
				toast.success("Rascunho salvo.");
			}

			return true;
		},
		[saveDraft],
	);

	const scheduleAutoSave = useCallback(() => {
		if (!editable || submitting) {
			return;
		}

		if (autoSaveTimerRef.current) {
			clearTimeout(autoSaveTimerRef.current);
		}

		autoSaveTimerRef.current = setTimeout(() => {
			void persistDraft({ silent: true });
		}, 0);
	}, [editable, persistDraft, submitting]);

	const handleAutoSave = useCallback(() => {
		if (!editable || submitting) {
			return;
		}

		void persistDraft({ silent: true });
	}, [editable, persistDraft, submitting]);

	const runAction = useCallback(
		async (
			action: InspectionAction,
			options?: { closeOnSuccess?: boolean },
		): Promise<boolean> => {
			setSubmitting(true);
			const result = await executeAction(formStateRef.current.id, action);
			setSubmitting(false);

			if (!result.ok) {
				toast.error(result.error);
				return false;
			}

			setFormState(result.value);
			formStateRef.current = result.value;
			toast.success("Operação realizada com sucesso.");

			if (options?.closeOnSuccess) {
				onClose?.();
			}

			return true;
		},
		[executeAction, onClose],
	);

	const handleSaveDraft = useCallback(async () => {
		flushFocusedField();
		await persistDraft();
	}, [persistDraft]);

	const handleSubmitForReview = useCallback(async () => {
		flushFocusedField();
		if (!(await persistDraft())) {
			return;
		}

		await runAction(
			{ type: "submit_for_review", role },
			{ closeOnSuccess: true },
		);
	}, [persistDraft, role, runAction]);

	const handleConfirmReview = useCallback(async () => {
		if (!reviewDecision) {
			return;
		}

		if (reviewDecision === "approve") {
			await runAction({ type: "approve", role }, { closeOnSuccess: true });
			return;
		}

		await runAction(
			{ type: "reject", role, motivo: motivoReprovacao },
			{ closeOnSuccess: true },
		);
	}, [motivoReprovacao, reviewDecision, role, runAction]);

	const handleResubmit = useCallback(async () => {
		flushFocusedField();
		if (!(await persistDraft())) {
			return;
		}

		await runAction({ type: "resubmit", role });
	}, [persistDraft, role, runAction]);

	return {
		formState,
		editable,
		submitting,
		checklistAnswered,
		reviewDecision,
		setReviewDecision,
		motivoReprovacao,
		setMotivoReprovacao,
		updateField,
		scheduleAutoSave,
		handleAutoSave,
		handleSaveDraft,
		handleSubmitForReview,
		handleConfirmReview,
		handleResubmit,
		...actionVisibility,
	};
}
