"use client";

import { ActionButton } from "@/components/inspections/action-button";
import type { ReviewDecision } from "@/hooks/use-inspection-form";

interface InspectionActionFooterProps {
	submitting: boolean;
	showInspectorActions: boolean;
	showResubmitAction: boolean;
	showReviewerActions: boolean;
	reviewDecision: ReviewDecision | null;
	onSaveDraft: () => void;
	onSubmitForReview: () => void;
	onResubmit: () => void;
	onConfirmReview: () => void;
}

export function InspectionActionFooter({
	submitting,
	showInspectorActions,
	showResubmitAction,
	showReviewerActions,
	reviewDecision,
	onSaveDraft,
	onSubmitForReview,
	onResubmit,
	onConfirmReview,
}: InspectionActionFooterProps) {
	return (
		<div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-4 backdrop-blur md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
			<div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
				{showInspectorActions ? (
					<>
						<ActionButton
							loading={submitting}
							onClick={onSaveDraft}
							variant="secondary"
							className="min-h-11 flex-1 sm:flex-none"
						>
							Salvar rascunho
						</ActionButton>
						<ActionButton
							loading={submitting}
							onClick={onSubmitForReview}
							className="min-h-11 flex-1 sm:flex-none"
						>
							Encaminhar para revisão
						</ActionButton>
					</>
				) : null}

				{showResubmitAction ? (
					<ActionButton
						loading={submitting}
						onClick={onResubmit}
						className="min-h-11 w-full sm:w-auto"
					>
						Reenviar correção
					</ActionButton>
				) : null}

				{showReviewerActions ? (
					<ActionButton
						loading={submitting}
						disabled={!reviewDecision}
						variant={reviewDecision === "reject" ? "destructive" : "default"}
						onClick={onConfirmReview}
						className="min-h-11 w-full sm:w-auto"
					>
						{reviewDecision === "reject"
							? "Confirmar reprovação"
							: reviewDecision === "approve"
								? "Confirmar aprovação"
								: "Selecione uma decisão"}
					</ActionButton>
				) : null}
			</div>
		</div>
	);
}
