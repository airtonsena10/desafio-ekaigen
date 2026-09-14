"use client";

import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";

export function AppShell({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-background bg-[radial-gradient(circle_at_top,oklch(0.62_0.14_250/0.1),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,oklch(0.42_0.12_250/0.2),transparent_42%)]">
			<AppHeader />
			<main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
		</div>
	);
}
