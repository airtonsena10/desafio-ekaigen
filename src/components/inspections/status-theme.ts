import type { InspectionStatus } from "@/types/inspection.types";
import type { StatusTheme } from "@/types/ui";

export type { StatusTheme } from "@/types/ui";

export const STATUS_THEME: Record<InspectionStatus, StatusTheme> = {
	em_preenchimento: {
		badge:
			"border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100",
		column:
			"border-amber-200/80 bg-amber-50/70 dark:border-amber-800/60 dark:bg-amber-950/25",
		dot: "bg-amber-600 dark:bg-amber-400",
		ring: "ring-amber-400/50 dark:ring-amber-500/40",
		label: "text-amber-950 dark:text-amber-100",
		accent: "bg-amber-500 dark:bg-amber-400",
		counter: "text-amber-950 dark:text-amber-100",
	},
	em_aprovacao: {
		badge:
			"border-sky-300 bg-sky-50 text-sky-950 dark:border-sky-700 dark:bg-sky-950/50 dark:text-sky-100",
		column:
			"border-sky-200/80 bg-sky-50/70 dark:border-sky-800/60 dark:bg-sky-950/25",
		dot: "bg-sky-600 dark:bg-sky-400",
		ring: "ring-sky-400/50 dark:ring-sky-500/40",
		label: "text-sky-950 dark:text-sky-100",
		accent: "bg-sky-600 dark:bg-sky-400",
		counter: "text-sky-950 dark:text-sky-100",
	},
	aprovada: {
		badge:
			"border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-100",
		column:
			"border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-800/60 dark:bg-emerald-950/25",
		dot: "bg-emerald-600 dark:bg-emerald-400",
		ring: "ring-emerald-400/50 dark:ring-emerald-500/40",
		label: "text-emerald-950 dark:text-emerald-100",
		accent: "bg-emerald-600 dark:bg-emerald-400",
		counter: "text-emerald-950 dark:text-emerald-100",
	},
	reprovada: {
		badge:
			"border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-100",
		column:
			"border-rose-200/80 bg-rose-50/70 dark:border-rose-800/60 dark:bg-rose-950/25",
		dot: "bg-rose-600 dark:bg-rose-400",
		ring: "ring-rose-400/50 dark:ring-rose-500/40",
		label: "text-rose-950 dark:text-rose-100",
		accent: "bg-rose-600 dark:bg-rose-400",
		counter: "text-rose-950 dark:text-rose-100",
	},
};
