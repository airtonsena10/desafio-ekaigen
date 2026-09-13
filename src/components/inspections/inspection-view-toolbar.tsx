import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface InspectionViewToolbarProps {
	title: string;
	description: string;
	count: number;
	children: ReactNode;
}

export function InspectionViewToolbar({
	title,
	description,
	count,
	children,
}: InspectionViewToolbarProps) {
	return (
		<Card className="border bg-card/80 shadow-sm backdrop-blur">
			<CardContent className="space-y-4 p-4 md:p-5">
				<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
					<div>
						<h2 className="text-lg font-semibold">{title}</h2>
						<p className="text-sm text-muted-foreground">{description}</p>
					</div>
					<div className="inline-flex w-fit items-center rounded-full border bg-muted/50 px-3 py-1 text-sm">
						<span className="text-muted-foreground">Exibindo</span>
						<span className="ml-2 font-semibold">{count}</span>
					</div>
				</div>
				{children}
			</CardContent>
		</Card>
	);
}
