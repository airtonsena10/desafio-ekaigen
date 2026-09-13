"use client";

import { useParams, useRouter } from "next/navigation";
import { InspectionDetail } from "@/components/inspections/inspection-detail";
import { NetworkErrorState } from "@/components/inspections/network-error-state";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInspectionById } from "@/hooks/use-inspection-by-id";
import { useInspections } from "@/providers/inspection-provider";

export default function InspectionDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const { refresh, refreshing } = useInspections();
	const { inspection, loading, error } = useInspectionById(params.id);

	return (
		<AppShell>
			<div className="mb-4">
				<Button variant="outline" onClick={() => router.back()}>
					Voltar
				</Button>
			</div>

			{loading ? <Skeleton className="h-96 w-full" /> : null}

			{error ? (
				<NetworkErrorState
					message={error}
					onRetry={refresh}
					retrying={refreshing}
				/>
			) : null}

			{!loading && !error && inspection ? (
				<InspectionDetail inspection={inspection} />
			) : null}
		</AppShell>
	);
}
