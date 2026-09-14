"use client";

import type { ReactNode } from "react";
import { RefreshIndicator } from "@/components/inspections/refresh-indicator";
import { Toaster } from "@/components/ui/sonner";
import {
	InspectionProvider,
	useInspections,
} from "@/providers/inspection-provider";
import { RoleProvider } from "@/providers/role-provider";
import { ThemeProvider } from "@/providers/theme-provider";

function GlobalRefreshIndicator() {
	const { refreshing } = useInspections();
	return <RefreshIndicator visible={refreshing} />;
}

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<RoleProvider>
				<InspectionProvider>
					<GlobalRefreshIndicator />
					{children}
					<Toaster richColors closeButton position="top-right" />
				</InspectionProvider>
			</RoleProvider>
		</ThemeProvider>
	);
}
