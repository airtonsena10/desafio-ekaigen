"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Inspection } from "@/domain/inspection.types";
import { formatInspectionDate } from "@/lib/format-date";

interface MetadataFieldProps {
	label: string;
	children: ReactNode;
}

function MetadataField({ label, children }: MetadataFieldProps) {
	return (
		<div className="space-y-1">
			<p className="text-xs text-muted-foreground">{label}</p>
			{children}
		</div>
	);
}

interface InspectionMetadataFieldsProps {
	inspection: Inspection;
	editable: boolean;
	submitting: boolean;
	showTitle: boolean;
	onFieldChange: <K extends keyof Inspection>(
		field: K,
		value: Inspection[K],
	) => void;
	onFieldBlur: () => void;
}

export function InspectionMetadataFields({
	inspection,
	editable,
	submitting,
	showTitle,
	onFieldChange,
	onFieldBlur,
}: InspectionMetadataFieldsProps) {
	if (editable) {
		return (
			<div className="space-y-4">
				<div className="space-y-1.5">
					<Label
						htmlFor="equipamento"
						className="text-xs text-muted-foreground"
					>
						Equipamento
					</Label>
					<Input
						id="equipamento"
						name="equipamento"
						value={inspection.equipamento}
						onChange={(event) =>
							onFieldChange("equipamento", event.target.value)
						}
						onBlur={onFieldBlur}
						disabled={submitting}
						className="h-auto border-0 bg-transparent px-0 text-xl font-semibold shadow-none focus-visible:ring-0"
					/>
				</div>
				<div className="grid gap-4 sm:grid-cols-3">
					<MetadataField label="Setor">
						<Input
							id="setor"
							name="setor"
							value={inspection.setor}
							onChange={(event) => onFieldChange("setor", event.target.value)}
							onBlur={onFieldBlur}
							disabled={submitting}
							className="min-h-10"
						/>
					</MetadataField>
					<MetadataField label="Data">
						<Input
							id="data"
							name="data"
							type="date"
							value={inspection.data}
							onChange={(event) => onFieldChange("data", event.target.value)}
							onBlur={onFieldBlur}
							disabled={submitting}
							className="min-h-10"
						/>
					</MetadataField>
					<MetadataField label="Responsável">
						<Input
							id="responsavel"
							name="responsavel"
							value={inspection.responsavel}
							onChange={(event) =>
								onFieldChange("responsavel", event.target.value)
							}
							onBlur={onFieldBlur}
							disabled={submitting}
							className="min-h-10"
						/>
					</MetadataField>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{showTitle ? (
				<h1 className="text-xl font-semibold tracking-tight">
					{inspection.equipamento}
				</h1>
			) : null}
			<dl className="grid grid-cols-3 gap-3 text-sm">
				<div>
					<dt className="text-xs text-muted-foreground">Setor</dt>
					<dd className="mt-0.5 font-medium">{inspection.setor}</dd>
				</div>
				<div>
					<dt className="text-xs text-muted-foreground">Data</dt>
					<dd className="mt-0.5 font-medium">
						{formatInspectionDate(inspection.data)}
					</dd>
				</div>
				<div>
					<dt className="text-xs text-muted-foreground">Responsável</dt>
					<dd className="mt-0.5 font-medium">{inspection.responsavel}</dd>
				</div>
			</dl>
		</div>
	);
}
