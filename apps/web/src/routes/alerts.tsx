import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { PageHeader } from '@/components/layout/page-header'
import { AlertsFormDialog } from '@/components/alerts/alerts-form-dialog'
import { AlertsList } from '@/components/alerts/alerts-list'

export const Route = createFileRoute('/alerts')({
  component: AlertsPage,
})

function AlertsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title="Alertas"
          description="Configure regras de alertas automáticos para o rebanho"
        >
          <AlertsFormDialog />
        </PageHeader>

        <div className="p-6 space-y-4">
          <AlertsList />
        </div>
      </div>
    </AppLayout>
  )
}
