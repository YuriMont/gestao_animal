import { useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
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
import { useGetV1EnumsReproductionPregnancyStatus } from "@/gen/hooks/enumsController/useGetV1EnumsReproductionPregnancyStatus";
import { getV1ReproductionPregnanciesQueryKey } from "@/gen/hooks/reproductionController/useGetV1ReproductionPregnancies";
import { usePostV1ReproductionPregnancies } from "@/gen/hooks/reproductionController/usePostV1ReproductionPregnancies";
import type { PostV1ReproductionPregnanciesMutationRequestStatusEnumKey } from "@/gen/models/reproductionController/PostV1ReproductionPregnancies";
import { AnimalSelect } from "./animal-select";

const INITIAL_PREGNANCY_FORM = {
  animalId: "",
  detectedDate: "",
  expectedDate: "",
  status: undefined as
    | PostV1ReproductionPregnanciesMutationRequestStatusEnumKey
    | undefined,
};

type PregnancyFormProps = {
  onSuccess?: () => void;
};

export function PregnancyForm({ onSuccess }: PregnancyFormProps) {
  const qc = useQueryClient();
  const [pregnancyForm, setPregnancyForm] = useState(INITIAL_PREGNANCY_FORM);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );

  const { data: pregnancyStatuses } =
    useGetV1EnumsReproductionPregnancyStatus();

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  const pregnancyMutation = usePostV1ReproductionPregnancies({
    mutation: {
      onSuccess: () => {
        setPregnancyForm(INITIAL_PREGNANCY_FORM);
        showFeedback(true, "Gestação registrada!");
        qc.invalidateQueries({
          queryKey: getV1ReproductionPregnanciesQueryKey(),
        });
        onSuccess?.();
      },
      onError: () => showFeedback(false, "Erro ao registrar gestação."),
    },
  });

  return (
    <Card className="h-full py-0 gap-0">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 py-4">
          <Heart className="size-4 text-emerald-600" />
          Gestação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Animal (Fêmea) *
          </Label>
          <AnimalSelect
            value={pregnancyForm.animalId}
            onChange={(v) =>
              setPregnancyForm({ ...pregnancyForm, animalId: v })
            }
            sex="FEMALE"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Data de Detecção *
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-emerald-500"
              value={pregnancyForm.detectedDate}
              onChange={(e) =>
                setPregnancyForm({
                  ...pregnancyForm,
                  detectedDate: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Previsão de Parto
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-emerald-500"
              value={pregnancyForm.expectedDate}
              onChange={(e) =>
                setPregnancyForm({
                  ...pregnancyForm,
                  expectedDate: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Status
          </Label>
          <Select
            value={pregnancyForm.status}
            onValueChange={(v) =>
              setPregnancyForm({
                ...pregnancyForm,
                status:
                  v as PostV1ReproductionPregnanciesMutationRequestStatusEnumKey,
              })
            }
          >
            <SelectTrigger className="focus-visible:ring-emerald-500">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {pregnancyStatuses?.map((item) => (
                <SelectItem key={String(item.key)} value={String(item.key)}>
                  {String(item.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            pregnancyMutation.isPending ||
            !pregnancyForm.animalId ||
            !pregnancyForm.detectedDate
          }
          onClick={() =>
            pregnancyMutation.mutate({
              data: {
                animalId: pregnancyForm.animalId,
                detectedDate: pregnancyForm.detectedDate,
                expectedDate: pregnancyForm.expectedDate || undefined,
                status: pregnancyForm.status || "PENDING",
              },
            })
          }
        >
          {pregnancyMutation.isPending ? "Salvando..." : "Registrar Gestação"}
        </Button>
      </CardContent>
    </Card>
  );
}
