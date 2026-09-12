"use client";

import { InspectionKanbanView } from "@/components/inspections/inspection-kanban";
import { AppShell } from "@/components/layout/app-shell";

export default function InspectionsKanbanPage() {
	return (
		<AppShell>
			<InspectionKanbanView />
		</AppShell>
	);
}
