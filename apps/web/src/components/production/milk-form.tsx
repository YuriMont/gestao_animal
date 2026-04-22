import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePostV1ProductionMilk } from '@/gen/hooks/productionController/usePostV1ProductionMilk'
import { AnimalSelect } from '@/components/health/animal-select'

const INITIAL_MILK_FORM = {
  animalId: '',
  liters: '',
  date: '',
  session: '',
  notes: '',
}

export function MilkForm() {
  const [milkForm, setMilkForm] = useState(INITIAL_MILK_FORM)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const milkMutation = usePostV1ProductionMilk({
    mutation: {
      onSuccess: () => {
        setMilkForm(INITIAL_MILK_FORM)
        showFeedback(true, 'Produção registrada!')
      },
      onError: () => showFeedback(false, 'Erro ao registrar produção.'),
    },
  })

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="size-4" />
          Registrar Produção de Leite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Animal (Fêmea) *</Label>
          <AnimalSelect
            value={milkForm.animalId}
            onChange={v => setMilkForm({ ...milkForm, animalId: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Litros *</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Ex: 20.5"
              value={milkForm.liters}
              onChange={e =>
                setMilkForm({ ...milkForm, liters: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Data *</Label>
            <Input
              type="date"
              value={milkForm.date}
              onChange={e =>
                setMilkForm({ ...milkForm, date: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Turno</Label>
          <Select
            value={milkForm.session}
            onValueChange={v =>
              setMilkForm({ ...milkForm, session: v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Manhã</SelectItem>
              <SelectItem value="afternoon">Tarde</SelectItem>
              <SelectItem value="evening">Noite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Observações</Label>
          <Textarea
            placeholder="Notas..."
            value={milkForm.notes}
            onChange={e =>
              setMilkForm({ ...milkForm, notes: e.target.value })
            }
          />
        </div>
        {feedback && (
          <p
            className={`text-sm ${feedback.ok ? 'text-primary' : 'text-destructive'}`}
          >
            {feedback.msg}
          </p>
        )}
        <Button
          className="w-full"
          disabled={
            milkMutation.isPending ||
            !milkForm.animalId ||
            !milkForm.liters ||
            !milkForm.date
          }
          onClick={() =>
            milkMutation.mutate({
              data: {
                animalId: milkForm.animalId,
                liters: Number(milkForm.liters),
                date: milkForm.date,
                session: milkForm.session || undefined,
                notes: milkForm.notes || undefined,
              },
            })
          }
        >
          {milkMutation.isPending
            ? 'Salvando...'
            : 'Registrar Produção'}
        </Button>
      </CardContent>
    </Card>
  )
}
