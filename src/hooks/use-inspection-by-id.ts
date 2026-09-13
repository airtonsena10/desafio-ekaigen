"use client";

import { useEffect, useState } from "react";
import type { Inspection } from "@/types/inspection.types";
import { useInspections } from "@/providers/inspection-provider";

interface UseInspectionByIdResult {
	inspection: Inspection | null;
	loading: boolean;
	error: string | null;
}

export function useInspectionById(id: string): UseInspectionByIdResult {
	const { inspections, loading, error, resolveInspection } = useInspections();
	const [inspection, setInspection] = useState<Inspection | null>(null);
	const [resolving, setResolving] = useState(true);
	const [resolveError, setResolveError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setResolving(true);
			setResolveError(null);

			const cached = inspections.find((item) => item.id === id);
			if (cached) {
				if (active) {
					setInspection(cached);
					setResolving(false);
				}
				return;
			}

			if (loading) {
				return;
			}

			const result = await resolveInspection(id);
			if (!active) {
				return;
			}

			if (!result.ok) {
				setInspection(null);
				setResolveError(result.error);
			} else {
				setInspection(result.value);
			}

			setResolving(false);
		};

		void load();

		return () => {
			active = false;
		};
	}, [id, inspections, loading, resolveInspection]);

	useEffect(() => {
		const cached = inspections.find((item) => item.id === id);
		if (cached) {
			setInspection(cached);
		}
	}, [id, inspections]);

	return {
		inspection,
		loading: loading || resolving,
		error: resolveError ?? error,
	};
}
