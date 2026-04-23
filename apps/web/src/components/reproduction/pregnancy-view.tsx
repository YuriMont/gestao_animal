import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetV1EnumsReproductionPregnancyStatus } from '@/gen/hooks/enumsController/useGetV1EnumsReproductionPregnancyStatus'
import {
  getV1ReproductionPregnanciesQueryKey,
  useGetV1ReproductionPregnancies,
} from '@/gen/hooks/reproductionController/useGetV1ReproductionPregnancies'
import { usePostV1ReproductionPregnancies } from '@/gen/hooks/reproductionController/usePostV1ReproductionPregnancies'
import type { PostV1ReproductionPregnanciesMutationRequestStatusEnumKey } from '@/gen/models/reproductionController/PostV1ReproductionPregnancies'
import { useQueryClient } from '@tanstack/react-query'
import { AnimalSelect } from './animal-select'

const INITIAL_PREGNANCY_FORM = {
  animalId: '',
  detectedDate: '',
  expectedDate: '',
  status: 'PENDING' as PostV1ReproductionPregnanciesMutationRequestStatusEnumKey,
}

export function PregnancyView() {
  const qc = useQueryClient()
  const [pregnancyForm, setPregnancyForm] = useState(INITIAL_PREGNANCY_FORM)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  const { data: pregnancyStatuses } = useGetV1EnumsReproductionPregnancyStatus()
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
        qc.invalidateQueries({ queryKey: getV1ReproductionPregnanciesQueryKey() })
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
            <Label>Animal (Fêmea) *</Label>
            <AnimalSelect
              value={pregnancyForm.animalId}
              onChange={v =>
                setPregnancyForm({ ...pregnancyForm, animalId: v })
              }
              femaleOnly
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Data de Detecção *</Label>
              <Input
                type="date"
                value={pregnancyForm.detectedDate}
                onChange={e =>
                  setPregnancyForm({
                    ...pregnancyForm,
                    detectedDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Previsão de Parto</Label>
              <Input
                type="date"
                value={pregnancyForm.expectedDate}
                onChange={e =>
                  setPregnancyForm({
                    ...pregnancyForm,
                    expectedDate: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={pregnancyForm.status}
              onValueChange={v =>
                setPregnancyForm({
                  ...pregnancyForm,
                  status: v as PostV1ReproductionPregnanciesMutationRequestStatusEnumKey,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pregnancyStatuses?.map(item => (
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
              pregnancyMutation.isPending ||
              !pregnancyForm.animalId ||
              !pregnancyForm.detectedDate
            }
            onClick={() =>
              pregnancyMutation.mutate({
                data: {
                  animalId: pregnancyForm.animalId,
                  detectedDate: pregnancyForm.detectedDate,
                  expectedDate:
                    pregnancyForm.expectedDate || undefined,
                  status: pregnancyForm.status,
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
                    {p.animalId ?? 'Desconhecida'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{p.status}</Badge>
                    {p.expectedDate && (
                      <Badge variant="default">
                        {new Date(p.expectedDate).toLocaleDateString('pt-BR')}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
