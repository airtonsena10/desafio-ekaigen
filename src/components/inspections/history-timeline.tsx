import { Separator } from "@/components/ui/separator";
import type { HistoryEntry } from "@/domain/inspection.types";

export function HistoryTimeline({ entries }: { entries: HistoryEntry[] }) {
	const sortedEntries = [...entries].sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
	);

	if (sortedEntries.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				Nenhum histórico registrado.
			</p>
		);
	}

	return (
		<div className="space-y-4">
			{sortedEntries.map((entry, index) => (
				<div key={entry.id} className="space-y-2">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<p className="font-medium">{entry.acao}</p>
						<p className="text-xs text-muted-foreground">
							{new Date(entry.timestamp).toLocaleString("pt-BR")}
						</p>
					</div>
					<p className="text-sm text-muted-foreground capitalize">
						{entry.papel}
					</p>
					{entry.detalhes ? (
						<p className="rounded-md bg-muted px-3 py-2 text-sm">
							{entry.detalhes}
						</p>
					) : null}
					{index < sortedEntries.length - 1 ? <Separator /> : null}
				</div>
			))}
		</div>
	);
}
