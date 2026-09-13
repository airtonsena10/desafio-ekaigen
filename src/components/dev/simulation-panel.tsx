"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInspections } from "@/providers/inspection-provider";
import {
	getSimulationSettings,
	resetSimulationSettings,
	updateSimulationSettings,
} from "@/services/simulation";

export function SimulationPanel() {
	const { restoreMock } = useInspections();
	const [open, setOpen] = useState(false);
	const [settings, setSettings] = useState(getSimulationSettings());
	const [appliedSettings, setAppliedSettings] = useState(
		getSimulationSettings(),
	);

	if (process.env.NODE_ENV === "production") {
		return null;
	}

	const applySettings = () => {
		const next = updateSimulationSettings(settings);
		setAppliedSettings(next);
		toast.success(
			`Simulação aplicada: atraso de ${next.delayMs}ms${next.shouldFail ? " e falha ativa" : ""}.`,
		);
		setOpen(false);
	};

	const handleRestore = async () => {
		await restoreMock();
		toast.success("Dados mock restaurados.");
		setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (nextOpen) {
					setSettings(getSimulationSettings());
					setAppliedSettings(getSimulationSettings());
				}
			}}
		>
			<DialogTrigger asChild>
				<Button variant="outline">Simulação</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Painel de simulação</DialogTitle>
					<DialogDescription>
						Toda operação de dados (carregar, criar, salvar, aprovar) passa por
						este atraso.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="delay-ms">Atraso (ms)</Label>
						<Input
							id="delay-ms"
							type="number"
							min={0}
							value={settings.delayMs}
							onChange={(event) =>
								setSettings((current) => ({
									...current,
									delayMs: Number(event.target.value),
								}))
							}
						/>
						<p className="text-xs text-muted-foreground">
							Ex.: 800ms deixa botões/skeleton visíveis por quase 1 segundo.
						</p>
					</div>

					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							checked={settings.shouldFail}
							onChange={(event) =>
								setSettings((current) => ({
									...current,
									shouldFail: event.target.checked,
								}))
							}
						/>
						Simular falha nas próximas operações
					</label>
				</div>

				<DialogFooter className="gap-2 sm:gap-2">
					<Button size="sm" onClick={applySettings}>
						Aplicar
					</Button>

					<Button
						size="sm"
						variant="secondary"
						onClick={() => {
							const reset = resetSimulationSettings();
							setSettings(reset);
							setAppliedSettings(reset);
							toast.message("Simulação resetada para variáveis de ambiente.");
						}}
					>
						Reset
					</Button>
					<Button size="sm" variant="outline" onClick={handleRestore}>
						Restaurar mock
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
