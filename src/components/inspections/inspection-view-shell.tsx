"use client";

import type { ReactNode } from "react";
import { InspectionDetailModal } from "@/components/inspections/inspection-detail-modal";
import { InspectionViewToolbar } from "@/components/inspections/inspection-view-toolbar";
import { NetworkErrorState } from "@/components/inspections/network-error-state";
import { SearchFilters } from "@/components/inspections/search-filters";
import type { Inspection } from "@/domain/inspection.types";
import { useFilteredInspections } from "@/hooks/use-filtered-inspections";
import { useInspections } from "@/providers/inspection-provider";

interface InspectionViewShellProps {
	title: string;
	description: string;
	count: number;
	loadingFallback: ReactNode;
	selectedInspection: Inspection | null;
	modalOpen: boolean;
	onModalOpenChange: (open: boolean) => void;
	beforeToolbar?: ReactNode;
	children: ReactNode;
}

export function InspectionViewShell({
	title,
	description,
	count,
	loadingFallback,
	selectedInspection,
	modalOpen,
	onModalOpenChange,
	beforeToolbar,
	children,
}: InspectionViewShellProps) {
	const { loading, refreshing, error, refresh } = useInspections();
	const { query, status, setQuery, setStatus } = useFilteredInspections();

	return (
		<div className="space-y-5">
			{beforeToolbar}

			<InspectionViewToolbar
				title={title}
				description={description}
				count={count}
			>
				<SearchFilters
					query={query}
					status={status}
					onQueryChange={setQuery}
					onStatusChange={setStatus}
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

			{!loading && !error ? children : null}

			<InspectionDetailModal
				open={modalOpen}
				onOpenChange={onModalOpenChange}
				inspection={selectedInspection}
			/>
		</div>
	);
}
