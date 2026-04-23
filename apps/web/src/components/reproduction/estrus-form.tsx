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
  startDate: '',
  endDate: '',
  observation: '',
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
            onChange={v => setEstrusForm({ ...estrusForm, animalId: v })}
            femaleOnly
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Data de Início *</Label>
            <Input
              type="date"
              value={estrusForm.startDate}
              onChange={e =>
                setEstrusForm({ ...estrusForm, startDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Data de Fim</Label>
            <Input
              type="date"
              value={estrusForm.endDate}
              onChange={e =>
                setEstrusForm({ ...estrusForm, endDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Observações</Label>
          <Textarea
            placeholder="Notas..."
            value={estrusForm.observation}
            onChange={e =>
              setEstrusForm({ ...estrusForm, observation: e.target.value })
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
            !estrusForm.startDate
          }
          onClick={() =>
            estrusMutation.mutate({
              data: {
                animalId: estrusForm.animalId,
                startDate: estrusForm.startDate,
                endDate: estrusForm.endDate || undefined,
                observation: estrusForm.observation || undefined,
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
