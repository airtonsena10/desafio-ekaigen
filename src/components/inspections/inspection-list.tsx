"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { InspectionDetailModal } from "@/components/inspections/inspection-detail-modal";
import { SearchFilters } from "@/components/inspections/search-filters";
import { StatusBadge } from "@/components/inspections/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { InspectionStatus } from "@/domain/inspection.types";
import {
	filterInspections,
	validateCreateInspectionInput,
} from "@/domain/inspection.validation";
import { useInspections } from "@/providers/inspection-provider";

interface CreateInspectionDialogProps {
	onCreated: (id: string) => void;
}

function CreateInspectionForm({ onCreated }: CreateInspectionDialogProps) {
	const { createNewInspection } = useInspections();
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState({
		equipamento: "",
		setor: "",
		responsavel: "",
		data: new Date().toISOString().slice(0, 10),
	});

	const handleSubmit = async () => {
		const validationError = validateCreateInspectionInput(form);
		if (validationError) {
			toast.error(validationError);
			return;
		}

		setSubmitting(true);
		const result = await createNewInspection(form);
		setSubmitting(false);

		if (!result.ok) {
			toast.error(result.error);
			return;
		}

		toast.success("Inspeção criada.");
		onCreated(result.value.id);
		setForm({
			equipamento: "",
			setor: "",
			responsavel: "",
			data: new Date().toISOString().slice(0, 10),
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Nova inspeção</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-3 md:grid-cols-2">
				<input
					className="rounded-md border px-3 py-2"
					placeholder="Equipamento"
					value={form.equipamento}
					onChange={(event) =>
						setForm((current) => ({
							...current,
							equipamento: event.target.value,
						}))
					}
				/>
				<input
					className="rounded-md border px-3 py-2"
					placeholder="Setor"
					value={form.setor}
					onChange={(event) =>
						setForm((current) => ({ ...current, setor: event.target.value }))
					}
				/>
				<input
					className="rounded-md border px-3 py-2"
					placeholder="Responsável"
					value={form.responsavel}
					onChange={(event) =>
						setForm((current) => ({
							...current,
							responsavel: event.target.value,
						}))
					}
				/>
				<input
					className="rounded-md border px-3 py-2"
					type="date"
					value={form.data}
					onChange={(event) =>
						setForm((current) => ({ ...current, data: event.target.value }))
					}
				/>
				<div className="md:col-span-2">
					<Button disabled={submitting} onClick={handleSubmit}>
						Criar inspeção
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export function InspectionListView() {
	const { inspections, loading, error, refresh, selectedId, setSelectedId } =
		useInspections();
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState<InspectionStatus | "all">("all");

	const filteredInspections = useMemo(
		() => filterInspections(inspections, query, status),
		[inspections, query, status],
	);

	const selectedInspection =
		filteredInspections.find((inspection) => inspection.id === selectedId) ??
		inspections.find((inspection) => inspection.id === selectedId) ??
		null;

	return (
		<div className="space-y-6">
			<CreateInspectionForm onCreated={setSelectedId} />

			<SearchFilters
				query={query}
				status={status}
				onQueryChange={setQuery}
				onStatusChange={setStatus}
			/>

			{loading ? (
				<div className="space-y-3">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
			) : null}

			{error ? (
				<Card>
					<CardContent className="flex flex-col gap-3 py-6">
						<p className="text-sm text-rose-600">{error}</p>
						<Button onClick={() => void refresh()} variant="outline">
							Tentar novamente
						</Button>
					</CardContent>
				</Card>
			) : null}

			{!loading && !error && filteredInspections.length === 0 ? (
				<Card>
					<CardContent className="py-8 text-center text-sm text-muted-foreground">
						Nenhuma inspeção encontrada para os filtros atuais.
					</CardContent>
				</Card>
			) : null}

			<div className="hidden md:block">
				<Card>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Protocolo</TableHead>
									<TableHead>Equipamento</TableHead>
									<TableHead>Setor</TableHead>
									<TableHead>Responsável</TableHead>
									<TableHead>Data</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-center">Ações</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredInspections.map((inspection) => (
									<TableRow key={inspection.id}>
										<TableCell>{inspection.protocolo}</TableCell>
										<TableCell>{inspection.equipamento}</TableCell>
										<TableCell>{inspection.setor}</TableCell>
										<TableCell>{inspection.responsavel}</TableCell>
										<TableCell>{inspection.data}</TableCell>
										<TableCell>
											<StatusBadge status={inspection.status} />
										</TableCell>
										<TableCell className="text-center">
											<Button
												className="w-full"
												size="sm"
												variant="outline"
												onClick={() => setSelectedId(inspection.id)}
											>
												Detalhes
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-3 md:hidden">
				{filteredInspections.map((inspection) => (
					<Card key={inspection.id}>
						<CardContent className="space-y-3 py-4">
							<div className="flex items-start justify-between gap-3">
								<div>
									<p className="font-medium">{inspection.protocolo}</p>
									<p className="text-sm text-muted-foreground">
										{inspection.equipamento}
									</p>
								</div>
								<StatusBadge status={inspection.status} />
							</div>
							<p className="text-sm">
								{inspection.setor} • {inspection.responsavel}
							</p>
							<Button
								className="w-full"
								variant="outline"
								onClick={() => setSelectedId(inspection.id)}
							>
								Abrir detalhes
							</Button>
						</CardContent>
					</Card>
				))}
			</div>

			<InspectionDetailModal
				open={selectedId !== null}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedId(null);
					}
				}}
				inspection={selectedInspection}
			/>
		</div>
	);
}
