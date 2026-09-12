"use client";

import { ClipboardList, KanbanSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SimulationPanel } from "@/components/dev/simulation-panel";
import { StatusCounters } from "@/components/inspections/status-counters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInspections } from "@/providers/inspection-provider";
import { useRole } from "@/providers/role-provider";

const NAV_ITEMS = [
	{ href: "/inspecoes", label: "Lista", icon: ClipboardList },
	{ href: "/inspecoes/kanban", label: "Kanban", icon: KanbanSquare },
];

export function AppHeader() {
	const pathname = usePathname();
	const { role, setRole } = useRole();
	const { inspections } = useInspections();

	return (
		<header className="border-b bg-background/95 backdrop-blur">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<p className="text-sm text-muted-foreground">
							Sistema de inspeções
						</p>
						<h1 className="text-2xl font-semibold">Controle de equipamentos</h1>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Button
							variant={role === "inspetor" ? "default" : "outline"}
							onClick={() => setRole("inspetor")}
						>
							Inspetor
						</Button>
						<Button
							variant={role === "revisor" ? "default" : "outline"}
							onClick={() => setRole("revisor")}
						>
							Revisor
						</Button>
						<SimulationPanel />
					</div>
				</div>

				<nav className="flex flex-wrap gap-2">
					{NAV_ITEMS.map(({ href, label, icon: Icon }) => {
						const active = pathname === href;
						return (
							<Button
								key={href}
								asChild
								variant={active ? "default" : "outline"}
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

				<StatusCounters inspections={inspections} />
			</div>
		</header>
	);
}
