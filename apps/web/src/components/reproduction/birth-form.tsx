import { Baby } from "lucide-react";
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
import { useGetV1EnumsReproductionBirthStatus } from "@/gen/hooks/enumsController/useGetV1EnumsReproductionBirthStatus";
import { usePostV1ReproductionBirth } from "@/gen/hooks/reproductionController/usePostV1ReproductionBirth";
import type { PostV1ReproductionBirthMutationRequestStatusEnumKey } from "@/gen/models/reproductionController/PostV1ReproductionBirth";
import { AnimalSelect } from "./animal-select";

const INITIAL_BIRTH_FORM = {
  motherId: "",
  fatherId: "",
  birthDate: "",
  offspringTag: "",
  offspringWeight: "",
  status: "ALIVE" as PostV1ReproductionBirthMutationRequestStatusEnumKey,
};

type BirthFormProps = {
  onSuccess?: () => void;
};

export function BirthForm({ onSuccess }: BirthFormProps) {
  const [birthForm, setBirthForm] = useState(INITIAL_BIRTH_FORM);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(
    null,
  );
  const { data: birthStatuses } = useGetV1EnumsReproductionBirthStatus();

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  const birthMutation = usePostV1ReproductionBirth({
    mutation: {
      onSuccess: () => {
        setBirthForm(INITIAL_BIRTH_FORM);
        showFeedback(true, "Parto registrado!");
        onSuccess?.();
      },
      onError: () => showFeedback(false, "Erro ao registrar parto."),
    },
  });

  return (
    <Card className="h-full p-0 gap-0">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 py-4">
          <Baby className="size-4 text-emerald-600" />
          Partos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Mãe (Fêmea) *
          </Label>
          <AnimalSelect
            value={birthForm.motherId}
            onChange={(v) => setBirthForm({ ...birthForm, motherId: v })}
            sex="FEMALE"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase">
            Pai (Macho)
          </Label>
          <AnimalSelect
            value={birthForm.fatherId}
            onChange={(v) => setBirthForm({ ...birthForm, fatherId: v })}
            sex="MALE"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Data do Parto *
            </Label>
            <Input
              type="date"
              className="focus-visible:ring-emerald-500"
              value={birthForm.birthDate}
              onChange={(e) =>
                setBirthForm({ ...birthForm, birthDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Tag do Filhote
            </Label>
            <Input
              placeholder="Ex: BOV-050"
              className="focus-visible:ring-emerald-500"
              value={birthForm.offspringTag}
              onChange={(e) =>
                setBirthForm({ ...birthForm, offspringTag: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Peso do Filhote (kg)
            </Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Ex: 25.5"
              className="focus-visible:ring-emerald-500"
              value={birthForm.offspringWeight}
              onChange={(e) =>
                setBirthForm({ ...birthForm, offspringWeight: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">
              Status *
            </Label>
            <Select
              value={birthForm.status}
              onValueChange={(v) =>
                setBirthForm({
                  ...birthForm,
                  status:
                    v as PostV1ReproductionBirthMutationRequestStatusEnumKey,
                })
              }
            >
              <SelectTrigger className="focus-visible:ring-emerald-500">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {birthStatuses?.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.label}
                  </SelectItem>
                ))}
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
            birthMutation.isPending ||
            !birthForm.motherId ||
            !birthForm.birthDate
          }
          onClick={() =>
            birthMutation.mutate({
              data: {
                motherId: birthForm.motherId,
                fatherId: birthForm.fatherId || undefined,
                birthDate: birthForm.birthDate,
                offspringTag: birthForm.offspringTag || undefined,
                offspringWeight: birthForm.offspringWeight
                  ? parseFloat(birthForm.offspringWeight)
                  : undefined,
                status: birthForm.status,
              },
            })
          }
        >
          {birthMutation.isPending ? "Salvando..." : "Registrar Parto"}
        </Button>
      </CardContent>
    </Card>
  );
}
