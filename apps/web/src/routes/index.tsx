import { createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { Activity, Beef, DollarSign, TrendingUp } from 'lucide-react'
import { userAtom } from '@/atoms/auth'
import { AppLayout } from '@/components/layout/app-layout'
import { PageHeader } from '@/components/layout/page-header'
import { useGetV1Animals } from '@/gen/hooks/animalsController/useGetV1Animals'
import { useGetV1FinancialSummary } from '@/gen/hooks/financialController/useGetV1FinancialSummary'
import { StatCard } from '@/components/dashboard/stat-card'
import { RecentAnimals } from '@/components/dashboard/recent-animals'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const user = useAtomValue(userAtom)
  const animalsQuery = useGetV1Animals({ limit: 1, page: 1 })
  const activeAnimalsQuery = useGetV1Animals({
    status: 'ACTIVE',
    limit: 1,
  })

  const financialSummary = useGetV1FinancialSummary()

  const totalAnimals = animalsQuery.data?.meta.total ?? 0
  const activeAnimals = activeAnimalsQuery.data?.meta.total ?? 0
  const summary = financialSummary.data

  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title={`Olá, ${user?.name?.split(' ')[0] ?? 'Usuário'} 👋`}
          description="Visão geral da sua propriedade"
        />

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total de Animais"
              value={totalAnimals}
              icon={Beef}
              loading={animalsQuery.isLoading}
            />
            <StatCard
              title="Animais Ativos"
              value={activeAnimals}
              icon={Activity}
              loading={activeAnimalsQuery.isLoading}
            />
            <StatCard
              title="Receita Total"
              value={
                summary
                  ? `R$ ${summary.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : '—'
              }
              icon={TrendingUp}
              loading={financialSummary.isLoading}
            />
            <StatCard
              title="Lucro Líquido"
              value={
                summary
                  ? `R$ ${summary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : '—'
              }
              icon={DollarSign}
              loading={financialSummary.isLoading}
              trend={summary && summary.balance >= 0 ? 'up' : 'down'}
              trendLabel={
                summary && summary.balance >= 0 ? 'Positivo' : 'Negativo'
              }
            />
          </div>

          <RecentAnimals />
        </div>
      </div>
    </AppLayout>
  )
}
