import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { History, MilkIcon, Plus, Scale } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { MilkForm } from "@/components/production/milk-form";
import { ProductionStats } from "@/components/production/production-stats";
import { ProductionTables } from "@/components/production/production-tables";
import { WeightForm } from "@/components/production/weight-form";
import { AnimalSelect } from "@/components/reproduction/animal-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetV1ProductionMetricsAnimalid } from "@/gen/hooks/productionController/useGetV1ProductionMetricsAnimalid";

export const Route = createFileRoute("/production")({
  component: ProductionPage,
});

function ProductionPage() {
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetV1ProductionMetricsAnimalid(
    selectedAnimal,
    {
      query: { enabled: !!selectedAnimal },
    },
  );

  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <PageHeader
          title="Produção"
          description="Registre pesos e produção de leite do rebanho"
        >
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 h-10 touch-target text-sm sm:text-base"
          >
            <Plus className="size-4" />
            <span className="hidden xs:inline">Lançar Registro</span>
            <span className="xs:hidden">Novo</span>
          </Button>
        </PageHeader>
        <div className="p-4 sm:p-6 mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Scale className="size-5 text-emerald-600" />
                  Gestão de Produção
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione um animal para acessar o histórico de produção
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full sm:max-w-xs">
                <label
                  htmlFor="production-animal-select"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Animal
                </label>
                <AnimalSelect
                  id="production-animal-select"
                  value={selectedAnimal}
                  onChange={setSelectedAnimal}
                  className="touch-target"
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <div className="mt-0 outline-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {!selectedAnimal ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center gap-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 mx-auto w-full">
                      <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                        <History className="size-12 text-emerald-600" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-medium">
                          Nenhum animal selecionado
                        </p>
                        <p className="text-muted-foreground max-w-xs">
                          Selecione um animal acima para visualizar o histórico
                          de produção completo, incluindo pesagens e ordenhas.
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Scale className="size-4 text-violet-500" />
                          Pesagem
                        </div>
                        <div className="text-lg">→</div>
                        <div className="flex items-center gap-2">
                          <MilkIcon className="size-4 text-emerald-500" />
                          Ordenha
                        </div>
                      </div>
                    </div>
                  ) : isLoading ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton key={i} className="h-24 rounded-2xl" />
                        ))}
                      </div>
                      <Skeleton className="rounded-2xl border h-64 w-full" />
                      <Skeleton className="rounded-2xl border h-64 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <ProductionStats
                        totalMilk={data?.totalMilk ?? null}
                        averageWeight={data?.averageWeight ?? null}
                        lastWeight={data?.lastWeight ?? null}
                        lastMilk={data?.lastMilk ?? null}
                        loading={isLoading}
                      />

                      <ProductionTables data={data} loading={isLoading} />
                    </div>
                  )}
                </motion.div>
              </div>
            </AnimatePresence>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl w-full mx-auto max-h-[85vh] sm:max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Novo Registro de Produção</DialogTitle>
            </DialogHeader>
            {!selectedAnimal ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                <History className="size-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Selecione um animal primeiro para registrar produção ou peso.
                </p>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Fechar
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="milk" className="w-full">
                <TabsList className="w-full justify-start bg-slate-100 dark:bg-slate-800 gap-1">
                  <TabsTrigger
                    value="milk"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600"
                  >
                    <MilkIcon className="size-4 mr-2" />
                    Ordenha
                  </TabsTrigger>
                  <TabsTrigger
                    value="weight"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600"
                  >
                    <Scale className="size-4 mr-2" />
                    Pesagem
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="milk" className="mt-4">
                  <MilkForm
                    animalId={selectedAnimal}
                    onSuccess={() => setIsModalOpen(false)}
                  />
                </TabsContent>
                <TabsContent value="weight" className="mt-4">
                  <WeightForm
                    animalId={selectedAnimal}
                    onSuccess={() => setIsModalOpen(false)}
                  />
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
