import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePostV1ProductionWeight } from '@/gen/hooks/productionController/usePostV1ProductionWeight'
import { AnimalSelect } from '@/components/health/animal-select'

const INITIAL_WEIGHT_FORM = {
  animalId: '',
  weight: '',
  date: '',
  notes: '',
}

export function WeightForm() {
  const [weightForm, setWeightForm] = useState(INITIAL_WEIGHT_FORM)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const weightMutation = usePostV1ProductionWeight({
    mutation: {
      onSuccess: () => {
        setWeightForm(INITIAL_WEIGHT_FORM)
        showFeedback(true, 'Peso registrado!')
      },
      onError: () => showFeedback(false, 'Erro ao registrar peso.'),
    },
  })

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="size-4" />
          Registrar Peso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Animal *</Label>
          <AnimalSelect
            value={weightForm.animalId}
            onChange={v =>
              setWeightForm({ ...weightForm, animalId: v })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Peso (kg) *</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Ex: 450.5"
              value={weightForm.weight}
              onChange={e =>
                setWeightForm({
                  ...weightForm,
                  weight: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Data *</Label>
            <Input
              type="date"
              value={weightForm.date}
              onChange={e =>
                setWeightForm({ ...weightForm, date: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Observações</Label>
          <Textarea
            placeholder="Notas..."
            value={weightForm.notes}
            onChange={e =>
              setWeightForm({ ...weightForm, notes: e.target.value })
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
            weightMutation.isPending ||
            !weightForm.animalId ||
            !weightForm.weight ||
            !weightForm.date
          }
          onClick={() =>
            weightMutation.mutate({
              data: {
                animalId: weightForm.animalId,
                weight: Number(weightForm.weight),
                date: weightForm.date,
                notes: weightForm.notes || undefined,
              },
            })
          }
        >
          {weightMutation.isPending
            ? 'Salvando...'
            : 'Registrar Pesagem'}
        </Button>
      </CardContent>
    </Card>
  )
}
