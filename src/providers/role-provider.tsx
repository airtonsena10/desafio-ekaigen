"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { UserRole } from "@/domain/inspection.types";

interface RoleContextValue {
	role: UserRole;
	setRole: (role: UserRole) => void;
	toggleRole: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
	const [role, setRole] = useState<UserRole>("inspetor");

	const toggleRole = useCallback(() => {
		setRole((currentRole) =>
			currentRole === "inspetor" ? "revisor" : "inspetor",
		);
	}, []);

	const value = useMemo(
		() => ({
			role,
			setRole,
			toggleRole,
		}),
		[role, toggleRole],
	);

	return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
	const context = useContext(RoleContext);
	if (!context) {
		throw new Error("useRole deve ser usado dentro de RoleProvider.");
	}
	return context;
}
