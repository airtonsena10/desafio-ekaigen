"use client";

import { ChecklistForm } from "@/components/inspections/checklist-form";
import { HistoryTimeline } from "@/components/inspections/history-timeline";
import { InspectionActionFooter } from "@/components/inspections/inspection-action-footer";
import { InspectionMetadataFields } from "@/components/inspections/inspection-metadata-fields";
import { InspectionRejectionAlert } from "@/components/inspections/inspection-rejection-alert";
import { InspectionReviewPanel } from "@/components/inspections/inspection-review-panel";
import { StatusBadge } from "@/components/inspections/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Inspection } from "@/domain/inspection.types";
import { useInspectionForm } from "@/hooks/use-inspection-form";
import { cn } from "@/lib/utils";

interface InspectionDetailProps {
	inspection: Inspection;
	onClose?: () => void;
}

export function InspectionDetail({
	inspection,
	onClose,
}: InspectionDetailProps) {
	const isModal = Boolean(onClose);
	const {
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
		showInspectorActions,
		showResubmitAction,
		showReviewerActions,
		hasFooterActions,
	} = useInspectionForm({ inspection, onClose });

	return (
		<div
			className={cn("space-y-6", hasFooterActions && "pb-28 md:pb-0")}
			aria-busy={submitting}
		>
			{formState.motivoReprovacao ? (
				<InspectionRejectionAlert motivo={formState.motivoReprovacao} />
			) : null}

			<header className="space-y-4 border-b pb-5">
				{!isModal ? (
					<div className="flex items-center justify-between gap-3">
						<p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
							{formState.protocolo}
						</p>
						<StatusBadge status={formState.status} />
					</div>
				) : null}

				<InspectionMetadataFields
					inspection={formState}
					editable={editable}
					submitting={submitting}
					showTitle={!isModal}
					onFieldChange={updateField}
					onFieldBlur={handleAutoSave}
				/>
			</header>

			<Tabs defaultValue="checklist" className="gap-4">
				<TabsList className="w-full">
					<TabsTrigger value="checklist" className="flex-1">
						Checklist
						<span className="ml-1.5 text-xs text-muted-foreground tabular-nums">
							{checklistAnswered}/{formState.checklist.length}
						</span>
					</TabsTrigger>
					<TabsTrigger value="historico" className="flex-1">
						Histórico
					</TabsTrigger>
				</TabsList>

				<TabsContent value="checklist" className="space-y-6">
					<ChecklistForm
						items={formState.checklist}
						disabled={!editable || submitting}
						onChange={(checklist) => updateField("checklist", checklist)}
						onAutoSave={scheduleAutoSave}
					/>

					{showReviewerActions ? (
						<InspectionReviewPanel
							submitting={submitting}
							reviewDecision={reviewDecision}
							motivoReprovacao={motivoReprovacao}
							onDecisionChange={setReviewDecision}
							onMotivoChange={setMotivoReprovacao}
						/>
					) : null}
				</TabsContent>

				<TabsContent value="historico">
					<HistoryTimeline entries={formState.historico} />
				</TabsContent>
			</Tabs>

			{hasFooterActions ? (
				<InspectionActionFooter
					submitting={submitting}
					showInspectorActions={showInspectorActions}
					showResubmitAction={showResubmitAction}
					showReviewerActions={showReviewerActions}
					reviewDecision={reviewDecision}
					onSaveDraft={handleSaveDraft}
					onSubmitForReview={handleSubmitForReview}
					onResubmit={handleResubmit}
					onConfirmReview={handleConfirmReview}
				/>
			) : null}
		</div>
	);
}
