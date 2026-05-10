import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getV1ProductionMetricsAnimalidQueryKey,
  usePostV1ProductionMilk,
} from "@/gen/hooks";

interface MilkFormProps {
  animalId: string;
  onSuccess?: () => void;
}

const INITIAL_MILK_FORM = {
  quantity: "",
  unit: "L",
  date: "",
};

export function MilkForm({ animalId, onSuccess }: MilkFormProps) {
  const [milkForm, setMilkForm] = useState(INITIAL_MILK_FORM);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const qc = useQueryClient();

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  const milkMutation = usePostV1ProductionMilk({
    mutation: {
      onSuccess: () => {
        setMilkForm(INITIAL_MILK_FORM);
        showFeedback(true, "Produção registrada!");
        qc.invalidateQueries({
          queryKey: getV1ProductionMetricsAnimalidQueryKey(animalId),
        });
        onSuccess?.();
      },
      onError: () => showFeedback(false, "Erro ao registrar produção."),
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="size-4" />
          Registrar Produção de Leite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Quantidade *</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Ex: 20.5"
              value={milkForm.quantity}
              onChange={(e) =>
                setMilkForm({ ...milkForm, quantity: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Unidade *</Label>
            <Select
              value={milkForm.unit}
              onValueChange={(v) => setMilkForm({ ...milkForm, unit: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Litros (L)</SelectItem>
                <SelectItem value="mL">Mililitros (mL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Data *</Label>
          <Input
            type="date"
            value={milkForm.date}
            onChange={(e) => setMilkForm({ ...milkForm, date: e.target.value })}
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
            milkMutation.isPending || !milkForm.quantity || !milkForm.date
          }
          onClick={() =>
            milkMutation.mutate({
              data: {
                animalId,
                quantity: Number(milkForm.quantity),
                unit: milkForm.unit,
                date: milkForm.date || undefined,
              },
            })
          }
        >
          {milkMutation.isPending ? "Salvando..." : "Registrar Produção"}
        </Button>
      </CardContent>
    </Card>
  );
}
