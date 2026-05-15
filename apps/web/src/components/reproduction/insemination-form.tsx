import { useQueryClient } from "@tanstack/react-query";
import { Pipette } from "lucide-react";
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
  getV1ReproductionInseminationsQueryKey,
  useGetV1EnumsReproductionInseminationTypes,
  useGetV1ReproductionInseminations,
  usePostV1ReproductionInseminations,
} from "@/gen/hooks";
import type { PostV1ReproductionInseminationsMutationRequestTypeEnumKey } from "@/gen/models/reproductionController/PostV1ReproductionInseminations";
import { AnimalSelect } from "./animal-select";

const INITIAL_INSEMINATION_FORM = {
  animalId: "",
  type: undefined as
    | PostV1ReproductionInseminationsMutationRequestTypeEnumKey
    | undefined,
  date: "",
  fatherId: "",
  semenBatch: "",
  success: undefined as "true" | "false" | undefined,
};

type InseminationFormProps = {
  onSuccess?: () => void;
};

export function InseminationForm({ onSuccess }: InseminationFormProps) {
  const qc = useQueryClient();
  const [form, setForm] = useState(INITIAL_INSEMINATION_FORM);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );

  const { data: inseminationTypes } =
    useGetV1EnumsReproductionInseminationTypes();

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  const mutation = usePostV1ReproductionInseminations({
    mutation: {
      onSuccess: () => {
        setForm(INITIAL_INSEMINATION_FORM);
        showFeedback(true, "Inseminação registrada!");
        qc.invalidateQueries({
          queryKey: getV1ReproductionInseminationsQueryKey(),
        });
        onSuccess?.();
      },
      onError: () => showFeedback(false, "Erro ao registrar inseminação."),
    },
  });

  return (
    <Card className="h-full p-0 gap-0">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 py-4">
          <Pipette className="size-4 text-emerald-600" />
          Inseminação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Animal (Fêmea) *
          </Label>
          <AnimalSelect
            value={form.animalId}
            onChange={(v) => setForm({ ...form, animalId: v })}
            sex="FEMALE"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Tipo *
            </Label>
            <Select
              value={form.type}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  type: v as PostV1ReproductionInseminationsMutationRequestTypeEnumKey,
                })
              }
            >
              <SelectTrigger className="focus-visible:ring-emerald-500">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {inseminationTypes?.map((item) => (
                  <SelectItem key={String(item.key)} value={String(item.key)}>
                    {String(item.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Data *
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-emerald-500"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Pai (Macho)
          </Label>
          <AnimalSelect
            value={form.fatherId}
            onChange={(v) => setForm({ ...form, fatherId: v })}
            sex="MALE"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Lote de Sêmen
            </Label>
            <Input
              placeholder="Ex: LOTE-001"
              className="focus-visible:ring-emerald-500"
              value={form.semenBatch}
              onChange={(e) => setForm({ ...form, semenBatch: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Sucesso
            </Label>
            <Select
              value={form.success}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  success:
                    v === "true" ? "true" : v === "false" ? "false" : undefined,
                })
              }
            >
              <SelectTrigger className="focus-visible:ring-emerald-500">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
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
            mutation.isPending || !form.animalId || !form.type || !form.date
          }
          onClick={() =>
            mutation.mutate({
              data: {
                animalId: form.animalId,
                type: form.type!,
                date: form.date || undefined,
                fatherId: form.fatherId || undefined,
                semenBatch: form.semenBatch || undefined,
                success:
                  form.success === "true"
                    ? true
                    : form.success === "false"
                      ? false
                      : undefined,
              },
            })
          }
        >
          {mutation.isPending ? "Salvando..." : "Registrar Inseminação"}
        </Button>
      </CardContent>
    </Card>
  );
}
