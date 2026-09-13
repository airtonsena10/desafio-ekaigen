"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { InspectionStatus } from "@/domain/inspection.types";
import { INSPECTION_STATUSES } from "@/domain/inspection.types";

function parseStatus(value: string | null): InspectionStatus | "all" {
	if (!value) {
		return "all";
	}

	if (INSPECTION_STATUSES.includes(value as InspectionStatus)) {
		return value as InspectionStatus;
	}

	return "all";
}

function getFilterBasePath(pathname: string): string {
	if (pathname === "/inspecoes/kanban") {
		return "/inspecoes/kanban";
	}

	return "/inspecoes";
}

export function useInspectionFilters() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const query = searchParams.get("q") ?? "";
	const status = parseStatus(searchParams.get("status"));
	const basePath = getFilterBasePath(pathname);

	const updateParams = useCallback(
		(updates: { q?: string; status?: InspectionStatus | "all" }) => {
			const params = new URLSearchParams(searchParams.toString());

			if (updates.q !== undefined) {
				if (updates.q.trim()) {
					params.set("q", updates.q);
				} else {
					params.delete("q");
				}
			}

			if (updates.status !== undefined) {
				if (updates.status === "all") {
					params.delete("status");
				} else {
					params.set("status", updates.status);
				}
			}

			const nextQuery = params.toString();
			router.push(nextQuery ? `${basePath}?${nextQuery}` : basePath, {
				scroll: false,
			});
		},
		[basePath, router, searchParams],
	);

	const setQuery = useCallback(
		(value: string) => {
			updateParams({ q: value });
		},
		[updateParams],
	);

	const setStatus = useCallback(
		(value: InspectionStatus | "all") => {
			updateParams({ status: value });
		},
		[updateParams],
	);

	const toggleStatus = useCallback(
		(value: InspectionStatus) => {
			updateParams({ status: status === value ? "all" : value });
		},
		[status, updateParams],
	);

	return {
		query,
		status,
		setQuery,
		setStatus,
		toggleStatus,
	};
}
