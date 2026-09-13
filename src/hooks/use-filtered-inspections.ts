"use client";

import { useMemo } from "react";
import { filterInspections } from "@/domain/inspection.queries";
import { useInspectionFilters } from "@/hooks/use-inspection-filters";
import { useInspections } from "@/providers/inspection-provider";

export function useFilteredInspections() {
	const { inspections } = useInspections();
	const { query, status, setQuery, setStatus } = useInspectionFilters();

	const filteredInspections = useMemo(
		() => filterInspections(inspections, query, status),
		[inspections, query, status],
	);

	return {
		query,
		status,
		setQuery,
		setStatus,
		filteredInspections,
	};
}
