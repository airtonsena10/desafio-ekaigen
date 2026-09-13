import { describe, expect, it } from "vitest";
import { toErrorMessage } from "@/lib/error-message";

describe("toErrorMessage", () => {
	it("retorna a mensagem de Error", () => {
		expect(toErrorMessage(new Error("falha"), "fallback")).toBe("falha");
	});

	it("usa fallback para valores desconhecidos", () => {
		expect(toErrorMessage("erro", "fallback")).toBe("fallback");
	});
});
