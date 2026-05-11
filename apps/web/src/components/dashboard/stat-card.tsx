import { Activity, Beef, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  trendLabel?: string;
  loading?: boolean;
  color?: "primary" | "success" | "warning" | "destructive";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  loading,
  color = "primary",
}: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-[var(--success)]/10 text-[var(--success)]",
    warning: "bg-[var(--warning)]/10 text-[var(--warning)]",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            {loading ? (
              <Skeleton className="h-9 w-28" />
            ) : (
              <p className="text-3xl font-bold font-display tracking-tight">
                {value}
              </p>
            )}
            {trend && trendLabel && !loading && (
              <div
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium",
                  trend === "up" ? "text-[var(--success)]" : "text-destructive",
                )}
              >
                {trend === "up" ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <svg
                    className="size-3 rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 8l-5-5-5 5" />
                  </svg>
                )}
                {trendLabel}
              </div>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110",
              colorClasses[color],
            )}
          >
            <Icon className="size-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickStatsProps {
  totalAnimals: number;
  activeAnimals: number;
  revenue: number;
  balance: number;
  loading: boolean;
}

export function QuickStats({
  totalAnimals,
  activeAnimals,
  revenue,
  balance,
  loading,
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        title="Total"
        value={totalAnimals}
        icon={Beef}
        color="primary"
        loading={loading}
      />
      <StatCard
        title="Ativos"
        value={activeAnimals}
        icon={Activity}
        color="success"
        loading={loading}
      />
      <StatCard
        title="Receita"
        value={`R$ ${revenue.toLocaleString("pt-BR", { minimumFractionDigits: 0, notation: "compact" })}`}
        icon={TrendingUp}
        color="warning"
        loading={loading}
      />
      <StatCard
        title="Balanço"
        value={`R$ ${Math.abs(balance).toLocaleString("pt-BR", { minimumFractionDigits: 0, notation: "compact" })}`}
        icon={DollarSign}
        color={balance >= 0 ? "success" : "destructive"}
        loading={loading}
        trend={balance >= 0 ? "up" : "down"}
        trendLabel={balance >= 0 ? "+" : "-"}
      />
    </div>
  );
}
