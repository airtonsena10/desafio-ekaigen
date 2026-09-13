import type { HistoryEntry } from "@/types/inspection.types";
import { cn } from "@/lib/utils";

export function HistoryTimeline({ entries }: { entries: HistoryEntry[] }) {
	const sortedEntries = [...entries].sort(
		(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
	);

	if (sortedEntries.length === 0) {
		return (
			<p className="py-4 text-center text-sm text-muted-foreground">
				Nenhum histórico registrado.
			</p>
		);
	}

	return (
		<div className="relative space-y-0">
			{sortedEntries.map((entry, index) => (
				<div key={entry.id} className="relative flex gap-3 pb-5 last:pb-0">
					<div className="flex flex-col items-center">
						<span
							className={cn(
								"mt-1.5 size-2 shrink-0 rounded-full",
								index === 0 ? "bg-primary" : "bg-muted-foreground/40",
							)}
						/>
						{index < sortedEntries.length - 1 ? (
							<span className="mt-1 w-px flex-1 bg-border" />
						) : null}
					</div>

					<div className="min-w-0 flex-1 space-y-1 pb-1">
						<div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
							<p className="text-sm font-medium">{entry.acao}</p>
							<time className="text-xs text-muted-foreground">
								{new Date(entry.timestamp).toLocaleString("pt-BR")}
							</time>
						</div>
						<p className="text-xs capitalize text-muted-foreground">
							{entry.papel}
						</p>
						{entry.detalhes ? (
							<p className="mt-1.5 rounded-md bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
								{entry.detalhes}
							</p>
						) : null}
					</div>
				</div>
			))}
		</div>
	);
}
