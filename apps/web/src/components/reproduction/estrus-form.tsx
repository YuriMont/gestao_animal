import { Flower } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePostV1ReproductionEstrus } from "@/gen/hooks/reproductionController/usePostV1ReproductionEstrus";
import { AnimalSelect } from "./animal-select";

const INITIAL_ESTRUS_FORM = {
  animalId: "",
  startDate: "",
  endDate: "",
  observation: "",
};

type EstrusFormProps = {
  onSuccess?: () => void;
};

export function EstrusForm({ onSuccess }: EstrusFormProps) {
  const [estrusForm, setEstrusForm] = useState(INITIAL_ESTRUS_FORM);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  const estrusMutation = usePostV1ReproductionEstrus({
    mutation: {
      onSuccess: () => {
        setEstrusForm(INITIAL_ESTRUS_FORM);
        showFeedback(true, "Cio registrado!");
        onSuccess?.();
      },
      onError: () => showFeedback(false, "Erro ao registrar."),
    },
  });

  return (
    <Card className="h-full py-0 gap-0">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 py-4">
          <Flower className="size-4 text-emerald-600" />
          Estro / Cio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Fêmea *
          </Label>
          <AnimalSelect
            value={estrusForm.animalId}
            onChange={(v) => setEstrusForm({ ...estrusForm, animalId: v })}
            femaleOnly
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Data de Início *
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-emerald-500"
              value={estrusForm.startDate}
              onChange={(e) =>
                setEstrusForm({ ...estrusForm, startDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Data de Fim
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-emerald-500"
              value={estrusForm.endDate}
              onChange={(e) =>
                setEstrusForm({ ...estrusForm, endDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Observações
          </Label>
          <Textarea
            placeholder="Notas..."
            className="focus-visible:ring-emerald-500"
            value={estrusForm.observation}
            onChange={(e) =>
              setEstrusForm({ ...estrusForm, observation: e.target.value })
            }
          />
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
            estrusMutation.isPending ||
            !estrusForm.animalId ||
            !estrusForm.startDate
          }
          onClick={() =>
            estrusMutation.mutate({
              data: {
                animalId: estrusForm.animalId,
                startDate: estrusForm.startDate,
                endDate: estrusForm.endDate || undefined,
                observation: estrusForm.observation || undefined,
              },
            })
          }
        >
          {estrusMutation.isPending ? "Salvando..." : "Registrar Cio"}
        </Button>
      </CardContent>
    </Card>
  );
}
