import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { usePostV1ReproductionPregnancies } from '@/gen/hooks/reproductionController/usePostV1ReproductionPregnancies'
import { useGetV1ReproductionPregnancies } from '@/gen/hooks/reproductionController/useGetV1ReproductionPregnancies'
import { AnimalSelect } from './animal-select'

const INITIAL_PREGNANCY_FORM = {
  motherId: '',
  fatherId: '',
  matingDate: '',
  expectedBirthDate: '',
}

export function PregnancyView() {
  const [pregnancyForm, setPregnancyForm] = useState(INITIAL_PREGNANCY_FORM)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  const pregnanciesQuery = useGetV1ReproductionPregnancies()
  const pregnancies = pregnanciesQuery.data?.data ?? []

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const pregnancyMutation = usePostV1ReproductionPregnancies({
    mutation: {
      onSuccess: () => {
        setPregnancyForm(INITIAL_PREGNANCY_FORM)
        showFeedback(true, 'Gestação registrada!')
        pregnanciesQuery.refetch()
      },
      onError: () =>
        showFeedback(false, 'Erro ao registrar gestação.'),
    },
  })

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="size-4" />
            Nova Gestação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Mãe (Fêmea) *</Label>
            <AnimalSelect
              value={pregnancyForm.motherId}
              onChange={v =>
                setPregnancyForm({ ...pregnancyForm, motherId: v })
              }
              femaleOnly
            />
          </div>
          <div className="space-y-1.5">
            <Label>Pai (Macho)</Label>
            <AnimalSelect
              value={pregnancyForm.fatherId}
              onChange={v =>
                setPregnancyForm({ ...pregnancyForm, fatherId: v })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Data Acasalamento *</Label>
              <Input
                type="date"
                value={pregnancyForm.matingDate}
                onChange={e =>
                  setPregnancyForm({
                    ...pregnancyForm,
                    matingDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Previsão de Parto</Label>
              <Input
                type="date"
                value={pregnancyForm.expectedBirthDate}
                onChange={e =>
                  setPregnancyForm({
                    ...pregnancyForm,
                    expectedBirthDate: e.target.value,
                  })
                }
              />
            </div>
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
              pregnancyMutation.isPending ||
              !pregnancyForm.motherId ||
              !pregnancyForm.matingDate
            }
            onClick={() =>
              pregnancyMutation.mutate({
                data: {
                  motherId: pregnancyForm.motherId,
                  fatherId: pregnancyForm.fatherId || undefined,
                  matingDate: pregnancyForm.matingDate,
                  expectedBirthDate:
                    pregnancyForm.expectedBirthDate || undefined,
                },
              })
            }
          >
            {pregnancyMutation.isPending
              ? 'Salvando...'
              : 'Registrar Gestação'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Gestações Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pregnanciesQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : pregnancies.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhuma gestação registrada
            </p>
          ) : (
            <div className="space-y-2">
              {pregnancies.slice(0, 6).map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <span className="font-medium">
                    {p.motherId ?? 'Desconhecida'}
                  </span>
                  <Badge variant="default">
                    {p.expectedBirthDate
                      ? new Date(
                          p.expectedBirthDate
                        ).toLocaleDateString('pt-BR')
                      : 'Sem previsão'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
