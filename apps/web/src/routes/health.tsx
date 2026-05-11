import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, History, Plus } from "lucide-react";
import { useState } from "react";
import { AnimalSelect } from "@/components/health/animal-select";
import { HealthTables } from "@/components/health/health-tables";
import { RecordForm } from "@/components/health/record-form";
import { TreatmentForm } from "@/components/health/treatment-form";
import { VaccineForm } from "@/components/health/vaccine-form";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetV1HealthHistoryAnimalid } from "@/gen/hooks/healthController/useGetV1HealthHistoryAnimalid";

export const Route = createFileRoute("/health")({
  component: HealthPage,
});

function HealthPage() {
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetV1HealthHistoryAnimalid(selectedAnimal);

  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
        <PageHeader
          title="Saúde Animal"
          description="Prontuário clínico e gestão de imunizações"
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
        <div className="p-4 sm:p-6 mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Activity className="size-5 text-emerald-600" />
                  Prontuário Digital
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione um paciente para gerenciar o histórico clínico.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full sm:max-w-xs">
                <label
                  htmlFor="health-animal-select"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  Paciente
                </label>
                <AnimalSelect
                  id="health-animal-select"
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
                    <div className="flex flex-col items-center justify-center py-32 text-center gap-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 mx-auto">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <History className="size-12 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-medium">
                          Nenhum paciente selecionado
                        </p>
                        <p className="text-muted-foreground max-w-xs">
                          Por favor, selecione um animal no topo da página para
                          acessar o histórico de saúde.
                        </p>
                      </div>
                    </div>
                  ) : isLoading ? (
                    <div className="space-y-6">
                      <Skeleton className="h-12 w-[300px] rounded-xl" />
                      <Skeleton className="rounded-2xl border h-64 w-full" />
                      <Skeleton className="rounded-2xl border h-64 w-full" />
                    </div>
                  ) : (
                    <HealthTables
                      data={
                        data ?? { records: [], vaccines: [], treatments: [] }
                      }
                    />
                  )}
                </motion.div>
              </div>
            </AnimatePresence>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl w-full mx-auto max-h-[85vh] sm:max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Novo Registro de Saúde</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="vaccine" className="w-full">
              <TabsList className="w-full justify-start bg-slate-100 dark:bg-slate-800 gap-1">
                <TabsTrigger
                  value="vaccine"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600"
                >
                  Vacina
                </TabsTrigger>
                <TabsTrigger
                  value="treatment"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600"
                >
                  Tratamento
                </TabsTrigger>
                <TabsTrigger
                  value="record"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600"
                >
                  Registro
                </TabsTrigger>
              </TabsList>
              <TabsContent value="vaccine" className="mt-4">
                <VaccineForm onSuccess={() => setIsModalOpen(false)} />
              </TabsContent>
              <TabsContent value="treatment" className="mt-4">
                <TreatmentForm onSuccess={() => setIsModalOpen(false)} />
              </TabsContent>
              <TabsContent value="record" className="mt-4">
                <RecordForm onSuccess={() => setIsModalOpen(false)} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
