export function formatInspectionDate(date: string): string {
	const parsed = new Date(`${date}T12:00:00`);

	if (Number.isNaN(parsed.getTime())) {
		return date;
	}

	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(parsed);
}
