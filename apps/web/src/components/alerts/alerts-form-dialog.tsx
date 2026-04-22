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
import {
  getV1AlertsRulesQueryKey,
} from '@/gen/hooks/alertsController/useGetV1AlertsRules'
import { usePostV1AlertsRules } from '@/gen/hooks/alertsController/usePostV1AlertsRules'

export const ALERT_TYPES = [
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
  )
}
