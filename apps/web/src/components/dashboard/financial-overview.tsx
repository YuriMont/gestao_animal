import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FinancialOverviewProps {
  totalRevenue: number;
  totalCost: number;
  balance: number;
  loading: boolean;
}

export function FinancialOverview({
  totalRevenue,
  totalCost,
  balance,
  loading,
}: FinancialOverviewProps) {
  const maxValue = Math.max(totalRevenue, totalCost);
  const revenuePercent = maxValue > 0 ? (totalRevenue / maxValue) * 100 : 50;
  const costPercent = maxValue > 0 ? (totalCost / maxValue) * 100 : 30;
  const isPositive = balance >= 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-base">
            Visão Financeira
          </CardTitle>
          <div className="p-2 rounded-xl bg-primary/10">
            <TrendingUp className="size-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Receitas</span>
                <span className="font-semibold font-display text-[var(--success)]">
                  R${" "}
                  {totalRevenue.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--success)] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${revenuePercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Despesas</span>
                <span className="font-semibold font-display text-destructive">
                  R${" "}
                  {totalCost.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-destructive rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${costPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Balanço
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-bold font-display",
                      isPositive ? "text-[var(--success)]" : "text-destructive",
                    )}
                  >
                    R${" "}
                    {Math.abs(balance).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
                    isPositive
                      ? "bg-[var(--success)]/10 text-[var(--success)]"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {isPositive ? (
                    <ArrowUpRight className="size-4" />
                  ) : (
                    <ArrowDownRight className="size-4" />
                  )}
                  {isPositive ? "Superávit" : "Déficit"}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
