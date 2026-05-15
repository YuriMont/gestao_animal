import { Bug } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { usePostV1Parasitology } from "@/gen/hooks/parasiteMonitoringController/usePostV1Parasitology";
import { AnimalSelect } from "./animal-select";

const FAMACHA_OPTIONS = [
  { value: 0, label: "N/A", color: "bg-slate-400", desc: "Não se aplica" },
  {
    value: 1,
    label: "1",
    color: "bg-red-600",
    desc: "Vermelho intenso (saudável)",
  },
  { value: 2, label: "2", color: "bg-red-400", desc: "Vermelho rosado" },
  { value: 3, label: "3", color: "bg-red-300", desc: "Rosado mais claro" },
  { value: 4, label: "4", color: "bg-red-200", desc: "Muito pálido" },
  {
    value: 5,
    label: "5",
    color: "bg-red-100",
    desc: "Quase branco (anemia severa)",
  },
];

const INITIAL_FORM = {
  animalId: "",
  date: "",
  famacha: "",
  opg: "",
  nextParasiteCheck: "",
  observation: "",
};

type ParasitologyFormProps = {
  onSuccess?: () => void;
};

export function ParasitologyForm({ onSuccess }: ParasitologyFormProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  const mutation = usePostV1Parasitology({
    mutation: {
      onSuccess: () => {
        setForm(INITIAL_FORM);
        showFeedback(true, "Registro parasitológico criado!");
        onSuccess?.();
      },
      onError: () => showFeedback(false, "Erro ao criar registro."),
    },
  });

  return (
    <Card className="h-full py-0">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 py-4">
          <Bug className="size-4 text-amber-600" />
          Monitoramento Parasitológico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 p-6">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Animal *
          </Label>
          <AnimalSelect
            value={form.animalId}
            onChange={(v) => setForm({ ...form, animalId: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Data *
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-amber-500"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              FAMACHA
            </Label>
            <Select
              value={form.famacha}
              onValueChange={(v) => setForm({ ...form, famacha: v })}
            >
              <SelectTrigger className="focus-visible:ring-amber-500">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {FAMACHA_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${opt.color}`} />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              OPG (ovos/g)
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              className="focus-visible:ring-amber-500"
              value={form.opg}
              onChange={(e) => setForm({ ...form, opg: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Próximo exame
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-amber-500"
              value={form.nextParasiteCheck}
              onChange={(e) =>
                setForm({ ...form, nextParasiteCheck: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Observações
          </Label>
          <Textarea
            placeholder="Observações adicionais..."
            className="focus-visible:ring-amber-500"
            value={form.observation}
            onChange={(e) => setForm({ ...form, observation: e.target.value })}
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
          className="w-full bg-amber-600 hover:bg-amber-700"
          disabled={mutation.isPending || !form.animalId || !form.date}
          onClick={() =>
            mutation.mutate({
              data: {
                animalId: form.animalId,
                date: form.date,
                famacha: form.famacha ? parseInt(form.famacha, 10) : undefined,
                opg: form.opg ? parseInt(form.opg, 10) : undefined,
                nextParasiteCheck: form.nextParasiteCheck || undefined,
                observation: form.observation || undefined,
              },
            })
          }
        >
          {mutation.isPending ? "Salvando..." : "Salvar Registro"}
        </Button>
      </CardContent>
    </Card>
  );
}
