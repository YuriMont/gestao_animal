import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePostV1HealthVaccines } from '@/gen/hooks/healthController/usePostV1HealthVaccines'
import { AnimalSelect } from './animal-select'

const INITIAL_VACCINE_FORM = {
  animalId: '',
  vaccineName: '',
  doseNumber: '1',
  dateAdministered: '',
  nextDueDate: '',
}

export function VaccineForm() {
  const [vaccineForm, setVaccineForm] = useState(INITIAL_VACCINE_FORM)
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)

  function showFeedback(ok: boolean, msg: string) {
    setFeedback({ ok, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const vaccineMutation = usePostV1HealthVaccines({
    mutation: {
      onSuccess: () => {
        setVaccineForm(INITIAL_VACCINE_FORM)
        showFeedback(true, 'Vacina registrada com sucesso!')
      },
      onError: () => showFeedback(false, 'Erro ao registrar vacina.'),
    },
  })

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="size-4" />
          Registrar Vacina
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Animal *</Label>
          <AnimalSelect
            value={vaccineForm.animalId}
            onChange={v =>
              setVaccineForm({ ...vaccineForm, animalId: v })
            }
          />
        </div>
        <div className="space-y-1.5">
          <Label>Nome da Vacina *</Label>
          <Input
            placeholder="Ex: Febre Aftosa"
            value={vaccineForm.vaccineName}
            onChange={e =>
              setVaccineForm({
                ...vaccineForm,
                vaccineName: e.target.value,
              })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Dose Nº</Label>
            <Input
              type="number"
              min="1"
              value={vaccineForm.doseNumber}
              onChange={e =>
                setVaccineForm({
                  ...vaccineForm,
                  doseNumber: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Data Aplicação *</Label>
            <Input
              type="date"
              value={vaccineForm.dateAdministered}
              onChange={e =>
                setVaccineForm({
                  ...vaccineForm,
                  dateAdministered: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Próxima Dose</Label>
          <Input
            type="date"
            value={vaccineForm.nextDueDate}
            onChange={e =>
              setVaccineForm({
                ...vaccineForm,
                nextDueDate: e.target.value,
              })
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
            vaccineMutation.isPending ||
            !vaccineForm.animalId ||
            !vaccineForm.vaccineName ||
            !vaccineForm.dateAdministered
          }
          onClick={() =>
            vaccineMutation.mutate({
              data: {
                animalId: vaccineForm.animalId,
                vaccineName: vaccineForm.vaccineName,
                doseNumber: Number(vaccineForm.doseNumber),
                dateAdministered: vaccineForm.dateAdministered,
                nextDueDate: vaccineForm.nextDueDate || undefined,
              },
            })
          }
        >
          {vaccineMutation.isPending
            ? 'Salvando...'
            : 'Registrar Vacina'}
        </Button>
      </CardContent>
    </Card>
  )
}
