import { DollarSign, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useGetV1EnumsFinancialTypes } from "@/gen/hooks/enumsController/useGetV1EnumsFinancialTypes";
import { useGetV1FinancialRecords } from "@/gen/hooks/financialController/useGetV1FinancialRecords";
import { FinancialActions } from "./financial-form-dialog";

export function FinancialTable() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { data: financialTypes } = useGetV1EnumsFinancialTypes();
  const recordsQuery = useGetV1FinancialRecords();
  const records = recordsQuery.data?.data ?? [];

  const filteredRecords = records
    .filter((r) => typeFilter === "all" || r.type.key === typeFilter)
    .filter(
      (r) =>
        search === "" ||
        r.description?.toLowerCase().includes(search.toLowerCase()) ||
        r.category.label.toLowerCase().includes(search.toLowerCase()),
    );

  function fmt(n: number) {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {financialTypes?.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
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
          ) : filteredRecords.length === 0 ? (
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
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Badge
                        variant={
                          r.type.key === "INCOME" ? "success" : "destructive"
                        }
                      >
                        {r.type.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.category.label}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      {new Date(r.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${r.type.key === "INCOME" ? "text-primary" : "text-destructive"}`}
                    >
                      {fmt(r.amount)}
                    </TableCell>
                    <TableCell>
                      <FinancialActions
                        record={{
                          ...r,
                          description: r.description ?? undefined,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
