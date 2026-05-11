import { Droplets, Scale, Shield, Syringe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductionHealthStatsProps {
  totalMilk: number | null;
  averageWeight: number | null;
  activeTreatments: number;
  vaccinesDue: number;
  loading: boolean;
}

export function ProductionHealthStats({
  totalMilk,
  averageWeight,
  activeTreatments,
  vaccinesDue,
  loading,
}: ProductionHealthStatsProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-base sm:text-lg font-semibold text-foreground px-1">
        Produção & Saúde
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <Droplets className="size-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Produção de Leite
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold font-display">
                    {totalMilk != null ? `${totalMilk.toFixed(0)} L` : "—"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  total registrado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-violet-500/10">
                <Scale className="size-6 text-violet-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Peso Médio
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-2xl font-bold font-display">
                    {averageWeight != null
                      ? `${averageWeight.toFixed(0)} kg`
                      : "—"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">rebanho</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10">
                <Syringe className="size-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Vacinas Pendentes
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold font-display">
                    {vaccinesDue}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">a vencer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/10">
                <Shield className="size-6 text-rose-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Em Tratamento
                </p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold font-display">
                    {activeTreatments}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">animais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
