import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Bell, Plus } from 'lucide-react'
import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getV1AlertsRulesQueryKey,
  useGetV1AlertsRules,
} from '@/gen/hooks/alertsController/useGetV1AlertsRules'
import { usePostV1AlertsRules } from '@/gen/hooks/alertsController/usePostV1AlertsRules'

export const Route = createFileRoute('/alerts')({
  component: AlertsPage,
})

const ALERT_TYPES = [
  { value: 'WEIGHT_BELOW', label: 'Peso abaixo do esperado' },
  { value: 'WEIGHT_ABOVE', label: 'Peso acima do esperado' },
  { value: 'VACCINE_DUE', label: 'Vacina vencendo' },
  { value: 'PREGNANCY_DUE', label: 'Parto previsto' },
  { value: 'MILK_LOW', label: 'Produção de leite baixa' },
]

const INITIAL_ALERT_FORM = {
  name: '',
  type: '',
  threshold: '',
}

function AlertsPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_ALERT_FORM)

  const rulesQuery = useGetV1AlertsRules()
  const rules = Array.isArray(rulesQuery.data)
    ? (rulesQuery.data as any).data
    : []

  const createMutation = usePostV1AlertsRules({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getV1AlertsRulesQueryKey() })
        setOpen(false)
        setForm(INITIAL_ALERT_FORM)
      },
    },
  })

  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title="Alertas"
          description="Configure regras de alertas automáticos para o rebanho"
        >
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Nova Regra
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Regra de Alerta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Nome da Regra *</Label>
                  <Input
                    placeholder="Ex: Vacina Aftosa Vencendo"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo de Alerta *</Label>
                  <Select
                    value={form.type}
                    onValueChange={v => setForm({ ...form, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALERT_TYPES.map(t => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Limite / Threshold</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 300 (kg) ou 7 (dias)"
                    value={form.threshold}
                    onChange={e =>
                      setForm({ ...form, threshold: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  disabled={
                    createMutation.isPending || !form.name || !form.type
                  }
                  onClick={() =>
                    createMutation.mutate({
                      data: {
                        name: form.name,
                        type: form.type,
                        threshold: form.threshold
                          ? Number(form.threshold)
                          : undefined,
                      },
                    })
                  }
                >
                  {createMutation.isPending ? 'Salvando...' : 'Criar Regra'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        <div className="p-6 space-y-4">
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
        </div>
      </div>
    </AppLayout>
  )
}
