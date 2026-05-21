import { createFileRoute, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Baby,
  ChevronRight,
  Flower,
  Heart,
  History,
  Pipette,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { AnimalSelect } from "@/components/reproduction/animal-select";
import { BirthForm } from "@/components/reproduction/birth-form";
import { EstrusForm } from "@/components/reproduction/estrus-form";
import { InseminationForm } from "@/components/reproduction/insemination-form";
import { PregnancyForm } from "@/components/reproduction/pregnancy-form";
import {
  ReproductionHistoryTables,
  ReproductionStats,
} from "@/components/reproduction/reproduction-tables";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetV1ReproductionHistoryAnimalid } from "@/gen/hooks/reproductionController/useGetV1ReproductionHistoryAnimalid";

export const Route = createFileRoute("/reproduction")({
  component: ReproductionPage,
  validateSearch: (search: Record<string, unknown>) => ({
    animalId: search.animalId as string | undefined,
  }),
});

function ReproductionPage() {
  const search = useSearch({ from: "/reproduction" });
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetV1ReproductionHistoryAnimalid(
    selectedAnimal || "all",
    {
      query: { enabled: true },
    },
  );

  const historyData = data ?? {
    estrus: [],
    pregnancies: [],
    births: [],
    inseminations: [],
  };

  const pregnantAnimals = historyData.pregnancies.filter(
    (p) => p.status.key !== "COMPLETED" && p.status.key !== "FAILED",
  ).length;

  useEffect(() => {
    if (search.animalId) {
      setSelectedAnimal(search.animalId);
    }
  }, [search.animalId]);

  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <PageHeader
          title="Reprodução"
          description="Controle de ciclos reprodutivos, gestações e partos"
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
                  <Heart className="size-5 text-emerald-600" />
                  Gestão Reprodutiva
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione um animal para acessar o histórico reprodutivo
                  completo.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full sm:max-w-xs">
                <label
                  htmlFor="animal-select"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Animal
                </label>
                <AnimalSelect
                  id="animal-select"
                  value={selectedAnimal}
                  onChange={setSelectedAnimal}
                  sex="FEMALE"
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
                          reprodutivo completo, incluindo ciclos de cio,
                          gestações, partos e inseminações.
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Flower className="size-4 text-violet-500" />
                          Cio
                        </div>
                        <ChevronRight className="size-4" />
                        <div className="flex items-center gap-2">
                          <Heart className="size-4 text-rose-500" />
                          Gestação
                        </div>
                        <ChevronRight className="size-4" />
                        <div className="flex items-center gap-2">
                          <Baby className="size-4 text-blue-500" />
                          Parto
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <ReproductionStats
                        births={historyData.births.length}
                        inseminations={historyData.inseminations.length}
                        estrusCycles={historyData.estrus.length}
                        pregnantAnimals={pregnantAnimals}
                        loading={isLoading}
                      />

                      <ReproductionHistoryTables
                        data={historyData}
                        loading={isLoading}
                      />
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
              <DialogTitle>Novo Registro Reprodutivo</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="estrus" className="w-full">
              <TabsList className="w-full justify-start bg-slate-100 dark:bg-slate-800 gap-1">
                <TabsTrigger
                  value="estrus"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600"
                >
                  <Flower className="size-4 mr-2" />
                  Estro/Cio
                </TabsTrigger>
                <TabsTrigger
                  value="insemination"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600"
                >
                  <Pipette className="size-4 mr-2" />
                  Inseminação
                </TabsTrigger>
                <TabsTrigger
                  value="pregnancy"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600"
                >
                  <Heart className="size-4 mr-2" />
                  Gestação
                </TabsTrigger>
                <TabsTrigger
                  value="birth"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600"
                >
                  <Baby className="size-4 mr-2" />
                  Parto
                </TabsTrigger>
              </TabsList>
              <TabsContent value="estrus" className="mt-4">
                <EstrusForm onSuccess={() => setIsModalOpen(false)} />
              </TabsContent>
              <TabsContent value="insemination" className="mt-4">
                <InseminationForm onSuccess={() => setIsModalOpen(false)} />
              </TabsContent>
              <TabsContent value="pregnancy" className="mt-4">
                <PregnancyForm onSuccess={() => setIsModalOpen(false)} />
              </TabsContent>
              <TabsContent value="birth" className="mt-4">
                <BirthForm onSuccess={() => setIsModalOpen(false)} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
