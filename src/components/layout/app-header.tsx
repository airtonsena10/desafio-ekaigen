"use client";

import { ClipboardList, KanbanSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { SimulationPanel } from "@/components/dev/simulation-panel";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { StatusCounters } from "@/components/inspections/status-counters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useInspections } from "@/providers/inspection-provider";
import { useRole } from "@/providers/role-provider";

function StatusCountersFallback() {
	return (
		<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
			{Array.from({ length: 4 }).map((_, index) => (
				<Skeleton key={index} className="h-[4.75rem] rounded-xl" />
			))}
		</div>
	);
}

const NAV_ITEMS = [
	{ href: "/inspecoes", label: "Lista", icon: ClipboardList },
	{ href: "/inspecoes/kanban", label: "Kanban", icon: KanbanSquare },
];

export function AppHeader() {
	const pathname = usePathname();
	const { role, setRole } = useRole();
	const { inspections } = useInspections();

	return (
		<header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<p className="text-sm font-medium text-primary">
							Sistema de inspeções
						</p>
						<h1 className="text-2xl font-semibold tracking-tight">
							Controle de equipamentos
						</h1>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<ThemeToggle />
						<div className="inline-flex rounded-xl border bg-muted/40 p-1">
							<Button
								size="sm"
								variant={role === "inspetor" ? "default" : "ghost"}
								onClick={() => setRole("inspetor")}
							>
								Inspetor
							</Button>
							<Button
								size="sm"
								variant={role === "revisor" ? "default" : "ghost"}
								onClick={() => setRole("revisor")}
							>
								Revisor
							</Button>
						</div>
						<SimulationPanel />
					</div>
				</div>

				<div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
					<nav className="inline-flex w-fit shrink-0 rounded-xl border bg-muted/40 p-1">
						{NAV_ITEMS.map(({ href, label, icon: Icon }) => {
							const active = pathname === href;
							return (
								<Button
									key={href}
									asChild
									size="sm"
									variant={active ? "default" : "ghost"}
									className={cn("gap-2")}
								>
									<Link href={href}>
										<Icon className="size-4" />
										{label}
									</Link>
								</Button>
							);
						})}
					</nav>
					<div className="min-w-0 flex-1 xl:max-w-3xl">
						<Suspense fallback={<StatusCountersFallback />}>
							<StatusCounters inspections={inspections} />
						</Suspense>
					</div>
				</div>
			</div>
		</header>
	);
}
