import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  getV1FinancialRecordsQueryKey,
  useGetV1FinancialRecords,
} from "@/gen/hooks/financialController/useGetV1FinancialRecords";
import {
  getV1FinancialSummaryQueryKey,
  useGetV1FinancialSummary,
} from "@/gen/hooks/financialController/useGetV1FinancialSummary";
import { usePostV1FinancialRecords } from "@/gen/hooks/financialController/usePostV1FinancialRecords";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/financial")({
  component: FinancialPage,
});

function FinancialPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "COST" as "COST" | "REVENUE",
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const [typeFilter, setTypeFilter] = useState("all");

  const recordsQuery = useGetV1FinancialRecords();
  const summaryQuery = useGetV1FinancialSummary();
  const allRecords: any[] = Array.isArray(recordsQuery.data)
    ? (recordsQuery.data as any).data
    : [];
  const records =
    typeFilter === "all"
      ? allRecords
      : allRecords.filter((r: any) => r.type === typeFilter);
  const summary = summaryQuery.data as any;

  const createMutation = usePostV1FinancialRecords({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getV1FinancialRecordsQueryKey() });
        qc.invalidateQueries({ queryKey: getV1FinancialSummaryQueryKey() });
        setOpen(false);
        setForm({
          type: "COST",
          category: "",
          amount: "",
          date: "",
          description: "",
        });
      },
    },
  });

  function fmt(n: number) {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title="Financeiro"
          description="Controle receitas, custos e saúde financeira"
        >
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Novo Lançamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Lançamento Financeiro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Tipo *</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) =>
                        setForm({ ...form, type: v as "COST" | "REVENUE" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="REVENUE">Receita</SelectItem>
                        <SelectItem value="COST">Custo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Categoria *</Label>
                    <Input
                      placeholder="Ex: Venda de gado"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Valor (R$) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Data *</Label>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Detalhes..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  disabled={
                    createMutation.isPending ||
                    !form.category ||
                    !form.amount ||
                    !form.date
                  }
                  onClick={() =>
                    createMutation.mutate({
                      data: {
                        type: form.type,
                        category: form.category,
                        amount: Number(form.amount),
                        date: form.date,
                        description: form.description || undefined,
                      },
                    })
                  }
                >
                  {createMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Receita Total
                  </CardTitle>
                  <TrendingUp className="size-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                {summaryQuery.isLoading ? (
                  <Skeleton className="h-7 w-32" />
                ) : (
                  <p className="text-2xl font-bold text-primary">
                    {summary ? fmt(summary.totalRevenue) : "—"}
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Custos Totais
                  </CardTitle>
                  <TrendingDown className="size-4 text-destructive" />
                </div>
              </CardHeader>
              <CardContent>
                {summaryQuery.isLoading ? (
                  <Skeleton className="h-7 w-32" />
                ) : (
                  <p className="text-2xl font-bold text-destructive">
                    {summary ? fmt(summary.totalCost) : "—"}
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Lucro Líquido
                  </CardTitle>
                  <DollarSign className="size-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {summaryQuery.isLoading ? (
                  <Skeleton className="h-7 w-32" />
                ) : (
                  <p
                    className={`text-2xl font-bold ${summary && summary.netProfit >= 0 ? "text-primary" : "text-destructive"}`}
                  >
                    {summary ? fmt(summary.netProfit) : "—"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="REVENUE">Receitas</SelectItem>
                <SelectItem value="COST">Custos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              {recordsQuery.isLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : records.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                  <DollarSign className="size-8 opacity-30" />
                  <p className="text-sm">Nenhum lançamento encontrado</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((r: any) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <Badge
                            variant={
                              r.type === "REVENUE" ? "success" : "destructive"
                            }
                          >
                            {r.type === "REVENUE" ? "Receita" : "Custo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.category}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {r.description ?? "—"}
                        </TableCell>
                        <TableCell>
                          {new Date(r.date).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${r.type === "REVENUE" ? "text-primary" : "text-destructive"}`}
                        >
                          {fmt(r.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
