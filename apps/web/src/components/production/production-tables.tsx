import { Calendar, MilkIcon, Scale, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GetV1ProductionMetricsAnimalid200 } from "@/gen/models/productionController/GetV1ProductionMetricsAnimalid";

interface ProductionTablesProps {
  data: GetV1ProductionMetricsAnimalid200 | undefined;
  loading: boolean;
  showMilk?: boolean;
}

export function ProductionTables({
  data,
  loading,
  showMilk = true,
}: ProductionTablesProps) {
  return (
    <div className="space-y-12">
      {showMilk && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
              <MilkIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Produção de Leite</h3>
              <p className="text-xs text-muted-foreground">
                Registro de ordenhas e volumes produzidos
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                    Total Produzido
                  </TableHead>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                    Última Ordenha
                  </TableHead>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 1 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : !data ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground h-32"
                    >
                      <p className="text-sm">
                        Selecione um animal para ver os dados.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="size-4 text-emerald-600" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {data.totalMilk.toFixed(1)} L
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {data.lastMilk != null ? (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Calendar className="size-3 opacity-50" />
                          {data.lastMilk.toFixed(1)} L
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">
                          Nenhuma ordenha registrada
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {data.totalMilk > 0 ? (
                        <Badge variant="success" className="gap-1">
                          Em produção
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          Sem registros
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
            <Scale className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Pesagem</h3>
            <p className="text-xs text-muted-foreground">
              Histórico de peso e ganho ponderal
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Peso Médio
                </TableHead>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Último Peso
                </TableHead>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 1 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : !data ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground h-32"
                  >
                    <p className="text-sm">
                      Selecione um animal para ver os dados.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-4 text-violet-600" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {data.averageWeight.toFixed(1)} kg
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {data.lastWeight != null ? (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Calendar className="size-3 opacity-50" />
                        {data.lastWeight.toFixed(1)} kg
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">
                        Nenhuma pesagem registrada
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {data.lastWeight != null ? (
                      <Badge variant="secondary" className="gap-1">
                        Pesado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        Sem registros
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
