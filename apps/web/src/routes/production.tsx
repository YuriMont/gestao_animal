import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WeightForm } from '@/components/production/weight-form'
import { MilkForm } from '@/components/production/milk-form'

export const Route = createFileRoute('/production')({
  component: ProductionPage,
})

function ProductionPage() {
  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title="Produção"
          description="Registre pesos e produção de leite do rebanho"
        />
        <div className="p-6 mx-auto w-full max-w-lg">
          <Tabs defaultValue="weight" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="weight">Pesagem</TabsTrigger>
              <TabsTrigger value="milk">Produção de Leite</TabsTrigger>
            </TabsList>

            <TabsContent value="weight" className="mt-4">
              <WeightForm />
            </TabsContent>

            <TabsContent value="milk" className="mt-4">
              <MilkForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
