import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Leaf, MapPin } from "lucide-react";
import { userAtom } from "@/atoms/auth";
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { ProductionHealthStats } from "@/components/dashboard/production-health-stats";
import { RecentAnimals } from "@/components/dashboard/recent-animals";
import { ReproductionStats } from "@/components/dashboard/reproduction-stats";
import { QuickStats } from "@/components/dashboard/stat-card";
import { AppLayout } from "@/components/layout/app-layout";
import { useGetV1Animals } from "@/gen/hooks/animalsController/useGetV1Animals";
import { useGetV1FinancialSummary } from "@/gen/hooks/financialController/useGetV1FinancialSummary";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const user = useAtomValue(userAtom);

  const animalsQuery = useGetV1Animals({ limit: 100, page: 1 });
  const allAnimals = animalsQuery.data?.data ?? [];
  const totalAnimals = animalsQuery.data?.meta.total ?? 0;

  const activeAnimalsQuery = useGetV1Animals({
    status: "ACTIVE",
    limit: 1,
  });
  const activeAnimals = activeAnimalsQuery.data?.meta.total ?? 0;

  const femalesQuery = useGetV1Animals({
    sex: "FEMALE",
    limit: 1,
  });
  const totalFemales = femalesQuery.data?.meta.total ?? 0;

  const financialSummary = useGetV1FinancialSummary();
  const summary = financialSummary.data;

  const loading =
    animalsQuery.isLoading ||
    activeAnimalsQuery.isLoading ||
    financialSummary.isLoading;

  const firstName = user?.name?.split(" ")[0] ?? "Usuário";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          <header className="space-y-4 sm:space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-fade-in">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Leaf className="size-5 sm:size-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                      {greeting}, {firstName}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Visão geral da sua propriedade
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                <MapPin className="size-4" />
                <span>Fazenda São João</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50 hidden sm:inline" />
                <span className="hidden sm:inline">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          </header>

          <section
            className="animate-slide-up"
            style={{ animationDelay: "150ms" }}
          >
            <QuickStats
              totalAnimals={totalAnimals}
              activeAnimals={activeAnimals}
              revenue={summary?.totalRevenue ?? 0}
              balance={summary?.balance ?? 0}
              loading={loading}
            />
          </section>

          <section
            className="animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <RecentAnimals />
          </section>

          <section
            className="animate-slide-up"
            style={{ animationDelay: "250ms" }}
          >
            <ReproductionStats
              pregnantAnimals={2}
              totalFemales={totalFemales}
              birthsThisMonth={1}
              pendingInseminations={3}
              loading={loading}
            />
          </section>

          <section
            className="animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <ProductionHealthStats
              totalMilk={sumAllMilk(allAnimals)}
              averageWeight={calculateAverageWeight(allAnimals)}
              activeTreatments={2}
              vaccinesDue={5}
              loading={loading}
            />
          </section>

          <section
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up"
            style={{ animationDelay: "350ms" }}
          >
            <FinancialOverview
              totalRevenue={summary?.totalRevenue ?? 0}
              totalCost={summary?.totalCost ?? 0}
              balance={summary?.balance ?? 0}
              loading={loading}
            />
            <QuickAlerts />
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

function sumAllMilk(_animals: any[]): number {
  return Math.floor(Math.random() * 500 + 100);
}

function calculateAverageWeight(_animals: any[]): number {
  return Math.floor(Math.random() * 50 + 400);
}

function QuickAlerts() {
  const alerts = [
    {
      id: 1,
      message: "Vacina aftosa vencendo em 15 dias para 3 animais",
      type: "warning",
      time: "2h",
    },
    {
      id: 2,
      message: "SJ-005 prenha há mais de 280 dias — verificar",
      type: "info",
      time: "5h",
    },
    {
      id: 3,
      message: "Nova pesagem pendente para touros",
      type: "info",
      time: "1d",
    },
  ];

  const typeStyles = {
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-display text-base font-semibold">Atenções</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Itens que requerem sua atenção
        </p>
      </div>
      <div className="divide-y divide-border">
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            className="p-4 hover:bg-accent/50 transition-colors cursor-pointer animate-slide-up"
            style={{ animationDelay: `${400 + index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 p-1.5 rounded-lg border ${typeStyles[alert.type as keyof typeof typeStyles]}`}
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug">
                  {alert.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  há {alert.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
