import type * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Beef, DollarSign, TrendingDown, TrendingUp, Activity } from "lucide-react"
import { useGetV1Animals } from "@/gen/hooks/animalsController/useGetV1Animals"
import { useGetV1FinancialSummary } from "@/gen/hooks/financialController/useGetV1FinancialSummary"
import { AppLayout } from "@/components/layout/app-layout"
import { PageHeader } from "@/components/layout/page-header"
import { useAtomValue } from "jotai"
import { userAtom } from "@/atoms/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/")({
  component: Dashboard,
})

function StatCard({ title, value, icon: Icon, trend, trendLabel, loading }: {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: "up" | "down"
  trendLabel?: string
  loading?: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && trendLabel && (
              <span className={cn("mb-0.5 flex items-center text-xs font-medium", trend === "up" ? "text-primary" : "text-destructive")}>
                {trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "success" | "warning" | "outline" {
  switch (status) {
    case "Active": return "success"
    case "Quarantine": return "warning"
    case "Sold": return "secondary"
    case "Deceased": return "destructive"
    default: return "outline"
  }
}

function statusLabel(status: string) {
  const labels: Record<string, string> = { Active: "Ativo", Sold: "Vendido", Deceased: "Falecido", Quarantine: "Quarentena" }
  return labels[status] ?? status
}

function Dashboard() {
  const user = useAtomValue(userAtom)
  const animalsQuery = useGetV1Animals({ limit: 10, page: 1 })
  const activeAnimalsQuery = useGetV1Animals({ status: "Active" as any, limit: 1 })
  const financialSummary = useGetV1FinancialSummary()

  const animals = animalsQuery.data?.data.data ?? []
  const totalAnimals = animalsQuery.data?.data.meta.total ?? 0
  const activeAnimals = activeAnimalsQuery.data?.data.meta.total ?? 0
  const summary = financialSummary.data?.data

  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title={`Olá, ${user?.name?.split(" ")[0] ?? "Usuário"} 👋`}
          description="Visão geral da sua propriedade"
        />

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard title="Total de Animais" value={totalAnimals} icon={Beef} loading={animalsQuery.isLoading} />
            <StatCard title="Animais Ativos" value={activeAnimals} icon={Activity} loading={activeAnimalsQuery.isLoading} />
            <StatCard
              title="Receita Total"
              value={summary ? `R$ ${summary.totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
              icon={TrendingUp}
              loading={financialSummary.isLoading}
            />
            <StatCard
              title="Lucro Líquido"
              value={summary ? `R$ ${summary.netProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
              icon={DollarSign}
              loading={financialSummary.isLoading}
              trend={summary && summary.netProfit >= 0 ? "up" : "down"}
              trendLabel={summary && summary.netProfit >= 0 ? "Positivo" : "Negativo"}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Animais Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {animalsQuery.isLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : animals.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                  <Beef className="size-8 opacity-30" />
                  <p className="text-sm">Nenhum animal cadastrado</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag</TableHead>
                      <TableHead>Espécie</TableHead>
                      <TableHead>Raça</TableHead>
                      <TableHead>Sexo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animals.map((animal) => (
                      <TableRow key={animal.id}>
                        <TableCell className="font-mono font-medium">{animal.tag}</TableCell>
                        <TableCell>{animal.species}</TableCell>
                        <TableCell>{animal.breed ?? "—"}</TableCell>
                        <TableCell>{animal.sex === "Male" ? "Macho" : "Fêmea"}</TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(animal.status)}>{statusLabel(animal.status)}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
