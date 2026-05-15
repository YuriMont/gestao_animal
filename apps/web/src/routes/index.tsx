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
            className="grid grid-cols-1 gap-6 animate-slide-up"
            style={{ animationDelay: "350ms" }}
          >
            <FinancialOverview
              totalRevenue={summary?.totalRevenue ?? 0}
              totalCost={summary?.totalCost ?? 0}
              balance={summary?.balance ?? 0}
              loading={loading}
            />
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
