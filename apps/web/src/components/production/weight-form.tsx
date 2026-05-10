import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getV1ProductionMetricsAnimalidQueryKey,
  usePostV1ProductionWeight,
} from "@/gen/hooks";

interface WeightFormProps {
  animalId: string;
  onSuccess?: () => void;
}

const INITIAL_WEIGHT_FORM = {
  weight: "",
  date: "",
  notes: "",
};

export function WeightForm({ animalId, onSuccess }: WeightFormProps) {
  const [weightForm, setWeightForm] = useState(INITIAL_WEIGHT_FORM);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const qc = useQueryClient();

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  const weightMutation = usePostV1ProductionWeight({
    mutation: {
      onSuccess: () => {
        setWeightForm(INITIAL_WEIGHT_FORM);
        showFeedback(true, "Peso registrado!");
        qc.invalidateQueries({
          queryKey: getV1ProductionMetricsAnimalidQueryKey(animalId),
        });
        onSuccess?.();
      },
      onError: () => showFeedback(false, "Erro ao registrar peso."),
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="size-4" />
          Registrar Peso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Peso (kg) *</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Ex: 450.5"
              value={weightForm.weight}
              onChange={(e) =>
                setWeightForm({
                  ...weightForm,
                  weight: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Data *</Label>
            <Input
              type="date"
              value={weightForm.date}
              onChange={(e) =>
                setWeightForm({ ...weightForm, date: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Observações</Label>
          <Textarea
            placeholder="Notas..."
            value={weightForm.notes}
            onChange={(e) =>
              setWeightForm({ ...weightForm, notes: e.target.value })
            }
          />
        </div>
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-xs font-medium px-3 py-2 rounded-md ${
              feedback.ok
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {feedback.msg}
          </motion.p>
        )}
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={
            weightMutation.isPending || !weightForm.weight || !weightForm.date
          }
          onClick={() =>
            weightMutation.mutate({
              data: {
                animalId,
                weight: Number(weightForm.weight),
                date: weightForm.date || undefined,
              },
            })
          }
        >
          {weightMutation.isPending ? "Salvando..." : "Registrar Pesagem"}
        </Button>
      </CardContent>
    </Card>
  );
}
