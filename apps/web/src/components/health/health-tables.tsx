import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ClipboardList, Stethoscope, Syringe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GetV1HealthHistoryAnimalid200 } from "@/gen/models/healthController/GetV1HealthHistoryAnimalid";

interface HealthTablesProps {
  data: GetV1HealthHistoryAnimalid200;
}

export function HealthTables({ data }: HealthTablesProps) {
  const { vaccines, treatments, records } = data;

  return (
    <div className="space-y-12 mt-4">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
            <Syringe className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Plano Vacinal</h3>
            <p className="text-xs text-muted-foreground">
              Histórico de imunizações e doses programadas
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Vacina
                </TableHead>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Dose
                </TableHead>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Data Aplicação
                </TableHead>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Próxima Dose
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vaccines.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground h-32"
                  >
                    <p className="text-sm">
                      Nenhuma vacina registrada para este paciente.
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {vaccines.map((v, _idx) => (
                <TableRow
                  key={v.id}
                  className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                    {v.vaccineName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {v.doseNumber}ª dose
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {format(new Date(v.dateAdministered), "dd MMM yyyy", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>
                    {v.nextDueDate ? (
                      <div className="flex items-center gap-2 text-emerald-600 font-medium">
                        <Calendar className="size-3" />
                        {format(new Date(v.nextDueDate), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-xs">
                        Ciclo completo
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
            <Stethoscope className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Intervenções Terapêuticas</h3>
            <p className="text-xs text-muted-foreground">
              Tratamentos medicados e diagnósticos clínicos
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Diagnóstico
                </TableHead>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Medicação
                </TableHead>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Dosagem
                </TableHead>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Período
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treatments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground h-32"
                  >
                    <p className="text-sm">Nenhum tratamento registrado.</p>
                  </TableCell>
                </TableRow>
              )}
              {treatments.map((t, _idx) => (
                <TableRow
                  key={t.id}
                  className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="font-semibold text-slate-700 dark:text-slate-300">
                    {t.diagnosis}
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-600 dark:text-slate-400">
                      {t.medication}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {t.dosage || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3 opacity-50" />
                      {format(new Date(t.startDate), "dd/MM/yy", {
                        locale: ptBR,
                      })}
                      {t.endDate &&
                        ` → ${format(new Date(t.endDate), "dd/MM/yy", { locale: ptBR })}`}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600">
            <ClipboardList className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Observações Clínicas</h3>
            <p className="text-xs text-muted-foreground">
              Outras ocorrências, exames e notas de campo
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400 w-32">
                  Data
                </TableHead>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Ocorrência
                </TableHead>
                <TableHead className="font-medium text-slate-600 dark:text-slate-400">
                  Notas
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground h-32"
                  >
                    <p className="text-sm">
                      Nenhum registro clínico encontrado.
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {records.map((r) => (
                <TableRow
                  key={r.id}
                  className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="text-slate-500 tabular-nums">
                    {format(new Date(r.date), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                    {r.description}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 max-w-md italic text-sm">
                    {r.observation || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
