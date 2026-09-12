"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { ChecklistItem, YesNo } from "@/domain/inspection.types";

interface ChecklistFormProps {
	items: ChecklistItem[];
	disabled?: boolean;
	onChange: (items: ChecklistItem[]) => void;
}

export function ChecklistForm({
	items,
	disabled = false,
	onChange,
}: ChecklistFormProps) {
	const updateItem = (
		id: ChecklistItem["id"],
		changes: Partial<ChecklistItem>,
	) => {
		onChange(
			items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
		);
	};

	return (
		<div className="space-y-5">
			{items.map((item) => (
				<div key={item.id} className="space-y-3 rounded-lg border p-4">
					<p className="font-medium">{item.pergunta}</p>
					<RadioGroup
						value={item.resposta ?? ""}
						onValueChange={(value) =>
							updateItem(item.id, {
								resposta: value as YesNo,
								observacao: value === "nao" ? item.observacao : undefined,
							})
						}
						className="flex gap-6"
						disabled={disabled}
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="sim" id={`${item.id}-sim`} />
							<Label htmlFor={`${item.id}-sim`}>Sim</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="nao" id={`${item.id}-nao`} />
							<Label htmlFor={`${item.id}-nao`}>Não</Label>
						</div>
					</RadioGroup>
					{item.resposta === "nao" ? (
						<div className="space-y-2">
							<Label htmlFor={`${item.id}-observacao`}>Observação</Label>
							<Textarea
								id={`${item.id}-observacao`}
								value={item.observacao ?? ""}
								onChange={(event) =>
									updateItem(item.id, { observacao: event.target.value })
								}
								placeholder="Descreva a não conformidade"
								disabled={disabled}
							/>
						</div>
					) : null}
				</div>
			))}
		</div>
	);
}
