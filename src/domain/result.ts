export type { Result } from "@/types/result";

import type { Result } from "@/types/result";

export function ok<T>(value: T): Result<T> {
	return { ok: true, value };
}

export function err<E = string>(error: E): Result<never, E> {
	return { ok: false, error };
}
