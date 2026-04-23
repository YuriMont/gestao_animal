import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import {
  getV1AlertsRulesQueryKey,
} from '@/gen/hooks/alertsController/useGetV1AlertsRules'
import { usePostV1AlertsRules } from '@/gen/hooks/alertsController/usePostV1AlertsRules'

// Alert condition types aligned with backend AlertRule schema (condition + value)
export const ALERT_CONDITIONS = [
  { value: 'WEIGHT_BELOW', label: 'Peso abaixo do esperado' },
  { value: 'WEIGHT_ABOVE', label: 'Peso acima do esperado' },
  { value: 'VACCINE_DUE', label: 'Vacina vencendo' },
  { value: 'PREGNANCY_DUE', label: 'Parto previsto' },
  { value: 'MILK_LOW', label: 'Produção de leite baixa' },
]

const INITIAL_ALERT_FORM = {
  name: '',
  condition: '',
  value: '',
}

export function AlertsFormDialog() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(INITIAL_ALERT_FORM)

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
            <Label>Condição *</Label>
            <Select
              value={form.condition}
              onValueChange={v => setForm({ ...form, condition: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a condição" />
              </SelectTrigger>
              <SelectContent>
                {ALERT_CONDITIONS.map(c => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Valor / Threshold</Label>
            <Textarea
              placeholder="Ex: 300 (kg), 7 (dias)..."
              value={form.value}
              onChange={e => setForm({ ...form, value: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            disabled={
              createMutation.isPending || !form.name || !form.condition
            }
            onClick={() =>
              createMutation.mutate({
                data: {
                  name: form.name,
                  condition: form.condition,
                  value: form.value || undefined,
                },
              })
            }
          >
            {createMutation.isPending ? 'Salvando...' : 'Criar Regra'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
