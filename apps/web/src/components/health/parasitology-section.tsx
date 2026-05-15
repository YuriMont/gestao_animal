import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Activity,
  AlertTriangle,
  Bug,
  Calendar,
  Droplets,
  FileText,
  TrendingDown,
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
import { useGetV1ParasitologyAnimalAnimalid } from "@/gen/hooks/parasiteMonitoringController/useGetV1ParasitologyAnimalAnimalid";

interface ParasitologySectionProps {
  animalId: string;
}

const FAMACHA_CONFIG = {
  0: {
    label: "N/A",
    color: "bg-slate-400",
    text: "text-slate-400",
    desc: "Não se aplica",
  },
  1: {
    label: "1",
    color: "bg-red-600",
    text: "text-red-600",
    desc: "Vermelho intenso",
  },
  2: {
    label: "2",
    color: "bg-red-500",
    text: "text-red-500",
    desc: "Vermelho rosado",
  },
  3: {
    label: "3",
    color: "bg-red-400",
    text: "text-red-400",
    desc: "Rosado claro",
  },
  4: {
    label: "4",
    color: "bg-red-300",
    text: "text-red-300",
    desc: "Muito pálido",
  },
  5: {
    label: "5",
    color: "bg-red-200",
    text: "text-red-200",
    desc: "Quase branco",
  },
};

function getOPGStatus(opg: number | null): { label: string; color: string } {
  if (opg === null) return { label: "Sem dados", color: "text-slate-400" };
  if (opg < 500) return { label: "Baixo", color: "text-emerald-600" };
  if (opg < 1000) return { label: "Moderado", color: "text-amber-600" };
  return { label: "Alto", color: "text-red-600" };
}

export function ParasitologySection({ animalId }: ParasitologySectionProps) {
  const { data, isLoading } = useGetV1ParasitologyAnimalAnimalid(animalId);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
            <Bug className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Monitoramento Parasitológico
            </h3>
            <p className="text-xs text-muted-foreground">
              Avaliação FAMACHA e carga parasitária (OPG)
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
            <Bug className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Monitoramento Parasitológico
            </h3>
            <p className="text-xs text-muted-foreground">
              Avaliação FAMACHA e carga parasitária (OPG)
            </p>
          </div>
        </div>
        <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full mb-4">
              <Bug className="size-8 text-amber-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Nenhum registro parasitológico
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Use "Parasitologia" no modal de registro para adicionar
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const latest = data[0];
  const opgStatus = getOPGStatus(latest.opg);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
            <Bug className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Monitoramento Parasitológico
            </h3>
            <p className="text-xs text-muted-foreground">
              Avaliação FAMACHA e carga parasitária (OPG)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Activity className="size-3" />
          <span>
            {data.length} registro{data.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="size-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                FAMACHA
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg ${
                  FAMACHA_CONFIG[latest.famacha as keyof typeof FAMACHA_CONFIG]
                    ?.color || "bg-slate-400"
                }`}
              >
                {latest.famacha ?? "-"}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {FAMACHA_CONFIG[latest.famacha as keyof typeof FAMACHA_CONFIG]
                    ?.desc || "Sem dados"}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {latest.famacha === null
                    ? "Sem dados"
                    : latest.famacha === 0
                      ? "Não aplicável"
                      : latest.famacha <= 2
                        ? "✓ Satisfatório"
                        : "⚠ Atenção"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-950/20 border-slate-200/50 dark:border-slate-800/30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="size-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Carga Parasitária
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  {latest.opg ?? "-"}
                </p>
                <p className="text-xs text-slate-500">ovos por grama</p>
              </div>
              <div
                className={`text-right px-3 py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 ${opgStatus.color}`}
              >
                <p className="text-sm font-bold">{opgStatus.label}</p>
                <p className="text-xs opacity-75">risco</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border-emerald-200/50 dark:border-emerald-800/30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="size-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Próximo Exame
              </span>
            </div>
            <div>
              {latest.nextParasiteCheck ? (
                <>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {format(new Date(latest.nextParasiteCheck), "dd MMM", {
                      locale: ptBR,
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {format(new Date(latest.nextParasiteCheck), "yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs">
                    <AlertTriangle className="size-3" />
                    <span>Agendar coleta</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-lg font-medium text-slate-400">-</p>
                  <p className="text-xs text-slate-400">Não agendado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {latest.observation && (
        <Card className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="size-4 text-slate-500" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="max-h-32 overflow-y-auto">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {latest.observation}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.length > 1 && (
        <div className="mt-6">
          <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
            Histórico recente
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
            {data.slice(1, 6).map((record) => {
              const config =
                FAMACHA_CONFIG[record.famacha as keyof typeof FAMACHA_CONFIG];
              return (
                <div
                  key={record.id}
                  className="flex-shrink-0 w-20 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center"
                >
                  <p className="text-xs text-slate-500">
                    {format(new Date(record.date), "dd/MM")}
                  </p>
                  <div
                    className={`w-8 h-8 rounded-full mx-auto mt-2 mb-1 flex items-center justify-center text-white text-sm font-bold ${
                      config?.color || "bg-slate-400"
                    }`}
                  >
                    {record.famacha ?? "-"}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {record.opg || "-"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
              <Activity className="size-4" />
            </div>
            <h4 className="text-base font-semibold">Registro Completo</h4>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                    Data
                  </TableHead>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                    FAMACHA
                  </TableHead>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                    OPG
                  </TableHead>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                    Próximo Exam
                  </TableHead>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                    Observações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((record) => {
                  const config =
                    FAMACHA_CONFIG[
                      record.famacha as keyof typeof FAMACHA_CONFIG
                    ];
                  const opgInfo = getOPGStatus(record.opg);
                  return (
                    <TableRow
                      key={record.id}
                      className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                    >
                      <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                        {format(new Date(record.date), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              config?.color || "bg-slate-400"
                            }`}
                          >
                            {record.famacha ?? "-"}
                          </div>
                          <span className="text-xs text-slate-500">
                            {config?.desc || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300">
                            {record.opg ?? "-"}
                          </span>
                          {record.opg !== null && (
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium ${opgInfo.color}`}
                            >
                              {opgInfo.label}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.nextParasiteCheck ? (
                          <div className="flex items-center gap-1 text-amber-600 text-sm">
                            <Calendar className="size-3" />
                            {format(
                              new Date(record.nextParasiteCheck),
                              "dd/MM/yyyy",
                              { locale: ptBR },
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {record.observation ? (
                          <p
                            className="text-sm text-slate-500 truncate"
                            title={record.observation}
                          >
                            {record.observation}
                          </p>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </section>
  );
}
