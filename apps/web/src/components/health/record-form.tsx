import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePostV1HealthRecords } from "@/gen/hooks/healthController/usePostV1HealthRecords";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AnimalSelect } from "./animal-select";

// API schema: animalId, date, description, observation?
const INITIAL_RECORD_FORM = {
	animalId: "",
	date: "",
	description: "",
	observation: "",
};

export function RecordForm() {
	const [recordForm, setRecordForm] = useState(INITIAL_RECORD_FORM);
	const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
		null,
	);

	function showFeedback(ok: boolean, msg: string) {
		setFeedback({ ok, msg });
		setTimeout(() => setFeedback(null), 3000);
	}

	const recordMutation = usePostV1HealthRecords({
		mutation: {
			onSuccess: () => {
				setRecordForm(INITIAL_RECORD_FORM);
				showFeedback(true, "Registro criado!");
			},
			onError: () => showFeedback(false, "Erro ao criar registro."),
		},
	});

	return (
		<Card className="max-w-lg">
			<CardHeader>
				<CardTitle className="text-base flex items-center gap-2">
					<Plus className="size-4" />
					Novo Registro de Saúde
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-1.5">
					<Label>Animal *</Label>
					<AnimalSelect
						value={recordForm.animalId}
						onChange={(v) => setRecordForm({ ...recordForm, animalId: v })}
					/>
				</div>
				<div className="space-y-1.5">
					<Label>Data *</Label>
					<Input
						type="date"
						value={recordForm.date}
						onChange={(e) =>
							setRecordForm({ ...recordForm, date: e.target.value })
						}
					/>
				</div>
				<div className="space-y-1.5">
					<Label>Descrição *</Label>
					<Textarea
						placeholder="Descreva o registro de saúde..."
						value={recordForm.description}
						onChange={(e) =>
							setRecordForm({
								...recordForm,
								description: e.target.value,
							})
						}
					/>
				</div>
				<div className="space-y-1.5">
					<Label>Observações</Label>
					<Textarea
						placeholder="Observações adicionais..."
						value={recordForm.observation}
						onChange={(e) =>
							setRecordForm({
								...recordForm,
								observation: e.target.value,
							})
						}
					/>
				</div>
				{feedback && (
					<p
						className={`text-sm ${feedback.ok ? "text-primary" : "text-destructive"}`}
					>
						{feedback.msg}
					</p>
				)}
				<Button
					className="w-full"
					disabled={
						recordMutation.isPending ||
						!recordForm.animalId ||
						!recordForm.description ||
						!recordForm.date
					}
					onClick={() =>
						recordMutation.mutate({
							data: {
								animalId: recordForm.animalId,
								date: recordForm.date,
								description: recordForm.description,
								observation: recordForm.observation || undefined,
							},
						})
					}
				>
					{recordMutation.isPending ? "Salvando..." : "Salvar Registro"}
				</Button>
			</CardContent>
		</Card>
	);
}
