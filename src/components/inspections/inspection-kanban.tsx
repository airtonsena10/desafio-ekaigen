"use client";

import { useEffect, useMemo, useState } from "react";
import { KanbanColumnsSkeleton } from "@/components/inspections/inspection-cards-skeleton";
import { InspectionSummaryCard } from "@/components/inspections/inspection-summary-card";
import {
	InspectionViewShell,
	type InspectionViewFilters,
} from "@/components/inspections/inspection-view-shell";
import { STATUS_THEME } from "@/components/inspections/status-theme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	INSPECTION_STATUSES,
	STATUS_LABELS,
} from "@/domain/inspection.constants";
import { getInspectionCardAction } from "@/domain/inspection.permissions";
import {
	groupInspectionsByStatus,
	parseInspectionStatus,
} from "@/domain/inspection.queries";
import { useInspectionModal } from "@/hooks/use-inspection-modal";
import { cn } from "@/lib/utils";
import { useRole } from "@/providers/role-provider";
import type { Inspection, InspectionStatus } from "@/types";

function KanbanCard({
	inspection,
	onOpen,
}: {
	inspection: Inspection;
	onOpen: (id: string) => void;
}) {
	const { role } = useRole();
	const action = getInspectionCardAction(inspection, role);

	return (
		<InspectionSummaryCard
			inspection={inspection}
			action={action}
			onOpen={onOpen}
			variant="kanban"
			className="hover:translate-y-0"
		/>
	);
}

function KanbanColumn({
	columnStatus,
	items,
	onOpen,
}: {
	columnStatus: InspectionStatus;
	items: Inspection[];
	onOpen: (id: string) => void;
}) {
	const theme = STATUS_THEME[columnStatus];

	return (
		<Card
			className={cn(
				"min-w-[280px] shrink-0 overflow-hidden border shadow-sm xl:min-w-0",
				theme.column,
			)}
		>
			<CardHeader className="border-b border-black/5 pb-3">
				<CardTitle className="flex items-center justify-between text-base">
					<span className={cn("flex items-center gap-2", theme.label)}>
						<span className={cn("size-2.5 rounded-full", theme.dot)} />
						{STATUS_LABELS[columnStatus]}
					</span>
					<span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold tabular-nums text-foreground shadow-sm">
						{items.length}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3 p-3">
				{items.length === 0 ? (
					<div className="rounded-xl border border-dashed bg-background/70 px-3 py-10 text-center text-sm text-muted-foreground">
						Sem itens nesta etapa
					</div>
				) : (
					items.map((inspection, index) => (
						<div
							key={inspection.id}
							className="animate-fade-up"
							style={{ animationDelay: `${index * 40}ms` }}
						>
							<KanbanCard inspection={inspection} onOpen={onOpen} />
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
}

function KanbanBoard({
	filters,
	onOpen,
}: {
	filters: InspectionViewFilters;
	onOpen: (id: string) => void;
}) {
	const { filteredInspections, status, setStatus } = filters;
	const grouped = useMemo(
		() => groupInspectionsByStatus(filteredInspections),
		[filteredInspections],
	);
	const [mobileTab, setMobileTab] =
		useState<InspectionStatus>("em_preenchimento");

	useEffect(() => {
		if (status !== "all") {
			setMobileTab(status);
		}
	}, [status]);

	return (
		<>
			<div className="xl:hidden">
				<Tabs
					value={mobileTab}
					onValueChange={(value) => {
						const nextStatus = parseInspectionStatus(value);
						if (!nextStatus) {
							return;
						}

						setMobileTab(nextStatus);
						if (status !== "all") {
							setStatus(nextStatus);
						}
					}}
				>
					<TabsList className="scrollbar-thin h-auto w-full justify-start overflow-x-auto p-1">
						{INSPECTION_STATUSES.map((columnStatus) => {
							const theme = STATUS_THEME[columnStatus];
							return (
								<TabsTrigger
									key={columnStatus}
									value={columnStatus}
									className="min-h-10 shrink-0 gap-2 px-3"
								>
									<span className={cn("size-2 rounded-full", theme.dot)} />
									{STATUS_LABELS[columnStatus]}
									<span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] tabular-nums">
										{grouped[columnStatus].length}
									</span>
								</TabsTrigger>
							);
						})}
					</TabsList>

					{INSPECTION_STATUSES.map((columnStatus) => (
						<TabsContent
							key={columnStatus}
							value={columnStatus}
							className="mt-4"
						>
							<div className="space-y-3">
								{grouped[columnStatus].length === 0 ? (
									<div className="rounded-xl border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
										Nenhuma inspeção em{" "}
										{STATUS_LABELS[columnStatus].toLowerCase()}
									</div>
								) : (
									grouped[columnStatus].map((inspection, index) => (
										<div
											key={inspection.id}
											className="animate-fade-up"
											style={{ animationDelay: `${index * 40}ms` }}
										>
											<KanbanCard inspection={inspection} onOpen={onOpen} />
										</div>
									))
								)}
							</div>
						</TabsContent>
					))}
				</Tabs>
			</div>

			<div className="hidden snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-thin xl:grid xl:grid-cols-4 xl:overflow-visible xl:snap-none">
				{INSPECTION_STATUSES.map((columnStatus) => (
					<div key={columnStatus} className="snap-center xl:snap-align-none">
						<KanbanColumn
							columnStatus={columnStatus}
							items={grouped[columnStatus]}
							onOpen={onOpen}
						/>
					</div>
				))}
			</div>
		</>
	);
}

export function InspectionKanbanView() {
	const {
		selectedInspection,
		modalOpen,
		openInspectionById,
		handleModalOpenChange,
	} = useInspectionModal();

	return (
		<InspectionViewShell
			title="Kanban de inspeções"
			description="Acompanhe cada etapa do fluxo com cards organizados por status."
			loadingFallback={<KanbanColumnsSkeleton />}
			selectedInspection={selectedInspection}
			modalOpen={modalOpen}
			onModalOpenChange={handleModalOpenChange}
		>
			{(filters) => (
				<KanbanBoard filters={filters} onOpen={openInspectionById} />
			)}
		</InspectionViewShell>
	);
}
