"use client";

import type { ReactNode } from "react";
import { InspectionDetailModal } from "@/components/inspections/inspection-detail-modal";
import { InspectionViewToolbar } from "@/components/inspections/inspection-view-toolbar";
import { NetworkErrorState } from "@/components/inspections/network-error-state";
import { SearchFilters } from "@/components/inspections/search-filters";
import { useFilteredInspections } from "@/hooks/use-filtered-inspections";
import { useInspections } from "@/providers/inspection-provider";
import type { Inspection, InspectionStatus } from "@/types";

export interface InspectionViewFilters {
	filteredInspections: Inspection[];
	query: string;
	status: InspectionStatus | "all";
	setQuery: (value: string) => void;
	setStatus: (value: InspectionStatus | "all") => void;
}

interface InspectionViewShellProps {
	title: string;
	description: string;
	loadingFallback: ReactNode;
	selectedInspection: Inspection | null;
	modalOpen: boolean;
	onModalOpenChange: (open: boolean) => void;
	beforeToolbar?: ReactNode;
	children: (filters: InspectionViewFilters) => ReactNode;
}

export function InspectionViewShell({
	title,
	description,
	loadingFallback,
	selectedInspection,
	modalOpen,
	onModalOpenChange,
	beforeToolbar,
	children,
}: InspectionViewShellProps) {
	const { loading, refreshing, error, refresh } = useInspections();
	const filters = useFilteredInspections();

	return (
		<div className="space-y-5">
			{beforeToolbar}

			<InspectionViewToolbar
				title={title}
				description={description}
				count={filters.filteredInspections.length}
			>
				<SearchFilters
					query={filters.query}
					status={filters.status}
					onQueryChange={filters.setQuery}
					onStatusChange={filters.setStatus}
				/>
			</InspectionViewToolbar>

			{loading ? loadingFallback : null}

			{error ? (
				<NetworkErrorState
					message={error}
					onRetry={refresh}
					retrying={refreshing}
				/>
			) : null}

			{!loading && !error ? children(filters) : null}

			<InspectionDetailModal
				open={modalOpen}
				onOpenChange={onModalOpenChange}
				inspection={selectedInspection}
			/>
		</div>
	);
}
