import { AnimatePresence, motion } from "framer-motion";
import { Syringe } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePostV1HealthVaccines } from "@/gen/hooks/healthController/usePostV1HealthVaccines";
import { AnimalSelect } from "./animal-select";

const INITIAL_VACCINE_FORM = {
  animalId: "",
  vaccineName: "",
  doseNumber: "1",
  dateAdministered: "",
  nextDueDate: "",
};

type VaccineFormProps = {
  onSuccess?: () => void;
};

export function VaccineForm({ onSuccess }: VaccineFormProps) {
  const [vaccineForm, setVaccineForm] = useState(INITIAL_VACCINE_FORM);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  const vaccineMutation = usePostV1HealthVaccines({
    mutation: {
      onSuccess: () => {
        setVaccineForm(INITIAL_VACCINE_FORM);
        showFeedback(true, "Vacina registrada com sucesso!");
        onSuccess?.();
      },
      onError: () => showFeedback(false, "Erro ao registrar vaccine."),
    },
  });

  return (
    <Card className="group-hover:shadow-lg py-0 group-hover:border-emerald-500/50 transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden rounded-2xl">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 py-4">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Syringe className="size-4 text-emerald-600" />
          Imunização
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Animal *
          </Label>
          <AnimalSelect
            value={vaccineForm.animalId}
            onChange={(v) => setVaccineForm({ ...vaccineForm, animalId: v })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Nome da Vacina *
          </Label>
          <Input
            placeholder="Ex: Febre Aftosa"
            className="focus-visible:ring-emerald-500"
            value={vaccineForm.vaccineName}
            onChange={(e) =>
              setVaccineForm({
                ...vaccineForm,
                vaccineName: e.target.value,
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Dose Nº
            </Label>
            <Input
              type="number"
              min="1"
              className="focus-visible:ring-emerald-500"
              value={vaccineForm.doseNumber}
              onChange={(e) =>
                setVaccineForm({
                  ...vaccineForm,
                  doseNumber: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Data Aplicação *
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-emerald-500"
              value={vaccineForm.dateAdministered}
              onChange={(e) =>
                setVaccineForm({
                  ...vaccineForm,
                  dateAdministered: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Próxima Dose
          </Label>
          <Input
            type="date"
            className="focus-visible:ring-emerald-500"
            value={vaccineForm.nextDueDate}
            onChange={(e) =>
              setVaccineForm({
                ...vaccineForm,
                nextDueDate: e.target.value,
              })
            }
          />
        </div>
        <AnimatePresence>
          {feedback && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-xs font-medium px-3 py-2 rounded-md ${
                feedback.ok
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-destructive-100 text-destructive"
              }`}
            >
              {feedback.msg}
            </motion.p>
          )}
        </AnimatePresence>
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
          disabled={
            vaccineMutation.isPending ||
            !vaccineForm.animalId ||
            !vaccineForm.vaccineName ||
            !vaccineForm.dateAdministered
          }
          onClick={() =>
            vaccineMutation.mutate({
              data: {
                animalId: vaccineForm.animalId,
                vaccineName: vaccineForm.vaccineName,
                doseNumber: Number(vaccineForm.doseNumber),
                dateAdministered: vaccineForm.dateAdministered,
                nextDueDate: vaccineForm.nextDueDate || undefined,
              },
            })
          }
        >
          {vaccineMutation.isPending ? "Salvando..." : "Registrar Vacina"}
        </Button>
      </CardContent>
    </Card>
  );
}
