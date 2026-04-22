import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePostV1ReproductionEstrus } from '@/gen/hooks/reproductionController/usePostV1ReproductionEstrus'
import { AnimalSelect } from './animal-select'

const INITIAL_ESTRUS_FORM = {
  animalId: '',
  date: '',
  notes: '',
}

export function EstrusForm() {
  const [estrusForm, setEstrusForm] = useState(INITIAL_ESTRUS_FORM)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const estrusMutation = usePostV1ReproductionEstrus({
    mutation: {
      onSuccess: () => {
        setEstrusForm(INITIAL_ESTRUS_FORM)
        showFeedback(true, 'Cio registrado!')
      },
      onError: () => showFeedback(false, 'Erro ao registrar.'),
    },
  })

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="size-4" />
          Registrar Cio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Fêmea *</Label>
          <AnimalSelect
            value={estrusForm.animalId}
            onChange={v =>
              setEstrusForm({ ...estrusForm, animalId: v })
            }
            femaleOnly
          />
        </div>
        <div className="space-y-1.5">
          <Label>Data *</Label>
          <Input
            type="date"
            value={estrusForm.date}
            onChange={e =>
              setEstrusForm({ ...estrusForm, date: e.target.value })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label>Observações</Label>
          <Textarea
            placeholder="Notas..."
            value={estrusForm.notes}
            onChange={e =>
              setEstrusForm({ ...estrusForm, notes: e.target.value })
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
            estrusMutation.isPending ||
            !estrusForm.animalId ||
            !estrusForm.date
          }
          onClick={() =>
            estrusMutation.mutate({
              data: {
                animalId: estrusForm.animalId,
                startDate: estrusForm.date,
                notes: estrusForm.notes || undefined,
              },
            })
          }
        >
          {estrusMutation.isPending ? 'Salvando...' : 'Registrar Cio'}
        </Button>
      </CardContent>
    </Card>
  )
}
