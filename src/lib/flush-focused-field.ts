export function flushFocusedField(): void {
	const active = document.activeElement;
	if (active instanceof HTMLElement) {
		active.blur();
	}
}
