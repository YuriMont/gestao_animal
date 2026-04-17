import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Plus } from "lucide-react"
import { useGetV1Animals } from "@/gen/hooks/animalsController/useGetV1Animals"
import { usePostV1ProductionWeight } from "@/gen/hooks/productionController/usePostV1ProductionWeight"
import { usePostV1ProductionMilk } from "@/gen/hooks/productionController/usePostV1ProductionMilk"
import { AppLayout } from "@/components/layout/app-layout"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const Route = createFileRoute("/production")({
  component: ProductionPage,
})

function AnimalSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const animalsQuery = useGetV1Animals({ limit: 100 })
  const animals = animalsQuery.data?.data.data ?? []
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Selecione o animal" /></SelectTrigger>
      <SelectContent>
        {animals.map((a) => (
          <SelectItem key={a.id} value={a.id}>{a.tag} — {a.species}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ProductionPage() {
  const [weightForm, setWeightForm] = useState({ animalId: "", weight: "", date: "", notes: "" })
  const [milkForm, setMilkForm] = useState({ animalId: "", liters: "", date: "", session: "", notes: "" })
  const [feedback, setFeedback] = useState<{ tab: string; msg: string; ok: boolean } | null>(null)

  function showFeedback(tab: string, ok: boolean, msg: string) {
    setFeedback({ tab, ok, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const weightMutation = usePostV1ProductionWeight({
    mutation: {
      onSuccess: () => {
        setWeightForm({ animalId: "", weight: "", date: "", notes: "" })
        showFeedback("weight", true, "Peso registrado!")
      },
      onError: () => showFeedback("weight", false, "Erro ao registrar peso."),
    },
  })

  const milkMutation = usePostV1ProductionMilk({
    mutation: {
      onSuccess: () => {
        setMilkForm({ animalId: "", liters: "", date: "", session: "", notes: "" })
        showFeedback("milk", true, "Produção registrada!")
      },
      onError: () => showFeedback("milk", false, "Erro ao registrar produção."),
    },
  })

  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader title="Produção" description="Registre pesos e produção de leite do rebanho" />
        <div className="p-6">
          <Tabs defaultValue="weight">
            <TabsList>
              <TabsTrigger value="weight">Pesagem</TabsTrigger>
              <TabsTrigger value="milk">Produção de Leite</TabsTrigger>
            </TabsList>

            <TabsContent value="weight" className="mt-4">
              <Card className="max-w-lg">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="size-4" />Registrar Peso</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5"><Label>Animal *</Label><AnimalSelect value={weightForm.animalId} onChange={(v) => setWeightForm({ ...weightForm, animalId: v })} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Peso (kg) *</Label><Input type="number" step="0.1" placeholder="Ex: 450.5" value={weightForm.weight} onChange={(e) => setWeightForm({ ...weightForm, weight: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Data *</Label><Input type="date" value={weightForm.date} onChange={(e) => setWeightForm({ ...weightForm, date: e.target.value })} /></div>
                  </div>
                  <div className="space-y-1.5"><Label>Observações</Label><Textarea placeholder="Notas..." value={weightForm.notes} onChange={(e) => setWeightForm({ ...weightForm, notes: e.target.value })} /></div>
                  {feedback?.tab === "weight" && <p className={`text-sm ${feedback.ok ? "text-primary" : "text-destructive"}`}>{feedback.msg}</p>}
                  <Button className="w-full" disabled={weightMutation.isPending || !weightForm.animalId || !weightForm.weight || !weightForm.date} onClick={() => weightMutation.mutate({ data: { animalId: weightForm.animalId, weight: Number(weightForm.weight), date: weightForm.date, notes: weightForm.notes || undefined } })}>
                    {weightMutation.isPending ? "Salvando..." : "Registrar Pesagem"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milk" className="mt-4">
              <Card className="max-w-lg">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="size-4" />Registrar Produção de Leite</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5"><Label>Animal (Fêmea) *</Label><AnimalSelect value={milkForm.animalId} onChange={(v) => setMilkForm({ ...milkForm, animalId: v })} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Litros *</Label><Input type="number" step="0.1" placeholder="Ex: 20.5" value={milkForm.liters} onChange={(e) => setMilkForm({ ...milkForm, liters: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Data *</Label><Input type="date" value={milkForm.date} onChange={(e) => setMilkForm({ ...milkForm, date: e.target.value })} /></div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Turno</Label>
                    <Select value={milkForm.session} onValueChange={(v) => setMilkForm({ ...milkForm, session: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione o turno" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Manhã</SelectItem>
                        <SelectItem value="afternoon">Tarde</SelectItem>
                        <SelectItem value="evening">Noite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Observações</Label><Textarea placeholder="Notas..." value={milkForm.notes} onChange={(e) => setMilkForm({ ...milkForm, notes: e.target.value })} /></div>
                  {feedback?.tab === "milk" && <p className={`text-sm ${feedback.ok ? "text-primary" : "text-destructive"}`}>{feedback.msg}</p>}
                  <Button className="w-full" disabled={milkMutation.isPending || !milkForm.animalId || !milkForm.liters || !milkForm.date} onClick={() => milkMutation.mutate({ data: { animalId: milkForm.animalId, liters: Number(milkForm.liters), date: milkForm.date, session: milkForm.session || undefined, notes: milkForm.notes || undefined } })}>
                    {milkMutation.isPending ? "Salvando..." : "Registrar Produção"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
