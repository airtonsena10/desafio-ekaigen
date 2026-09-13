import type { InspectionStatus } from "@/domain/inspection.types";

export interface StatusTheme {
	badge: string;
	column: string;
	dot: string;
	ring: string;
	label: string;
	accent: string;
	counter: string;
}

export const STATUS_THEME: Record<InspectionStatus, StatusTheme> = {
	em_preenchimento: {
		badge: "border-amber-300 bg-amber-50 text-amber-950",
		column: "border-amber-200/80 bg-amber-50/70",
		dot: "bg-amber-600",
		ring: "ring-amber-400/50",
		label: "text-amber-950",
		accent: "bg-amber-500",
		counter: "text-amber-950",
	},
	em_aprovacao: {
		badge: "border-sky-300 bg-sky-50 text-sky-950",
		column: "border-sky-200/80 bg-sky-50/70",
		dot: "bg-sky-600",
		ring: "ring-sky-400/50",
		label: "text-sky-950",
		accent: "bg-sky-600",
		counter: "text-sky-950",
	},
	aprovada: {
		badge: "border-emerald-300 bg-emerald-50 text-emerald-950",
		column: "border-emerald-200/80 bg-emerald-50/70",
		dot: "bg-emerald-600",
		ring: "ring-emerald-400/50",
		label: "text-emerald-950",
		accent: "bg-emerald-600",
		counter: "text-emerald-950",
	},
	reprovada: {
		badge: "border-rose-300 bg-rose-50 text-rose-950",
		column: "border-rose-200/80 bg-rose-50/70",
		dot: "bg-rose-600",
		ring: "ring-rose-400/50",
		label: "text-rose-950",
		accent: "bg-rose-600",
		counter: "text-rose-950",
	},
};
