import { Baby, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressRing } from "./progress-ring";

interface ReproductionStatsProps {
  pregnantAnimals: number;
  totalFemales: number;
  birthsThisMonth: number;
  pendingInseminations: number;
  loading: boolean;
}

export function ReproductionStats({
  pregnantAnimals,
  totalFemales,
  birthsThisMonth,
  pendingInseminations,
  loading,
}: ReproductionStatsProps) {
  const pregnancyRate =
    totalFemales > 0 ? (pregnantAnimals / totalFemales) * 100 : 0;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-foreground">
        Reprodução
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Taxa de Prenhez
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold font-display">
                    {pregnancyRate.toFixed(0)}%
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {pregnantAnimals} de {totalFemales} fêmeas
                </p>
              </div>
              <ProgressRing value={pregnancyRate} size={70} strokeWidth={6}>
                <Baby className="size-5 text-primary" />
              </ProgressRing>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Em Gestação
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold font-display">
                    {pregnantAnimals}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">fêmeas prenhas</p>
              </div>
              <div className="p-3 rounded-2xl bg-primary/10">
                <CheckCircle2 className="size-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Partos (Mês)
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold font-display">
                    {birthsThisMonth}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">nascimentos</p>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--success)]/10">
                <Calendar className="size-6 text-[var(--success)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Inseminações Pendentes
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold font-display">
                    {pendingInseminations}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  aguardando confirmação
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--warning)]/10">
                <Clock className="size-6 text-[var(--warning)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
