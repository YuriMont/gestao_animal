import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePostV1ReproductionBirth } from '@/gen/hooks/reproductionController/usePostV1ReproductionBirth'

const INITIAL_BIRTH_FORM = {
  pregnancyId: '',
  birthDate: '',
  numberOfOffspring: '1',
  notes: '',
}

export function BirthForm() {
  const [birthForm, setBirthForm] = useState(INITIAL_BIRTH_FORM)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const birthMutation = usePostV1ReproductionBirth({
    mutation: {
      onSuccess: () => {
        setBirthForm(INITIAL_BIRTH_FORM)
        showFeedback(true, 'Parto registrado!')
      },
      onError: () => showFeedback(false, 'Erro ao registrar parto.'),
    },
  })

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="size-4" />
          Registrar Parto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>ID da Gestação *</Label>
          <Input
            placeholder="UUID da gestação"
            value={birthForm.pregnancyId}
            onChange={e =>
              setBirthForm({
                ...birthForm,
                pregnancyId: e.target.value,
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Data do Parto *</Label>
            <Input
              type="date"
              value={birthForm.birthDate}
              onChange={e =>
                setBirthForm({
                  ...birthForm,
                  birthDate: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Nº de Filhotes *</Label>
            <Input
              type="number"
              min="1"
              value={birthForm.numberOfOffspring}
              onChange={e =>
                setBirthForm({
                  ...birthForm,
                  numberOfOffspring: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Observações</Label>
          <Textarea
            placeholder="Notas do parto..."
            value={birthForm.notes}
            onChange={e =>
              setBirthForm({ ...birthForm, notes: e.target.value })
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
            birthMutation.isPending ||
            !birthForm.pregnancyId ||
            !birthForm.birthDate
          }
          onClick={() =>
            birthMutation.mutate({
              data: {
                pregnancyId: birthForm.pregnancyId,
                birthDate: birthForm.birthDate,
                numberOfOffspring: Number(
                  birthForm.numberOfOffspring
                ),
                notes: birthForm.notes || undefined,
              },
            })
          }
        >
          {birthMutation.isPending
            ? 'Salvando...'
            : 'Registrar Parto'}
        </Button>
      </CardContent>
    </Card>
  )
}
