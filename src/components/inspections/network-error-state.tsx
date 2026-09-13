import { Loader2, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NetworkErrorStateProps {
	message: string;
	onRetry: () => void | Promise<void>;
	retrying?: boolean;
	className?: string;
}

export function NetworkErrorState({
	message,
	onRetry,
	retrying = false,
	className,
}: NetworkErrorStateProps) {
	return (
		<Card
			className={cn(
				"overflow-hidden border border-rose-200/80 bg-gradient-to-br from-rose-50/80 to-background shadow-sm",
				className,
			)}
		>
			<CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:text-left">
				<div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
					<WifiOff className="size-7" aria-hidden="true" />
				</div>
				<div className="min-w-0 flex-1 space-y-1">
					<p className="text-base font-semibold text-rose-950">
						Não foi possível carregar os dados
					</p>
					<p className="text-sm text-rose-800/80">{message}</p>
					<p className="text-xs text-muted-foreground">
						Verifique sua conexão ou tente novamente em instantes.
					</p>
				</div>
				<Button
					className="shrink-0 gap-2"
					disabled={retrying}
					onClick={() => void onRetry()}
					variant="outline"
				>
					{retrying ? (
						<Loader2 className="size-4 animate-spin" aria-hidden="true" />
					) : (
						<RefreshCw className="size-4" aria-hidden="true" />
					)}
					{retrying ? "Tentando..." : "Tentar novamente"}
				</Button>
			</CardContent>
		</Card>
	);
}
