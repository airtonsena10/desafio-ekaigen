"use client";

import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	INSPECTION_STATUSES,
	STATUS_LABELS,
} from "@/domain/inspection.constants";
import { parseInspectionFilterStatus } from "@/domain/inspection.queries";
import type { InspectionStatus } from "@/types";

interface SearchFiltersProps {
	query: string;
	status: InspectionStatus | "all";
	onQueryChange: (value: string) => void;
	onStatusChange: (value: InspectionStatus | "all") => void;
}

export function SearchFilters({
	query,
	status,
	onQueryChange,
	onStatusChange,
}: SearchFiltersProps) {
	return (
		<div className="grid gap-3 md:grid-cols-[1fr_240px]">
			<div className="relative">
				<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					className="pl-9"
					placeholder="Buscar protocolo, equipamento, setor ou responsável"
					value={query}
					onChange={(event) => onQueryChange(event.target.value)}
					aria-label="Buscar inspeções"
				/>
			</div>
			<div className="relative">
				<Filter className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
				<Select
					value={status}
					onValueChange={(value) =>
						onStatusChange(parseInspectionFilterStatus(value))
					}
				>
					<SelectTrigger className="pl-9" aria-label="Filtrar por status">
						<SelectValue placeholder="Filtrar status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todos os status</SelectItem>
						{INSPECTION_STATUSES.map((item) => (
							<SelectItem key={item} value={item}>
								{STATUS_LABELS[item]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
