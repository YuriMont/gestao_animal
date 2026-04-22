import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetV1AlertsRules } from '@/gen/hooks/alertsController/useGetV1AlertsRules'
import { ALERT_TYPES } from './alerts-form-dialog'

export function AlertsList() {
  const rulesQuery = useGetV1AlertsRules()
  const rules = Array.isArray(rulesQuery.data)
    ? (rulesQuery.data as any).data
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Regras de Alerta</CardTitle>
      </CardHeader>
      <CardContent>
        {rulesQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : rules.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Bell className="size-8 opacity-30" />
            <p className="text-sm">Nenhuma regra de alerta configurada</p>
            <p className="text-xs">
              Crie regras para monitorar automaticamente o rebanho
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {rules.map((rule: any, i: number) => (
              <div
                key={rule.id ?? i}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Bell className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{rule.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ALERT_TYPES.find(t => t.value === rule.type)
                        ?.label ?? rule.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {rule.threshold != null && (
                    <Badge variant="outline">
                      Limite: {rule.threshold}
                    </Badge>
                  )}
                  <Badge
                    variant={
                      rule.active !== false ? 'success' : 'secondary'
                    }
                  >
                    {rule.active !== false ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
