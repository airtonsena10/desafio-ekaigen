import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InspectionCardsSkeletonProps {
	count?: number;
	className?: string;
}

function InspectionCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-xl border bg-card shadow-sm">
			<Skeleton className="skeleton-shimmer h-1 w-full rounded-none" />
			<div className="space-y-4 p-4">
				<div className="flex items-start justify-between gap-3">
					<Skeleton className="skeleton-shimmer h-6 w-28 rounded-full" />
					<Skeleton className="skeleton-shimmer h-4 w-20" />
				</div>
				<div className="space-y-2">
					<Skeleton className="skeleton-shimmer h-3 w-32" />
					<Skeleton className="skeleton-shimmer h-6 w-4/5" />
				</div>
				<div className="space-y-2">
					<Skeleton className="skeleton-shimmer h-4 w-full" />
					<Skeleton className="skeleton-shimmer h-4 w-3/4" />
				</div>
				<Skeleton className="skeleton-shimmer h-9 w-full rounded-md" />
			</div>
		</div>
	);
}

export function InspectionCardsSkeleton({
	count = 3,
	className,
}: InspectionCardsSkeletonProps) {
	return (
		<div
			className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}
			aria-busy="true"
			aria-label="Carregando inspeções"
		>
			{Array.from({ length: count }).map((_, index) => (
				<InspectionCardSkeleton key={index} />
			))}
		</div>
	);
}

export function KanbanColumnsSkeleton() {
	return (
		<div
			className="flex gap-4 overflow-x-auto pb-2 xl:grid xl:grid-cols-4 xl:overflow-visible"
			aria-busy="true"
			aria-label="Carregando kanban"
		>
			{Array.from({ length: 4 }).map((_, index) => (
				<div
					key={index}
					className="min-w-[280px] shrink-0 overflow-hidden rounded-xl border bg-card xl:min-w-0"
				>
					<Skeleton className="skeleton-shimmer h-12 w-full rounded-none" />
					<div className="space-y-3 p-3">
						<Skeleton className="skeleton-shimmer h-40 w-full rounded-xl" />
						<Skeleton className="skeleton-shimmer h-40 w-full rounded-xl" />
					</div>
				</div>
			))}
		</div>
	);
}
