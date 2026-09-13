"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ReviewDecision } from "@/types";
import { cn } from "@/lib/utils";

interface InspectionReviewPanelProps {
	submitting: boolean;
	reviewDecision: ReviewDecision | null;
	motivoReprovacao: string;
	onDecisionChange: (decision: ReviewDecision) => void;
	onMotivoChange: (motivo: string) => void;
}

export function InspectionReviewPanel({
	submitting,
	reviewDecision,
	motivoReprovacao,
	onDecisionChange,
	onMotivoChange,
}: InspectionReviewPanelProps) {
	return (
		<section className="space-y-4 border-t pt-5">
			<div className="grid grid-cols-2 gap-2">
				<Button
					type="button"
					variant="outline"
					disabled={submitting}
					aria-pressed={reviewDecision === "approve"}
					onClick={() => onDecisionChange("approve")}
					className={cn(
						"min-h-11",
						reviewDecision === "approve" &&
							"border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
					)}
				>
					<CheckCircle2 className="size-4" />
					Aprovar
				</Button>

				<Button
					type="button"
					variant="outline"
					disabled={submitting}
					aria-pressed={reviewDecision === "reject"}
					onClick={() => onDecisionChange("reject")}
					className={cn(
						"min-h-11",
						reviewDecision === "reject" &&
							"border-rose-600 bg-rose-50 text-rose-800 hover:bg-rose-100",
					)}
				>
					<XCircle className="size-4" />
					Reprovar
				</Button>
			</div>

			{reviewDecision === "reject" ? (
				<div className="space-y-2 animate-fade-up">
					<Label htmlFor="motivo-reprovacao">Motivo da reprovação</Label>
					<Textarea
						id="motivo-reprovacao"
						value={motivoReprovacao}
						onChange={(event) => onMotivoChange(event.target.value)}
						placeholder="Descreva o motivo com pelo menos 10 caracteres"
						disabled={submitting}
						className="min-h-24"
					/>
				</div>
			) : null}
		</section>
	);
}
