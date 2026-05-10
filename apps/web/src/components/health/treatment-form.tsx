import { Pill } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePostV1HealthTreatments } from "@/gen/hooks/healthController/usePostV1HealthTreatments";
import { AnimalSelect } from "./animal-select";

const INITIAL_TREATMENT_FORM = {
  animalId: "",
  diagnosis: "",
  medication: "",
  dosage: "",
  startDate: "",
  endDate: "",
};

type TreatmentFormProps = {
  onSuccess?: () => void;
};

export function TreatmentForm({ onSuccess }: TreatmentFormProps) {
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
        onSuccess?.();
      },
      onError: () => showFeedback(false, "Erro ao registrar tratamento."),
    },
  });

  return (
    <Card className="h-full py-0">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 py-4">
          <Pill className="size-4 text-emerald-600" />
          Tratamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 p-6">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Animal *
          </Label>
          <AnimalSelect
            value={treatmentForm.animalId}
            onChange={(v) =>
              setTreatmentForm({ ...treatmentForm, animalId: v })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Diagnóstico *
          </Label>
          <Input
            placeholder="Ex: Vermifugação"
            className="focus-visible:ring-emerald-500"
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
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Medicamento *
            </Label>
            <Input
              placeholder="Nome do medicamento"
              className="focus-visible:ring-emerald-500"
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
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Dosagem
            </Label>
            <Input
              placeholder="Ex: 10ml"
              className="focus-visible:ring-emerald-500"
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
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Data Início *
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-emerald-500"
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
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Data Fim
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-emerald-500"
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
            className={`text-sm ${feedback.ok ? "text-emerald-600" : "text-destructive"}`}
          >
            {feedback.msg}
          </p>
        )}
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
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
