import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VaccineForm } from '@/components/health/vaccine-form'
import { TreatmentForm } from '@/components/health/treatment-form'
import { RecordForm } from '@/components/health/record-form'

export const Route = createFileRoute('/health')({
  component: HealthPage,
})

function HealthPage() {
  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title="Saúde Animal"
          description="Registre vacinas, tratamentos e ocorrências de saúde"
        />
        <div className="p-6 mx-auto w-full max-w-lg">
          <Tabs defaultValue="vaccines" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="vaccines">Vacinas</TabsTrigger>
              <TabsTrigger value="treatments">Tratamentos</TabsTrigger>
              <TabsTrigger value="records">Registros</TabsTrigger>
            </TabsList>

            <TabsContent value="vaccines" className="mt-4">
              <VaccineForm />
            </TabsContent>

            <TabsContent value="treatments" className="mt-4">
              <TreatmentForm />
            </TabsContent>

            <TabsContent value="records" className="mt-4">
              <RecordForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
