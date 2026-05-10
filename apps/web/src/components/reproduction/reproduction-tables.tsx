import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Activity,
  AlertCircle,
  Baby,
  Calendar,
  CheckCircle2,
  Clock,
  Flower,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GetV1ReproductionHistoryAnimalid200 } from "@/gen/models/reproductionController/GetV1ReproductionHistoryAnimalid";

interface ReproductionStatsProps {
  births: number;
  inseminations: number;
  estrusCycles: number;
  pregnantAnimals: number;
  loading: boolean;
}

export function ReproductionStats({
  births,
  inseminations,
  estrusCycles,
  pregnantAnimals,
  loading,
}: ReproductionStatsProps) {
  const stats = [
    {
      label: "Gestações Ativas",
      value: pregnantAnimals,
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-100 dark:bg-rose-900/30",
    },
    {
      label: "Partos Registrados",
      value: births,
      icon: Baby,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Inseminações",
      value: inseminations,
      icon: Activity,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      label: "Ciclos de Cio",
      value: estrusCycles,
      icon: Flower,
      color: "text-violet-500",
      bg: "bg-violet-100 dark:bg-violet-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground truncate">
                {stat.label}
              </CardTitle>
              <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-bold">{stat.value}</span>
            )}
          </CardContent>
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 ${stat.bg.replace(
              "/30",
              "",
            )}`}
          />
        </Card>
      ))}
    </div>
  );
}

interface PregnanciesTableProps {
  pregnancies: GetV1ReproductionHistoryAnimalid200["pregnancies"];
  loading: boolean;
}

export function PregnanciesTable({
  pregnancies,
  loading,
}: PregnanciesTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            Confirmada
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="size-3" />
            Pendente
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle2 className="size-3" />
            Concluída
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="size-3" />
            Falhou
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
          <TableRow>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Animal
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Detecção
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Previsão Parto
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
              </TableRow>
            ))
          ) : pregnancies.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground h-40"
              >
                <div className="flex flex-col items-center gap-2 py-8">
                  <Heart className="size-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm">Nenhuma gestação registrada</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            pregnancies.map((p) => (
              <TableRow
                key={p.id}
                className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              >
                <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                  {p.animalId ?? "—"}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3 opacity-50" />
                    {format(new Date(p.detectedDate), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  {p.expectedDate ? (
                    <span className="text-emerald-600 font-medium">
                      {format(new Date(p.expectedDate), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-xs">
                      Não definida
                    </span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(p.status.key)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface BirthsTableProps {
  births: GetV1ReproductionHistoryAnimalid200["births"];
  loading: boolean;
}

export function BirthsTable({ births, loading }: BirthsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            Bem-sucedido
          </Badge>
        );
      case "STILLBIRTH":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="size-3" />
            Natimorto
          </Badge>
        );
      case "ABORTION":
        return (
          <Badge variant="warning" className="gap-1">
            <AlertCircle className="size-3" />
            Aborto
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
          <TableRow>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Mãe
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Pai
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Data do Parto
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
              </TableRow>
            ))
          ) : births.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground h-40"
              >
                <div className="flex flex-col items-center gap-2 py-8">
                  <Baby className="size-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm">Nenhum parto registrado</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            births.map((b) => (
              <TableRow
                key={b.id}
                className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              >
                <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                  {b.motherId ?? "—"}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">
                  {b.fatherId ?? "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="size-3 opacity-50" />
                    {format(new Date(b.birthDate), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(b.status.key)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface EstrusTableProps {
  estrus: GetV1ReproductionHistoryAnimalid200["estrus"];
  loading: boolean;
}

export function EstrusTable({ estrus, loading }: EstrusTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
          <TableRow>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Animal
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Início
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Fim
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Observações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-40" />
                </TableCell>
              </TableRow>
            ))
          ) : estrus.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground h-40"
              >
                <div className="flex flex-col items-center gap-2 py-8">
                  <Flower className="size-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm">Nenhum cio registrado</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            estrus.map((e) => (
              <TableRow
                key={e.id}
                className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              >
                <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                  {e.animalId ?? "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="size-3 opacity-50" />
                    {format(new Date(e.startDate), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  {e.endDate ? (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="size-3 opacity-50" />
                      {format(new Date(e.endDate), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </div>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="size-3" />
                      Em andamento
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-slate-500 max-w-xs truncate italic">
                  {e.observation || "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface InseminationsTableProps {
  inseminations: GetV1ReproductionHistoryAnimalid200["inseminations"];
  loading: boolean;
}

export function InseminationsTable({
  inseminations,
  loading,
}: InseminationsTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
          <TableRow>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Animal
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Tipo
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Data
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Pai/Lote
            </TableHead>
            <TableHead className="font-medium text-slate-600 dark:text-slate-400">
              Sucesso
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
              </TableRow>
            ))
          ) : inseminations.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground h-40"
              >
                <div className="flex flex-col items-center gap-2 py-8">
                  <Activity className="size-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm">Nenhuma inseminação registrada</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            inseminations.map((i) => (
              <TableRow
                key={i.id}
                className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
              >
                <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                  {i.animalId ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{i.type.label}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Calendar className="size-3 opacity-50" />
                    {format(new Date(i.date), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500">
                  {i.fatherId || i.semenBatch || "—"}
                </TableCell>
                <TableCell>
                  {i.success === null || i.success === undefined ? (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="size-3" />
                      Pendente
                    </Badge>
                  ) : i.success ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="size-3" />
                      Sucesso
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="size-3" />
                      Falhou
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface ReproductionHistoryTablesProps {
  data: GetV1ReproductionHistoryAnimalid200;
  loading: boolean;
}

export function ReproductionHistoryTables({
  data,
  loading,
}: ReproductionHistoryTablesProps) {
  const { estrus, pregnancies, births, inseminations } = data;

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600">
            <Heart className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Gestações</h3>
            <p className="text-xs text-muted-foreground">
              Acompanhamento de prenhez e previsão de parto
            </p>
          </div>
        </div>
        <PregnanciesTable pregnancies={pregnancies} loading={loading} />
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
            <Baby className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Partos</h3>
            <p className="text-xs text-muted-foreground">
              Registro de nascimentos e situações ao nascer
            </p>
          </div>
        </div>
        <BirthsTable births={births} loading={loading} />
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600">
            <Flower className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Ciclos de Cio</h3>
            <p className="text-xs text-muted-foreground">
              Monitoramento de estro e períodos férteis
            </p>
          </div>
        </div>
        <EstrusTable estrus={estrus} loading={loading} />
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
            <Activity className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Inseminações</h3>
            <p className="text-xs text-muted-foreground">
              Controle de inseminações artificiais e naturais
            </p>
          </div>
        </div>
        <InseminationsTable inseminations={inseminations} loading={loading} />
      </section>
    </div>
  );
}
