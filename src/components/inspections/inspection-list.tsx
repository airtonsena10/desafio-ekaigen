"use client";

import { CreateInspectionForm } from "@/components/inspections/create-inspection-form";
import { InspectionCardsSkeleton } from "@/components/inspections/inspection-cards-skeleton";
import { InspectionSummaryCard } from "@/components/inspections/inspection-summary-card";
import { InspectionViewShell } from "@/components/inspections/inspection-view-shell";
import { Card, CardContent } from "@/components/ui/card";
import { useInspectionModal } from "@/hooks/use-inspection-modal";

export function InspectionListView() {
	const {
		selectedInspection,
		modalOpen,
		openInspection,
		openInspectionById,
		handleModalOpenChange,
	} = useInspectionModal();

	return (
		<InspectionViewShell
			title="Lista de inspeções"
			description="Visualize todas as inspeções e abra os detalhes sem perder o contexto."
			loadingFallback={<InspectionCardsSkeleton count={6} />}
			selectedInspection={selectedInspection}
			modalOpen={modalOpen}
			onModalOpenChange={handleModalOpenChange}
			beforeToolbar={<CreateInspectionForm onCreated={openInspection} />}
		>
			{({ filteredInspections }) =>
				filteredInspections.length === 0 ? (
					<Card className="border-dashed">
						<CardContent className="py-12 text-center">
							<p className="text-base font-medium">Nenhuma inspeção encontrada</p>
							<p className="mt-1 text-sm text-muted-foreground">
								Ajuste os filtros ou crie uma nova inspeção acima.
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{filteredInspections.map((inspection, index) => (
							<div
								key={inspection.id}
								className="animate-fade-up"
								style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
							>
								<InspectionSummaryCard
									inspection={inspection}
									onOpen={openInspectionById}
								/>
							</div>
						))}
					</div>
				)
			}
		</InspectionViewShell>
	);
}
