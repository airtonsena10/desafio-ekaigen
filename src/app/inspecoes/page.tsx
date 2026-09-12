"use client";

import { InspectionListView } from "@/components/inspections/inspection-list";
import { AppShell } from "@/components/layout/app-shell";

export default function InspectionsPage() {
	return (
		<AppShell>
			<InspectionListView />
		</AppShell>
	);
}
