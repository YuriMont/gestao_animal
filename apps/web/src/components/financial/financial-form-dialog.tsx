import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

import {
  useGetV1EnumsFinancialCategories,
  useGetV1EnumsFinancialTypes,
} from "@/gen";

import { useDeleteV1FinancialRecordsId } from "@/gen/hooks/financialController/useDeleteV1FinancialRecordsId";
import { getV1FinancialRecordsQueryKey } from "@/gen/hooks/financialController/useGetV1FinancialRecords";
import { getV1FinancialSummaryQueryKey } from "@/gen/hooks/financialController/useGetV1FinancialSummary";
import { usePostV1FinancialRecords } from "@/gen/hooks/financialController/usePostV1FinancialRecords";
import { usePutV1FinancialRecordsId } from "@/gen/hooks/financialController/usePutV1FinancialRecordsId";

import type { PostV1FinancialRecordsMutationRequestTypeEnumKey } from "@/gen/models/financialController/PostV1FinancialRecords";

interface FinancialRecord {
  id: string;
  type: { key: string; label: string };
  category: { key: string; label: string };
  amount: number;
  date: string;
  description?: string;
}

const INITIAL_FINANCIAL_FORM = {
  type: "INCOME" as PostV1FinancialRecordsMutationRequestTypeEnumKey,
  category: "",
  amount: "",
  date: "",
  description: "",
};

interface FinancialFormDialogProps {
  record?: FinancialRecord;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function FinancialFormDialog({
  record,
  open,
  onOpenChange,
  onSuccess,
}: FinancialFormDialogProps) {
  const qc = useQueryClient();

  const isEditing = !!record;

  const [internalOpen, setInternalOpen] = useState(false);

  const dialogOpen = open ?? internalOpen;
  const setDialogOpen = onOpenChange ?? setInternalOpen;

  const [form, setForm] = useState(INITIAL_FINANCIAL_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setForm({
        type: record.type
          .key as PostV1FinancialRecordsMutationRequestTypeEnumKey,
        category: record.category.key,
        amount: String(record.amount),
        date: record.date.split("T")[0],
        description: record.description || "",
      });

      return;
    }

    setForm(INITIAL_FINANCIAL_FORM);
  }, [record, dialogOpen]);

  const { data: financialTypes } = useGetV1EnumsFinancialTypes();

  const { data: financialCategories } = useGetV1EnumsFinancialCategories();

  const invalidateQueries = async () => {
    await Promise.all([
      qc.invalidateQueries({
        queryKey: getV1FinancialRecordsQueryKey(),
      }),
      qc.invalidateQueries({
        queryKey: getV1FinancialSummaryQueryKey(),
      }),
    ]);
  };

  const handleSuccess = async () => {
    await invalidateQueries();

    setDialogOpen(false);
    setError(null);

    if (!isEditing) {
      setForm(INITIAL_FINANCIAL_FORM);
    }

    onSuccess?.();
  };

  const createMutation = usePostV1FinancialRecords({
    mutation: {
      onSuccess: handleSuccess,
      onError: () => {
        setError("Erro ao salvar lançamento.");
      },
    },
  });

  const updateMutation = usePutV1FinancialRecordsId({
    mutation: {
      onSuccess: handleSuccess,
      onError: () => {
        setError("Erro ao atualizar lançamento.");
      },
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    setError(null);

    const amount = Number(form.amount);

    if (!form.category || !form.date || !amount) {
      setError("Preencha os campos obrigatórios.");
      return;
    }

    const data = {
      type: form.type,
      category: form.category as any,
      amount,
      date: form.date,
      description: form.description || undefined,
    };

    if (isEditing) {
      updateMutation.mutate({ data, id: record.id });
      return;
    }

    createMutation.mutate({ data });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isEditing && (
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Novo Lançamento
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Lançamento" : "Novo Lançamento"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tipo *</Label>

              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    type: value as PostV1FinancialRecordsMutationRequestTypeEnumKey,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {financialTypes?.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Categoria *</Label>

              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    category: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>

                <SelectContent>
                  {financialCategories?.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Valor (R$) *</Label>

              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={form.amount}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label>Data *</Label>

              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descrição</Label>

            <Textarea
              placeholder="Detalhes do lançamento..."
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FinancialActions({ record }: { record: FinancialRecord }) {
  const qc = useQueryClient();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const deleteMutation = useDeleteV1FinancialRecordsId({
    mutation: {
      onSuccess: async () => {
        await Promise.all([
          qc.invalidateQueries({
            queryKey: getV1FinancialRecordsQueryKey(),
          }),
          qc.invalidateQueries({
            queryKey: getV1FinancialSummaryQueryKey(),
          }),
        ]);

        setDeleteOpen(false);
      },
    },
  });

  return (
    <>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" />
        </Button>

        <Button variant="ghost" size="icon" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>

      <FinancialFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        record={record}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir lançamento?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Esta ação não poderá ser desfeita.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>

            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate({ id: record.id })}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
