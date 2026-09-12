"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChecklistForm } from "@/components/inspections/checklist-form";
import { HistoryTimeline } from "@/components/inspections/history-timeline";
import { StatusBadge } from "@/components/inspections/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Inspection, InspectionAction } from "@/domain/inspection.types";
import { canEditInspection } from "@/domain/inspection.validation";
import { useInspections } from "@/providers/inspection-provider";
import { useRole } from "@/providers/role-provider";

interface InspectionDetailProps {
	inspection: Inspection;
	onClose?: () => void;
}

export function InspectionDetail({
	inspection,
	onClose,
}: InspectionDetailProps) {
	const { role } = useRole();
	const { saveDraft, executeAction } = useInspections();
	const [formState, setFormState] = useState(inspection);
	const [motivoReprovacao, setMotivoReprovacao] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		setFormState(inspection);
		setMotivoReprovacao("");
	}, [inspection]);

	const editable = canEditInspection(formState.status);

	const updateField = <K extends keyof Inspection>(
		field: K,
		value: Inspection[K],
	) => {
		setFormState((current) => ({ ...current, [field]: value }));
	};

	const runAction = async (
		action: InspectionAction,
		options?: { closeOnSuccess?: boolean },
	) => {
		setSubmitting(true);
		const result = await executeAction(formState.id, action);
		setSubmitting(false);

		if (!result.ok) {
			toast.error(result.error);
			return false;
		}

		setFormState(result.value);
		toast.success("Operação realizada com sucesso.");

		if (options?.closeOnSuccess) {
			onClose?.();
		}

		return true;
	};

	const persistDraft = async (): Promise<boolean> => {
		setSubmitting(true);
		const result = await saveDraft(formState.id, {
			equipamento: formState.equipamento,
			setor: formState.setor,
			responsavel: formState.responsavel,
			data: formState.data,
			checklist: formState.checklist,
		});
		setSubmitting(false);

		if (!result.ok) {
			toast.error(result.error);
			return false;
		}

		setFormState(result.value);
		return true;
	};

	const handleSaveDraft = async () => {
		const saved = await persistDraft();
		if (saved) {
			toast.success("Rascunho salvo.");
		}
	};

	const handleSubmitForReview = async () => {
		if (!(await persistDraft())) {
			return;
		}

		await runAction({ type: "submit_for_review", role }, { closeOnSuccess: true });
	};

	const handleApprove = async () => {
		await runAction({ type: "approve", role });
	};

	const handleReject = async () => {
		await runAction({ type: "reject", role, motivo: motivoReprovacao });
	};

	const handleResubmit = async () => {
		if (!(await persistDraft())) {
			return;
		}

		await runAction({ type: "resubmit", role });
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<p className="text-sm text-muted-foreground">Protocolo</p>
					<h2 className="text-2xl font-semibold">{formState.protocolo}</h2>
				</div>
				<StatusBadge status={formState.status} />
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="equipamento">Equipamento</Label>
					<Input
						id="equipamento"
						value={formState.equipamento}
						onChange={(event) => updateField("equipamento", event.target.value)}
						disabled={!editable}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="setor">Setor</Label>
					<Input
						id="setor"
						value={formState.setor}
						onChange={(event) => updateField("setor", event.target.value)}
						disabled={!editable}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="responsavel">Responsável</Label>
					<Input
						id="responsavel"
						value={formState.responsavel}
						onChange={(event) => updateField("responsavel", event.target.value)}
						disabled={!editable}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="data">Data</Label>
					<Input
						id="data"
						type="date"
						value={formState.data}
						onChange={(event) => updateField("data", event.target.value)}
						disabled={!editable}
					/>
				</div>
			</div>

			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Checklist</h3>
				<ChecklistForm
					items={formState.checklist}
					disabled={!editable}
					onChange={(checklist) => updateField("checklist", checklist)}
				/>
			</div>

			{formState.motivoReprovacao ? (
				<div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
					<p className="font-medium">Motivo da reprovação</p>
					<p>{formState.motivoReprovacao}</p>
				</div>
			) : null}

			<div className="flex flex-wrap justify-center gap-2">
				{editable && role === "inspetor" ? (
					<Button
						disabled={submitting}
						onClick={handleSaveDraft}
						variant="secondary"
					>
						Salvar rascunho
					</Button>
				) : null}

				{formState.status === "em_preenchimento" && role === "inspetor" ? (
					<Button disabled={submitting} onClick={handleSubmitForReview}>
						Encaminhar para revisão
					</Button>
				) : null}

				{formState.status === "reprovada" && role === "inspetor" ? (
					<Button disabled={submitting} onClick={handleResubmit}>
						Reenviar correção
					</Button>
				) : null}

				{formState.status === "em_aprovacao" && role === "revisor" ? (
					<Button disabled={submitting} onClick={handleApprove}>
						Aprovar
					</Button>
				) : null}
			</div>

			{formState.status === "em_aprovacao" && role === "revisor" ? (
				<div className="space-y-2 rounded-lg border p-4">
					<Label htmlFor="motivo-reprovacao">Motivo da reprovação</Label>
					<Textarea
						id="motivo-reprovacao"
						value={motivoReprovacao}
						onChange={(event) => setMotivoReprovacao(event.target.value)}
						placeholder="Descreva o motivo com pelo menos 10 caracteres"
					/>
					<div className="flex justify-center">
						<Button
							disabled={submitting}
							variant="destructive"
							onClick={handleReject}
						>
							Reprovar
						</Button>
					</div>
				</div>
			) : null}

			<Separator />

			<div className="space-y-3">
				<h3 className="text-lg font-semibold">Histórico</h3>
				<HistoryTimeline entries={formState.historico} />
			</div>

			{onClose ? (
				<div className="flex justify-center">
					<Button variant="outline" onClick={onClose}>
						Fechar
					</Button>
				</div>
			) : null}
		</div>
	);
}
