"use client";

import { Suspense } from "react";
import { InspectionListView } from "@/components/inspections/inspection-list";
import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

function InspectionListFallback() {
	return (
		<div className="space-y-5">
			<Skeleton className="h-48 w-full rounded-xl" />
			<Skeleton className="h-40 w-full rounded-xl" />
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<Skeleton className="h-56 w-full rounded-xl" />
				<Skeleton className="h-56 w-full rounded-xl" />
				<Skeleton className="h-56 w-full rounded-xl" />
			</div>
		</div>
	);
}

export default function InspectionsPage() {
	return (
		<AppShell>
			<Suspense fallback={<InspectionListFallback />}>
				<InspectionListView />
			</Suspense>
		</AppShell>
	);
}
