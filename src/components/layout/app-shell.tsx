"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";

export function AppShell({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_42%),linear-gradient(to_bottom,_hsl(var(--background)),_hsl(var(--muted)/0.35))]">
			<AppHeader />
			<main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
		</div>
	);
}
