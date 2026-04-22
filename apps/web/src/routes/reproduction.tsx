import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EstrusForm } from '@/components/reproduction/estrus-form'
import { PregnancyView } from '@/components/reproduction/pregnancy-view'
import { BirthForm } from '@/components/reproduction/birth-form'

export const Route = createFileRoute('/reproduction')({
  component: ReproductionPage,
})

function ReproductionPage() {
  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title="Reprodução"
          description="Controle de ciclos reprodutivos, gestações e partos"
        />
        <div className="p-6 mx-auto w-full max-w-4xl">
          <Tabs defaultValue="estrus" className="w-full">
            <TabsList className="w-full grid grid-cols-3 max-w-lg mx-auto mb-6">
              <TabsTrigger value="estrus">Estro / Cio</TabsTrigger>
              <TabsTrigger value="pregnancy">Gestação</TabsTrigger>
              <TabsTrigger value="birth">Partos</TabsTrigger>
            </TabsList>

            <TabsContent value="estrus" className="mt-4 flex justify-center">
              <EstrusForm />
            </TabsContent>

            <TabsContent value="pregnancy" className="mt-4">
              <PregnancyView />
            </TabsContent>

            <TabsContent value="birth" className="mt-4 flex justify-center">
              <BirthForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
