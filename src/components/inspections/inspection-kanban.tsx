"use client";

import {
	DndContext,
	DragOverlay,
	type DragEndEvent,
	type DragStartEvent,
	PointerSensor,
	TouchSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
	isInspectionStatus,
} from "@/domain/inspection.constants";
import {
	canDropInspectionOnStatus,
	resolveKanbanStatusMove,
} from "@/domain/inspection.kanban";
import { getInspectionCardAction } from "@/domain/inspection.permissions";
import {
	groupInspectionsByStatus,
	parseInspectionStatus,
} from "@/domain/inspection.queries";
import { useInspectionModal } from "@/hooks/use-inspection-modal";
import { cn } from "@/lib/utils";
import { useInspections } from "@/providers/inspection-provider";
import { useRole } from "@/providers/role-provider";
import type { Inspection, InspectionStatus } from "@/types";

function KanbanCard({
	inspection,
	onOpen,
	isDragOverlay = false,
	dragHandle,
}: {
	inspection: Inspection;
	onOpen: (id: string) => void;
	isDragOverlay?: boolean;
	dragHandle?: {
		listeners?: ReturnType<typeof useDraggable>["listeners"];
		attributes?: ReturnType<typeof useDraggable>["attributes"];
		label?: string;
	};
}) {
	const { role } = useRole();
	const action = getInspectionCardAction(inspection, role);

	return (
		<InspectionSummaryCard
			inspection={inspection}
			action={action}
			onOpen={onOpen}
			variant="kanban"
			dragHandle={dragHandle}
			className={cn(
				isDragOverlay && "rotate-1 shadow-lg ring-2 ring-primary/20",
				!isDragOverlay && "hover:translate-y-0",
			)}
		/>
	);
}

function DraggableKanbanCard({
	inspection,
	onOpen,
}: {
	inspection: Inspection;
	onOpen: (id: string) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: inspection.id,
			data: { inspection },
		});

	const style = transform
		? { transform: CSS.Translate.toString(transform) }
		: undefined;

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(isDragging && "z-10 opacity-40")}
		>
			<KanbanCard
				inspection={inspection}
				onOpen={onOpen}
				dragHandle={{
					listeners,
					attributes,
					label: `Arrastar inspeção ${inspection.protocolo}`,
				}}
			/>
		</div>
	);
}

function KanbanColumn({
	columnStatus,
	items,
	onOpen,
	activeInspection,
}: {
	columnStatus: InspectionStatus;
	items: Inspection[];
	onOpen: (id: string) => void;
	activeInspection: Inspection | null;
}) {
	const { role } = useRole();
	const theme = STATUS_THEME[columnStatus];
	const { setNodeRef, isOver } = useDroppable({ id: columnStatus });
	const acceptsDrop = activeInspection
		? canDropInspectionOnStatus(activeInspection, columnStatus, role)
		: false;

	return (
		<Card
			ref={setNodeRef}
			className={cn(
				"min-h-[420px] min-w-[280px] shrink-0 overflow-hidden border shadow-sm transition-all xl:min-w-0",
				theme.column,
				activeInspection && !acceptsDrop && "opacity-60",
				isOver &&
					acceptsDrop &&
					"ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
				isOver &&
					activeInspection &&
					!acceptsDrop &&
					"ring-2 ring-destructive/40 ring-offset-2 ring-offset-background",
			)}
		>
			<CardHeader className="border-b border-border/60 px-3 py-3">
				<CardTitle className="flex items-center justify-between gap-2 text-sm">
					<span
						className={cn(
							"flex min-w-0 items-center gap-2 truncate",
							theme.label,
						)}
					>
						<span className={cn("size-2.5 shrink-0 rounded-full", theme.dot)} />
						<span className="truncate">{STATUS_LABELS[columnStatus]}</span>
					</span>
					<span
						className={cn(
							"inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold tabular-nums shadow-sm",
							theme.badge,
						)}
					>
						{items.length}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3 p-3 pt-3">
				{items.length === 0 ? (
					<div
						className={cn(
							"rounded-xl border border-dashed bg-background/70 px-3 py-10 text-center text-sm text-muted-foreground transition-colors",
							isOver &&
								acceptsDrop &&
								"border-primary/40 bg-primary/5 text-foreground",
						)}
					>
						{isOver && acceptsDrop
							? "Solte aqui para mover"
							: "Sem itens nesta etapa"}
					</div>
				) : (
					items.map((inspection, index) => (
						<div
							key={inspection.id}
							className="animate-fade-up"
							style={{ animationDelay: `${index * 40}ms` }}
						>
							<DraggableKanbanCard inspection={inspection} onOpen={onOpen} />
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
	const { role } = useRole();
	const { executeAction } = useInspections();
	const { filteredInspections, status, setStatus } = filters;
	const grouped = useMemo(
		() => groupInspectionsByStatus(filteredInspections),
		[filteredInspections],
	);
	const [mobileTab, setMobileTab] =
		useState<InspectionStatus>("em_preenchimento");
	const [activeInspection, setActiveInspection] = useState<Inspection | null>(
		null,
	);
	const [moving, setMoving] = useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 200, tolerance: 6 },
		}),
	);

	useEffect(() => {
		if (status !== "all") {
			setMobileTab(status);
		}
	}, [status]);

	const handleDragStart = (event: DragStartEvent) => {
		const inspection = event.active.data.current?.inspection as
			| Inspection
			| undefined;
		setActiveInspection(inspection ?? null);
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const inspection = event.active.data.current?.inspection as
			| Inspection
			| undefined;
		setActiveInspection(null);

		if (!inspection || !event.over) {
			return;
		}

		const targetStatus = event.over.id;
		if (!isInspectionStatus(targetStatus)) {
			return;
		}

		const resolution = resolveKanbanStatusMove(
			inspection,
			targetStatus,
			role,
		);

		switch (resolution.type) {
			case "noop":
				return;
			case "invalid":
				toast.error(resolution.error);
				return;
			case "open_review":
				toast.message("Informe o motivo da reprovação para concluir.");
				onOpen(inspection.id);
				return;
			case "execute": {
				setMoving(true);
				const result = await executeAction(inspection.id, resolution.action);
				setMoving(false);

				if (result.ok) {
					toast.success("Inspeção movida com sucesso.");
					return;
				}

				toast.error(result.error);
			}
		}
	};

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragEnd={(event) => {
				void handleDragEnd(event);
			}}
		>
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

			<div
				className={cn(
					"hidden snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-thin xl:grid xl:grid-cols-4 xl:overflow-visible xl:snap-none",
					moving && "pointer-events-none opacity-80",
				)}
				aria-busy={moving}
			>
				{INSPECTION_STATUSES.map((columnStatus) => (
					<div key={columnStatus} className="snap-center xl:snap-align-none">
						<KanbanColumn
							columnStatus={columnStatus}
							items={grouped[columnStatus]}
							onOpen={onOpen}
							activeInspection={activeInspection}
						/>
					</div>
				))}
			</div>

			<DragOverlay dropAnimation={{ duration: 200, easing: "ease-out" }}>
				{activeInspection ? (
					<KanbanCard
						inspection={activeInspection}
						onOpen={onOpen}
						isDragOverlay
					/>
				) : null}
			</DragOverlay>
		</DndContext>
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
			description="No desktop, arraste os cards entre colunas para avançar no fluxo. Use o ícone de arrastar no canto do card."
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
