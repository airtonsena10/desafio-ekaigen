"use client";

import { Suspense } from "react";
import { InspectionKanbanView } from "@/components/inspections/inspection-kanban";
import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

function InspectionKanbanFallback() {
	return (
		<div className="space-y-5">
			<Skeleton className="h-40 w-full rounded-xl" />
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<Skeleton className="h-96 w-full rounded-xl" />
				<Skeleton className="h-96 w-full rounded-xl" />
				<Skeleton className="h-96 w-full rounded-xl" />
				<Skeleton className="h-96 w-full rounded-xl" />
			</div>
		</div>
	);
}

export default function InspectionsKanbanPage() {
	return (
		<AppShell>
			<Suspense fallback={<InspectionKanbanFallback />}>
				<InspectionKanbanView />
			</Suspense>
		</AppShell>
	);
}
