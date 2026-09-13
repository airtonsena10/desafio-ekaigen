"use client";

import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonProps extends ComponentProps<typeof Button> {
	loading?: boolean;
}

export function ActionButton({
	children,
	loading,
	...props
}: ActionButtonProps) {
	return (
		<Button disabled={loading || props.disabled} {...props}>
			{loading ? (
				<Loader2 className="size-4 animate-spin" aria-hidden="true" />
			) : null}
			{children}
		</Button>
	);
}
