"use client";

import { ArrowUpRight, CalendarDays, MapPin, UserRound } from "lucide-react";
import { StatusBadge } from "@/components/inspections/status-badge";
import { STATUS_THEME } from "@/components/inspections/status-theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	type InspectionCardAction,
	type InspectionCardVariant,
	getInspectionCardActionLabel,
} from "@/domain/inspection.permissions";
import { formatInspectionDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import type { Inspection } from "@/types";

interface InspectionSummaryCardProps {
	inspection: Inspection;
	action?: InspectionCardAction;
	onOpen: (id: string) => void;
	className?: string;
	variant?: InspectionCardVariant;
}

export function InspectionSummaryCard({
	inspection,
	action = "open",
	onOpen,
	className,
	variant = "list",
}: InspectionSummaryCardProps) {
	const theme = STATUS_THEME[inspection.status];
	const formattedDate = formatInspectionDate(inspection.data);
	const actionLabel = getInspectionCardActionLabel(action, variant);
	const isReviewAction = action === "review";

	return (
		<Card
			className={cn(
				"group cursor-pointer overflow-hidden border bg-card shadow-sm transition-all duration-200",
				"hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				className,
			)}
			onClick={() => onOpen(inspection.id)}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onOpen(inspection.id);
				}
			}}
			role="button"
			tabIndex={0}
			aria-label={`Inspeção ${inspection.protocolo}, ${inspection.equipamento}, status ${inspection.status}`}
		>
			{variant === "list" ? (
				<div className={cn("h-1 w-full", theme.accent)} />
			) : null}
			<CardContent
				className={cn("space-y-3", variant === "kanban" ? "p-3.5" : "p-4")}
			>
				<div className="flex items-start justify-between gap-2">
					<StatusBadge status={inspection.status} />
					<time
						dateTime={inspection.data}
						className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
					>
						<CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
						{formattedDate}
					</time>
				</div>

				<div className="space-y-1">
					<p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
						{inspection.protocolo}
					</p>
					<h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight">
						{inspection.equipamento}
					</h3>
				</div>

				<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
					<span className="inline-flex min-w-0 items-center gap-1.5">
						<MapPin className="size-3.5 shrink-0" aria-hidden="true" />
						<span className="truncate">{inspection.setor}</span>
					</span>
					<span
						className="hidden text-muted-foreground/50 sm:inline"
						aria-hidden="true"
					>
						•
					</span>
					<span className="inline-flex min-w-0 items-center gap-1.5">
						<UserRound className="size-3.5 shrink-0" aria-hidden="true" />
						<span className="truncate">{inspection.responsavel}</span>
					</span>
				</div>

				<Button
					className={cn(
						"w-full gap-2 font-semibold",
						variant === "kanban" ? "min-h-10" : "",
						isReviewAction &&
							"bg-sky-600 text-white shadow-sm hover:bg-sky-700 focus-visible:ring-sky-400",
					)}
					size="sm"
					variant={isReviewAction ? "default" : "secondary"}
					onClick={(event) => {
						event.stopPropagation();
						onOpen(inspection.id);
					}}
				>
					{actionLabel}
					<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				</Button>
			</CardContent>
		</Card>
	);
}
