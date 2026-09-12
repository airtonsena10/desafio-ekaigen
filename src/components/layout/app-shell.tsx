"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";

export function AppShell({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-muted/30">
			<AppHeader />
			<main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
		</div>
	);
}
