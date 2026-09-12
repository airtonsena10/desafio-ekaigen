"use client";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { InspectionStatus } from "@/domain/inspection.types";
import { INSPECTION_STATUSES, STATUS_LABELS } from "@/domain/inspection.types";

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
		<div className="grid gap-3 md:grid-cols-[1fr_220px]">
			<Input
				placeholder="Buscar por protocolo, equipamento, setor ou responsável"
				value={query}
				onChange={(event) => onQueryChange(event.target.value)}
				aria-label="Buscar inspeções"
			/>
			<Select
				value={status}
				onValueChange={(value) =>
					onStatusChange(value as InspectionStatus | "all")
				}
			>
				<SelectTrigger aria-label="Filtrar por status">
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
	);
}
