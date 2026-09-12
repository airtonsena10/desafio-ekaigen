"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { InspectionProvider } from "@/providers/inspection-provider";
import { RoleProvider } from "@/providers/role-provider";

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<RoleProvider>
			<InspectionProvider>
				{children}
				<Toaster richColors closeButton position="top-right" />
			</InspectionProvider>
		</RoleProvider>
	);
}
