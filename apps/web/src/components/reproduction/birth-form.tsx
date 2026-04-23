import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetV1EnumsReproductionBirthStatus } from '@/gen/hooks/enumsController/useGetV1EnumsReproductionBirthStatus'
import { usePostV1ReproductionBirth } from '@/gen/hooks/reproductionController/usePostV1ReproductionBirth'
import type { PostV1ReproductionBirthMutationRequestStatusEnumKey } from '@/gen/models/reproductionController/PostV1ReproductionBirth'
import { AnimalSelect } from './animal-select'

const INITIAL_BIRTH_FORM = {
  motherId: '',
  fatherId: '',
  birthDate: '',
  offspringTag: '',
  status: 'ALIVE' as PostV1ReproductionBirthMutationRequestStatusEnumKey,
}

export function BirthForm() {
  const [birthForm, setBirthForm] = useState(INITIAL_BIRTH_FORM)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)
  const { data: birthStatuses } = useGetV1EnumsReproductionBirthStatus()

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
          <Label>Mãe (Fêmea) *</Label>
          <AnimalSelect
            value={birthForm.motherId}
            onChange={v => setBirthForm({ ...birthForm, motherId: v })}
            femaleOnly
          />
        </div>
        <div className="space-y-1.5">
          <Label>Pai (Macho)</Label>
          <AnimalSelect
            value={birthForm.fatherId}
            onChange={v => setBirthForm({ ...birthForm, fatherId: v })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Data do Parto *</Label>
            <Input
              type="date"
              value={birthForm.birthDate}
              onChange={e =>
                setBirthForm({ ...birthForm, birthDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tag do Filhote</Label>
            <Input
              placeholder="Ex: BOV-050"
              value={birthForm.offspringTag}
              onChange={e =>
                setBirthForm({ ...birthForm, offspringTag: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Status *</Label>
          <Select
            value={birthForm.status}
            onValueChange={v =>
              setBirthForm({
                ...birthForm,
                status: v as PostV1ReproductionBirthMutationRequestStatusEnumKey,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {birthStatuses?.map(item => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            !birthForm.motherId ||
            !birthForm.birthDate
          }
          onClick={() =>
            birthMutation.mutate({
              data: {
                motherId: birthForm.motherId,
                fatherId: birthForm.fatherId || undefined,
                birthDate: birthForm.birthDate,
                offspringTag: birthForm.offspringTag || undefined,
                status: birthForm.status,
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
