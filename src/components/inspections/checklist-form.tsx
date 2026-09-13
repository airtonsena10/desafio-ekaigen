"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { countAnsweredChecklistItems } from "@/domain/inspection.permissions";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "@/types";

interface ChecklistFormProps {
	items: ChecklistItem[];
	disabled?: boolean;
	onChange: (items: ChecklistItem[]) => void;
	onAutoSave?: () => void;
}

function ChoiceButton({
	selected,
	positive,
	label,
	disabled,
	onClick,
}: {
	selected: boolean;
	positive: boolean;
	label: string;
	disabled?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			disabled={disabled}
			aria-pressed={selected}
			onClick={onClick}
			className={cn(
				"inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-all",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				"disabled:cursor-not-allowed disabled:opacity-50",
				selected &&
					positive &&
					"border-emerald-600 bg-emerald-50 text-emerald-900",
				selected && !positive && "border-rose-600 bg-rose-50 text-rose-900",
				!selected &&
					"border-border bg-background text-muted-foreground hover:bg-muted/50",
			)}
		>
			{positive ? (
				<CheckCircle2 className="size-4" aria-hidden="true" />
			) : (
				<XCircle className="size-4" aria-hidden="true" />
			)}
			{label}
		</button>
	);
}

function ReadOnlyAnswer({ item }: { item: ChecklistItem }) {
	if (!item.resposta) {
		return <p className="text-sm text-muted-foreground">Não respondida</p>;
	}

	const isPositive = item.resposta === "sim";

	return (
		<div className="space-y-2">
			<span
				className={cn(
					"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
					isPositive
						? "bg-emerald-100 text-emerald-800"
						: "bg-rose-100 text-rose-800",
				)}
			>
				{isPositive ? (
					<CheckCircle2 className="size-3.5" aria-hidden="true" />
				) : (
					<XCircle className="size-3.5" aria-hidden="true" />
				)}
				{isPositive ? "Sim" : "Não"}
			</span>
			{item.observacao ? (
				<p className="text-sm text-muted-foreground">{item.observacao}</p>
			) : null}
		</div>
	);
}

export function ChecklistForm({
	items,
	disabled = false,
	onChange,
	onAutoSave,
}: ChecklistFormProps) {
	const answeredCount = countAnsweredChecklistItems(items);
	const progress = items.length > 0 ? (answeredCount / items.length) * 100 : 0;

	const updateItem = (
		id: ChecklistItem["id"],
		changes: Partial<ChecklistItem>,
		options?: { autoSave?: boolean },
	) => {
		onChange(
			items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
		);

		if (options?.autoSave) {
			onAutoSave?.();
		}
	};

	return (
		<div className="space-y-5">
			<div className="space-y-2">
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span>Progresso</span>
					<span className="tabular-nums">
						{answeredCount}/{items.length}
					</span>
				</div>
				<div className="h-1.5 overflow-hidden rounded-full bg-muted">
					<div
						className="h-full rounded-full bg-emerald-500 transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			<div className="divide-y">
				{items.map((item, index) => (
					<article
						key={item.id}
						className="space-y-3 py-4 first:pt-0 last:pb-0"
					>
						<div className="flex gap-3">
							<span
								className={cn(
									"flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
									item.resposta
										? "bg-emerald-100 text-emerald-800"
										: "bg-muted text-muted-foreground",
								)}
							>
								{index + 1}
							</span>
							<h4 className="min-w-0 flex-1 text-sm font-medium leading-snug">
								{item.pergunta}
							</h4>
						</div>

						<div className="pl-9">
							{disabled ? (
								<ReadOnlyAnswer item={item} />
							) : (
								<div className="space-y-3">
									<div className="grid grid-cols-2 gap-2">
										<ChoiceButton
											selected={item.resposta === "sim"}
											positive
											label="Sim"
											disabled={disabled}
											onClick={() =>
												updateItem(
													item.id,
													{
														resposta: "sim",
														observacao: undefined,
													},
													{ autoSave: true },
												)
											}
										/>
										<ChoiceButton
											selected={item.resposta === "nao"}
											positive={false}
											label="Não"
											disabled={disabled}
											onClick={() =>
												updateItem(
													item.id,
													{ resposta: "nao" },
													{ autoSave: true },
												)
											}
										/>
									</div>

									{item.resposta === "nao" ? (
										<div className="space-y-2 animate-fade-up">
											<Label htmlFor={`${item.id}-observacao`}>
												Observação
											</Label>
											<Textarea
												id={`${item.id}-observacao`}
												value={item.observacao ?? ""}
												onChange={(event) =>
													updateItem(item.id, {
														observacao: event.target.value,
													})
												}
												onBlur={() => onAutoSave?.()}
												placeholder="Descreva o que foi encontrado..."
												className="min-h-20 text-base sm:text-sm"
											/>
										</div>
									) : null}
								</div>
							)}
						</div>
					</article>
				))}
			</div>
		</div>
	);
}
