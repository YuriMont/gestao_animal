import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Plus } from "lucide-react"
import { useGetV1Animals } from "@/gen/hooks/animalsController/useGetV1Animals"
import { useGetV1ReproductionPregnancies } from "@/gen/hooks/reproductionController/useGetV1ReproductionPregnancies"
import { usePostV1ReproductionEstrus } from "@/gen/hooks/reproductionController/usePostV1ReproductionEstrus"
import { usePostV1ReproductionPregnancies } from "@/gen/hooks/reproductionController/usePostV1ReproductionPregnancies"
import { usePostV1ReproductionBirth } from "@/gen/hooks/reproductionController/usePostV1ReproductionBirth"
import { AppLayout } from "@/components/layout/app-layout"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/reproduction")({
  component: ReproductionPage,
})

function AnimalSelect({ value, onChange, femaleOnly }: { value: string; onChange: (v: string) => void; femaleOnly?: boolean }) {
  const animalsQuery = useGetV1Animals({ limit: 100, ...(femaleOnly ? { sex: "Female" as any } : {}) })
  const animals = animalsQuery.data?.data.data ?? []
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Selecione o animal" /></SelectTrigger>
      <SelectContent>
        {animals.map((a) => (
          <SelectItem key={a.id} value={a.id}>{a.tag} — {a.species} ({(a as any).sex === "Male" ? "M" : "F"})</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ReproductionPage() {
  const [estrusForm, setEstrusForm] = useState({ animalId: "", date: "", notes: "" })
  const [pregnancyForm, setPregnancyForm] = useState({ motherId: "", fatherId: "", matingDate: "", expectedBirthDate: "" })
  const [birthForm, setBirthForm] = useState({ pregnancyId: "", birthDate: "", numberOfOffspring: "1", notes: "" })
  const [feedback, setFeedback] = useState<{ tab: string; msg: string; ok: boolean } | null>(null)

  const pregnanciesQuery = useGetV1ReproductionPregnancies()
  const pregnancies: any[] = Array.isArray(pregnanciesQuery.data?.data) ? (pregnanciesQuery.data as any).data : []

  function showFeedback(tab: string, ok: boolean, msg: string) {
    setFeedback({ tab, ok, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const estrusMutation = usePostV1ReproductionEstrus({
    mutation: {
      onSuccess: () => {
        setEstrusForm({ animalId: "", date: "", notes: "" })
        showFeedback("estrus", true, "Cio registrado!")
      },
      onError: () => showFeedback("estrus", false, "Erro ao registrar."),
    },
  })

  const pregnancyMutation = usePostV1ReproductionPregnancies({
    mutation: {
      onSuccess: () => {
        setPregnancyForm({ motherId: "", fatherId: "", matingDate: "", expectedBirthDate: "" })
        showFeedback("pregnancy", true, "Gestação registrada!")
      },
      onError: () => showFeedback("pregnancy", false, "Erro ao registrar gestação."),
    },
  })

  const birthMutation = usePostV1ReproductionBirth({
    mutation: {
      onSuccess: () => {
        setBirthForm({ pregnancyId: "", birthDate: "", numberOfOffspring: "1", notes: "" })
        showFeedback("birth", true, "Parto registrado!")
      },
      onError: () => showFeedback("birth", false, "Erro ao registrar parto."),
    },
  })

  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader title="Reprodução" description="Controle de ciclos reprodutivos, gestações e partos" />
        <div className="p-6">
          <Tabs defaultValue="estrus">
            <TabsList>
              <TabsTrigger value="estrus">Estro / Cio</TabsTrigger>
              <TabsTrigger value="pregnancy">Gestação</TabsTrigger>
              <TabsTrigger value="birth">Partos</TabsTrigger>
            </TabsList>

            <TabsContent value="estrus" className="mt-4">
              <Card className="max-w-lg">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="size-4" />Registrar Cio</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5"><Label>Fêmea *</Label><AnimalSelect value={estrusForm.animalId} onChange={(v) => setEstrusForm({ ...estrusForm, animalId: v })} femaleOnly /></div>
                  <div className="space-y-1.5"><Label>Data *</Label><Input type="date" value={estrusForm.date} onChange={(e) => setEstrusForm({ ...estrusForm, date: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Observações</Label><Textarea placeholder="Notas..." value={estrusForm.notes} onChange={(e) => setEstrusForm({ ...estrusForm, notes: e.target.value })} /></div>
                  {feedback?.tab === "estrus" && <p className={`text-sm ${feedback.ok ? "text-primary" : "text-destructive"}`}>{feedback.msg}</p>}
                  <Button className="w-full" disabled={estrusMutation.isPending || !estrusForm.animalId || !estrusForm.date} onClick={() => estrusMutation.mutate({ data: { animalId: estrusForm.animalId, date: estrusForm.date, notes: estrusForm.notes || undefined } })}>
                    {estrusMutation.isPending ? "Salvando..." : "Registrar Cio"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pregnancy" className="mt-4">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="size-4" />Nova Gestação</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5"><Label>Mãe (Fêmea) *</Label><AnimalSelect value={pregnancyForm.motherId} onChange={(v) => setPregnancyForm({ ...pregnancyForm, motherId: v })} femaleOnly /></div>
                    <div className="space-y-1.5"><Label>Pai (Macho)</Label><AnimalSelect value={pregnancyForm.fatherId} onChange={(v) => setPregnancyForm({ ...pregnancyForm, fatherId: v })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><Label>Data Acasalamento *</Label><Input type="date" value={pregnancyForm.matingDate} onChange={(e) => setPregnancyForm({ ...pregnancyForm, matingDate: e.target.value })} /></div>
                      <div className="space-y-1.5"><Label>Previsão de Parto</Label><Input type="date" value={pregnancyForm.expectedBirthDate} onChange={(e) => setPregnancyForm({ ...pregnancyForm, expectedBirthDate: e.target.value })} /></div>
                    </div>
                    {feedback?.tab === "pregnancy" && <p className={`text-sm ${feedback.ok ? "text-primary" : "text-destructive"}`}>{feedback.msg}</p>}
                    <Button className="w-full" disabled={pregnancyMutation.isPending || !pregnancyForm.motherId || !pregnancyForm.matingDate} onClick={() => pregnancyMutation.mutate({ data: { motherId: pregnancyForm.motherId, fatherId: pregnancyForm.fatherId || undefined, matingDate: pregnancyForm.matingDate, expectedBirthDate: pregnancyForm.expectedBirthDate || undefined } })}>
                      {pregnancyMutation.isPending ? "Salvando..." : "Registrar Gestação"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-base">Gestações Ativas</CardTitle></CardHeader>
                  <CardContent>
                    {pregnanciesQuery.isLoading ? (
                      <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
                    ) : pregnancies.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma gestação registrada</p>
                    ) : (
                      <div className="space-y-2">
                        {pregnancies.slice(0, 6).map((p: any) => (
                          <div key={p.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                            <span className="font-medium">{p.motherId ?? "Desconhecida"}</span>
                            <Badge variant="default">{p.expectedBirthDate ? new Date(p.expectedBirthDate).toLocaleDateString("pt-BR") : "Sem previsão"}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="birth" className="mt-4">
              <Card className="max-w-lg">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="size-4" />Registrar Parto</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>ID da Gestação *</Label>
                    <Input placeholder="UUID da gestação" value={birthForm.pregnancyId} onChange={(e) => setBirthForm({ ...birthForm, pregnancyId: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Data do Parto *</Label><Input type="date" value={birthForm.birthDate} onChange={(e) => setBirthForm({ ...birthForm, birthDate: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Nº de Filhotes *</Label><Input type="number" min="1" value={birthForm.numberOfOffspring} onChange={(e) => setBirthForm({ ...birthForm, numberOfOffspring: e.target.value })} /></div>
                  </div>
                  <div className="space-y-1.5"><Label>Observações</Label><Textarea placeholder="Notas do parto..." value={birthForm.notes} onChange={(e) => setBirthForm({ ...birthForm, notes: e.target.value })} /></div>
                  {feedback?.tab === "birth" && <p className={`text-sm ${feedback.ok ? "text-primary" : "text-destructive"}`}>{feedback.msg}</p>}
                  <Button className="w-full" disabled={birthMutation.isPending || !birthForm.pregnancyId || !birthForm.birthDate} onClick={() => birthMutation.mutate({ data: { pregnancyId: birthForm.pregnancyId, birthDate: birthForm.birthDate, numberOfOffspring: Number(birthForm.numberOfOffspring), notes: birthForm.notes || undefined } })}>
                    {birthMutation.isPending ? "Salvando..." : "Registrar Parto"}
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
