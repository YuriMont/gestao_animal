import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePostV1HealthTreatments } from "@/gen/hooks/healthController/usePostV1HealthTreatments";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AnimalSelect } from "./animal-select";

// API schema: animalId, diagnosis, medication, dosage?, startDate, endDate?
const INITIAL_TREATMENT_FORM = {
	animalId: "",
	diagnosis: "",
	medication: "",
	dosage: "",
	startDate: "",
	endDate: "",
};

export function TreatmentForm() {
	const [treatmentForm, setTreatmentForm] = useState(INITIAL_TREATMENT_FORM);
	const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
		null,
	);

	function showFeedback(ok: boolean, msg: string) {
		setFeedback({ ok, msg });
		setTimeout(() => setFeedback(null), 3000);
	}

	const treatmentMutation = usePostV1HealthTreatments({
		mutation: {
			onSuccess: () => {
				setTreatmentForm(INITIAL_TREATMENT_FORM);
				showFeedback(true, "Tratamento registrado!");
			},
			onError: () => showFeedback(false, "Erro ao registrar tratamento."),
		},
	});

	return (
		<Card className="max-w-lg">
			<CardHeader>
				<CardTitle className="text-base flex items-center gap-2">
					<Plus className="size-4" />
					Registrar Tratamento
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-1.5">
					<Label>Animal *</Label>
					<AnimalSelect
						value={treatmentForm.animalId}
						onChange={(v) =>
							setTreatmentForm({ ...treatmentForm, animalId: v })
						}
					/>
				</div>
				<div className="space-y-1.5">
					<Label>Diagnóstico *</Label>
					<Input
						placeholder="Ex: Vermifugação"
						value={treatmentForm.diagnosis}
						onChange={(e) =>
							setTreatmentForm({
								...treatmentForm,
								diagnosis: e.target.value,
							})
						}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<Label>Medicamento *</Label>
						<Input
							placeholder="Nome do medicamento"
							value={treatmentForm.medication}
							onChange={(e) =>
								setTreatmentForm({
									...treatmentForm,
									medication: e.target.value,
								})
							}
						/>
					</div>
					<div className="space-y-1.5">
						<Label>Dosagem</Label>
						<Input
							placeholder="Ex: 10ml"
							value={treatmentForm.dosage}
							onChange={(e) =>
								setTreatmentForm({
									...treatmentForm,
									dosage: e.target.value,
								})
							}
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<Label>Data Início *</Label>
						<Input
							type="date"
							value={treatmentForm.startDate}
							onChange={(e) =>
								setTreatmentForm({
									...treatmentForm,
									startDate: e.target.value,
								})
							}
						/>
					</div>
					<div className="space-y-1.5">
						<Label>Data Fim</Label>
						<Input
							type="date"
							value={treatmentForm.endDate}
							onChange={(e) =>
								setTreatmentForm({
									...treatmentForm,
									endDate: e.target.value,
								})
							}
						/>
					</div>
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
						treatmentMutation.isPending ||
						!treatmentForm.animalId ||
						!treatmentForm.diagnosis ||
						!treatmentForm.medication ||
						!treatmentForm.startDate
					}
					onClick={() =>
						treatmentMutation.mutate({
							data: {
								animalId: treatmentForm.animalId,
								diagnosis: treatmentForm.diagnosis,
								medication: treatmentForm.medication,
								dosage: treatmentForm.dosage || undefined,
								startDate: treatmentForm.startDate,
								endDate: treatmentForm.endDate || undefined,
							},
						})
					}
				>
					{treatmentMutation.isPending ? "Salvando..." : "Registrar Tratamento"}
				</Button>
			</CardContent>
		</Card>
	);
}
