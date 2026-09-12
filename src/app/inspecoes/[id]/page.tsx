"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InspectionDetail } from "@/components/inspections/inspection-detail";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Inspection } from "@/domain/inspection.types";
import { getInspection } from "@/services/inspection.repository";

export default function InspectionDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const [inspection, setInspection] = useState<Inspection | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await getInspection(params.id);
				if (!active) {
					return;
				}
				if (!data) {
					setError("Inspeção não encontrada.");
					setInspection(null);
				} else {
					setInspection(data);
				}
			} catch (loadError) {
				if (!active) {
					return;
				}
				setError(
					loadError instanceof Error
						? loadError.message
						: "Não foi possível carregar a inspeção.",
				);
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		};

		void load();
		return () => {
			active = false;
		};
	}, [params.id]);

	return (
		<AppShell>
			<div className="mb-4">
				<Button variant="outline" onClick={() => router.back()}>
					Voltar
				</Button>
			</div>
			{loading ? <Skeleton className="h-96 w-full" /> : null}
			{error ? <p className="text-sm text-rose-600">{error}</p> : null}
			{inspection ? <InspectionDetail inspection={inspection} /> : null}
		</AppShell>
	);
}
