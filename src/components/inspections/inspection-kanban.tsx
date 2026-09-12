"use client";

import { useMemo, useState } from "react";
import { InspectionDetailModal } from "@/components/inspections/inspection-detail-modal";
import { SearchFilters } from "@/components/inspections/search-filters";
import { StatusBadge } from "@/components/inspections/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Inspection, InspectionStatus } from "@/domain/inspection.types";
import { INSPECTION_STATUSES, STATUS_LABELS } from "@/domain/inspection.types";
import { filterInspections } from "@/domain/inspection.validation";
import { useInspections } from "@/providers/inspection-provider";
import { useRole } from "@/providers/role-provider";

function KanbanCard({
	inspection,
	onOpen,
}: {
	inspection: Inspection;
	onOpen: (id: string) => void;
}) {
	const { role } = useRole();
	const actionLabel =
		role === "revisor" && inspection.status === "em_aprovacao" ? "Revisar" : "Abrir";

	return (
		<Card
			className="cursor-pointer shadow-sm transition-colors hover:bg-muted/40"
			onClick={() => onOpen(inspection.id)}
		>
			<CardContent className="space-y-3 py-4">
				<div className="flex items-start justify-between gap-2">
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
				<p className="text-xs text-muted-foreground">{inspection.data}</p>
				<Button
					className="w-full"
					size="sm"
					variant="outline"
					onClick={(event) => {
						event.stopPropagation();
						onOpen(inspection.id);
					}}
				>
					{actionLabel}
				</Button>
			</CardContent>
		</Card>
	);
}

export function InspectionKanbanView() {
	const { inspections, loading, error, refresh, selectedId, setSelectedId } =
		useInspections();
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState<InspectionStatus | "all">("all");

	const filteredInspections = useMemo(
		() => filterInspections(inspections, query, status),
		[inspections, query, status],
	);

	const grouped = useMemo(() => {
		return INSPECTION_STATUSES.reduce(
			(groups, item) => {
				groups[item] = filteredInspections.filter(
					(inspection) => inspection.status === item,
				);
				return groups;
			},
			{} as Record<InspectionStatus, Inspection[]>,
		);
	}, [filteredInspections]);

	const selectedInspection =
		inspections.find((inspection) => inspection.id === selectedId) ?? null;

	return (
		<div className="space-y-6">
			<SearchFilters
				query={query}
				status={status}
				onQueryChange={setQuery}
				onStatusChange={setStatus}
			/>

			{loading ? (
				<div className="grid gap-4 md:grid-cols-4">
					{INSPECTION_STATUSES.map((item) => (
						<Skeleton key={item} className="h-48 w-full" />
					))}
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

			<div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
				{INSPECTION_STATUSES.map((columnStatus) => (
					<Card key={columnStatus}>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center justify-between text-base">
								<span>{STATUS_LABELS[columnStatus]}</span>
								<span className="rounded-full bg-muted px-2 py-1 text-xs">
									{grouped[columnStatus].length}
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{grouped[columnStatus].length === 0 ? (
								<p className="text-sm text-muted-foreground">
									Sem itens nesta etapa.
								</p>
							) : (
								grouped[columnStatus].map((inspection) => (
									<KanbanCard
										key={inspection.id}
										inspection={inspection}
										onOpen={setSelectedId}
									/>
								))
							)}
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
