import { cn } from "@/lib/utils";

export function RefreshIndicator({ visible }: { visible: boolean }) {
	return (
		<div
			className={cn(
				"pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-transparent transition-opacity duration-300",
				visible ? "opacity-100" : "opacity-0",
			)}
			aria-hidden={!visible}
		>
			<div className="animate-progress-indeterminate h-full w-1/3 bg-primary/80" />
		</div>
	);
}
