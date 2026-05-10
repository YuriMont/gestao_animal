import { Activity, Milk, Scale, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductionStatsProps {
  totalMilk: number | null;
  averageWeight: number | null;
  lastWeight: number | null;
  lastMilk: number | null;
  loading: boolean;
}

export function ProductionStats({
  totalMilk,
  averageWeight,
  lastWeight,
  lastMilk,
  loading,
}: ProductionStatsProps) {
  const stats = [
    {
      label: "Total Produzido",
      value: totalMilk != null ? `${totalMilk.toFixed(1)} L` : "—",
      icon: Milk,
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Última Ordenha",
      value: lastMilk != null ? `${lastMilk.toFixed(1)} L` : "—",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Peso Médio",
      value: averageWeight != null ? `${averageWeight.toFixed(1)} kg` : "—",
      icon: Scale,
      color: "text-violet-500",
      bg: "bg-violet-100 dark:bg-violet-900/30",
    },
    {
      label: "Último Peso",
      value: lastWeight != null ? `${lastWeight.toFixed(1)} kg` : "—",
      icon: Activity,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30",
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
              <Skeleton className="h-8 w-20" />
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
