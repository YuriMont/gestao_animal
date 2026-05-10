import { FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePostV1HealthRecords } from "@/gen/hooks/healthController/usePostV1HealthRecords";
import { AnimalSelect } from "./animal-select";

const INITIAL_RECORD_FORM = {
  animalId: "",
  date: "",
  description: "",
  observation: "",
};

type RecordFormProps = {
  onSuccess?: () => void;
};

export function RecordForm({ onSuccess }: RecordFormProps) {
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
        onSuccess?.();
      },
      onError: () => showFeedback(false, "Erro ao criar registro."),
    },
  });

  return (
    <Card className="h-full py-0">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 py-4">
          <FileText className="size-4 text-emerald-600" />
          Registro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 p-6">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Animal *
          </Label>
          <AnimalSelect
            value={recordForm.animalId}
            onChange={(v) => setRecordForm({ ...recordForm, animalId: v })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Data *
          </Label>
          <Input
            type="date"
            className="focus-visible:ring-emerald-500"
            value={recordForm.date}
            onChange={(e) =>
              setRecordForm({ ...recordForm, date: e.target.value })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Descrição *
          </Label>
          <Textarea
            placeholder="Descreva o registro de saúde..."
            className="focus-visible:ring-emerald-500"
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
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Observações
          </Label>
          <Textarea
            placeholder="Observações adicionais..."
            className="focus-visible:ring-emerald-500"
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
            className={`text-sm ${feedback.ok ? "text-emerald-600" : "text-destructive"}`}
          >
            {feedback.msg}
          </p>
        )}
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
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
