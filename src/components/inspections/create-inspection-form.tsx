"use client";

import { Plus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateCreateInspectionInput } from "@/domain/inspection.validation";
import { useInspections } from "@/providers/inspection-provider";
import type { Inspection } from "@/types";

interface CreateInspectionFormProps {
	onCreated: (inspection: Inspection) => void;
}

interface CreateInspectionFormState {
	equipamento: string;
	setor: string;
	responsavel: string;
	data: string;
}

function getInitialFormState(): CreateInspectionFormState {
	return {
		equipamento: "",
		setor: "",
		responsavel: "",
		data: new Date().toISOString().slice(0, 10),
	};
}

export function CreateInspectionForm({ onCreated }: CreateInspectionFormProps) {
	const { createNewInspection } = useInspections();
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] =
		useState<CreateInspectionFormState>(getInitialFormState);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const payload = {
			equipamento: form.equipamento.trim(),
			setor: form.setor.trim(),
			responsavel: form.responsavel.trim(),
			data: form.data,
		};
		const validationError = validateCreateInspectionInput(payload);

		if (validationError) {
			toast.error(validationError);
			return;
		}

		setSubmitting(true);
		const result = await createNewInspection(payload);
		setSubmitting(false);

		if (!result.ok) {
			toast.error(result.error);
			return;
		}

		toast.success("Inspeção criada.");
		onCreated(result.value);
		setForm(getInitialFormState());
	};

	return (
		<Card className="overflow-hidden border bg-card shadow-sm">
			<CardHeader className="border-b bg-muted/20 pb-4">
				<CardTitle className="flex items-center gap-2 text-lg">
					<Plus className="size-5" />
					Nova inspeção
				</CardTitle>
			</CardHeader>
			<CardContent className="p-5">
				<form
					className="grid gap-4 md:grid-cols-2"
					noValidate
					onSubmit={handleSubmit}
				>
					<div className="space-y-2">
						<Label htmlFor="novo-equipamento">Equipamento</Label>
						<Input
							id="novo-equipamento"
							name="equipamento"
							placeholder="Ex.: Compressor AR-01"
							value={form.equipamento}
							onChange={(event) =>
								setForm((current) => ({
									...current,
									equipamento: event.target.value,
								}))
							}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="novo-setor">Setor</Label>
						<Input
							id="novo-setor"
							name="setor"
							placeholder="Ex.: Produção"
							value={form.setor}
							onChange={(event) =>
								setForm((current) => ({
									...current,
									setor: event.target.value,
								}))
							}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="novo-responsavel">Responsável</Label>
						<Input
							id="novo-responsavel"
							name="responsavel"
							placeholder="Nome do responsável"
							value={form.responsavel}
							onChange={(event) =>
								setForm((current) => ({
									...current,
									responsavel: event.target.value,
								}))
							}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="novo-data">Data</Label>
						<Input
							id="novo-data"
							name="data"
							type="date"
							value={form.data}
							onChange={(event) =>
								setForm((current) => ({ ...current, data: event.target.value }))
							}
						/>
					</div>
					<div className="md:col-span-2">
						<Button
							type="submit"
							className="w-full md:w-auto"
							disabled={submitting}
						>
							Criar inspeção
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
