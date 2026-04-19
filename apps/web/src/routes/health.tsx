import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useGetV1Animals } from "@/gen/hooks/animalsController/useGetV1Animals";
import { usePostV1HealthRecords } from "@/gen/hooks/healthController/usePostV1HealthRecords";
import { usePostV1HealthTreatments } from "@/gen/hooks/healthController/usePostV1HealthTreatments";
import { usePostV1HealthVaccines } from "@/gen/hooks/healthController/usePostV1HealthVaccines";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/health")({
  component: HealthPage,
});

function AnimalSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const animalsQuery = useGetV1Animals({ limit: 100 });
  const animals = animalsQuery.data?.data ?? [];
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione o animal" />
      </SelectTrigger>
      <SelectContent>
        {animals.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {a.tag} — {a.species}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function HealthPage() {
  const [vaccineForm, setVaccineForm] = useState({
    animalId: "",
    vaccineName: "",
    doseNumber: "1",
    dateAdministered: "",
    nextDueDate: "",
  });
  const [treatmentForm, setTreatmentForm] = useState({
    animalId: "",
    treatmentType: "",
    medication: "",
    dosage: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [recordForm, setRecordForm] = useState({
    animalId: "",
    recordType: "",
    description: "",
    date: "",
  });
  const [feedback, setFeedback] = useState<{
    tab: string;
    msg: string;
    ok: boolean;
  } | null>(null);

  function showFeedback(tab: string, ok: boolean, msg: string) {
    setFeedback({ tab, ok, msg });
    setTimeout(() => setFeedback(null), 3000);
  }

  const vaccineMutation = usePostV1HealthVaccines({
    mutation: {
      onSuccess: () => {
        setVaccineForm({
          animalId: "",
          vaccineName: "",
          doseNumber: "1",
          dateAdministered: "",
          nextDueDate: "",
        });
        showFeedback("vaccines", true, "Vacina registrada com sucesso!");
      },
      onError: () =>
        showFeedback("vaccines", false, "Erro ao registrar vacina."),
    },
  });

  const treatmentMutation = usePostV1HealthTreatments({
    mutation: {
      onSuccess: () => {
        setTreatmentForm({
          animalId: "",
          treatmentType: "",
          medication: "",
          dosage: "",
          startDate: "",
          endDate: "",
          notes: "",
        });
        showFeedback("treatments", true, "Tratamento registrado!");
      },
      onError: () =>
        showFeedback("treatments", false, "Erro ao registrar tratamento."),
    },
  });

  const recordMutation = usePostV1HealthRecords({
    mutation: {
      onSuccess: () => {
        setRecordForm({
          animalId: "",
          recordType: "",
          description: "",
          date: "",
        });
        showFeedback("records", true, "Registro criado!");
      },
      onError: () => showFeedback("records", false, "Erro ao criar registro."),
    },
  });

  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title="Saúde Animal"
          description="Registre vacinas, tratamentos e ocorrências de saúde"
        />
        <div className="p-6">
          <Tabs defaultValue="vaccines">
            <TabsList>
              <TabsTrigger value="vaccines">Vacinas</TabsTrigger>
              <TabsTrigger value="treatments">Tratamentos</TabsTrigger>
              <TabsTrigger value="records">Registros</TabsTrigger>
            </TabsList>

            <TabsContent value="vaccines" className="mt-4">
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
                      onChange={(v) =>
                        setVaccineForm({ ...vaccineForm, animalId: v })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nome da Vacina *</Label>
                    <Input
                      placeholder="Ex: Febre Aftosa"
                      value={vaccineForm.vaccineName}
                      onChange={(e) =>
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
                        onChange={(e) =>
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
                        onChange={(e) =>
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
                      onChange={(e) =>
                        setVaccineForm({
                          ...vaccineForm,
                          nextDueDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  {feedback?.tab === "vaccines" && (
                    <p
                      className={`text-sm ${feedback.ok ? "text-primary" : "text-destructive"}`}
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
                      ? "Salvando..."
                      : "Registrar Vacina"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="treatments" className="mt-4">
              <Card className="max-w-lg">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Plus className="size-4" />
                    Registrar Tratamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Animal *</Label>
                    <AnimalSelect
                      value={treatmentForm.animalId}
                      onChange={(v) =>
                        setTreatmentForm({ ...treatmentForm, animalId: v })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Tipo de Tratamento *</Label>
                    <Input
                      placeholder="Ex: Vermifugação"
                      value={treatmentForm.treatmentType}
                      onChange={(e) =>
                        setTreatmentForm({
                          ...treatmentForm,
                          treatmentType: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Medicamento</Label>
                      <Input
                        placeholder="Nome do medicamento"
                        value={treatmentForm.medication}
                        onChange={(e) =>
                          setTreatmentForm({
                            ...treatmentForm,
                            medication: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Dosagem</Label>
                      <Input
                        placeholder="Ex: 10ml"
                        value={treatmentForm.dosage}
                        onChange={(e) =>
                          setTreatmentForm({
                            ...treatmentForm,
                            dosage: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Data Início *</Label>
                      <Input
                        type="date"
                        value={treatmentForm.startDate}
                        onChange={(e) =>
                          setTreatmentForm({
                            ...treatmentForm,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Data Fim</Label>
                      <Input
                        type="date"
                        value={treatmentForm.endDate}
                        onChange={(e) =>
                          setTreatmentForm({
                            ...treatmentForm,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Observações</Label>
                    <Textarea
                      placeholder="Notas adicionais..."
                      value={treatmentForm.notes}
                      onChange={(e) =>
                        setTreatmentForm({
                          ...treatmentForm,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                  {feedback?.tab === "treatments" && (
                    <p
                      className={`text-sm ${feedback.ok ? "text-primary" : "text-destructive"}`}
                    >
                      {feedback.msg}
                    </p>
                  )}
                  <Button
                    className="w-full"
                    disabled={
                      treatmentMutation.isPending ||
                      !treatmentForm.animalId ||
                      !treatmentForm.treatmentType ||
                      !treatmentForm.startDate
                    }
                    onClick={() =>
                      treatmentMutation.mutate({
                        data: {
                          animalId: treatmentForm.animalId,
                          treatmentType: treatmentForm.treatmentType,
                          medication: treatmentForm.medication,
                          dosage: treatmentForm.dosage || undefined,
                          startDate: treatmentForm.startDate,
                          endDate: treatmentForm.endDate || undefined,
                          notes: treatmentForm.notes || undefined,
                        },
                      })
                    }
                  >
                    {treatmentMutation.isPending
                      ? "Salvando..."
                      : "Registrar Tratamento"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="records" className="mt-4">
              <Card className="max-w-lg">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Plus className="size-4" />
                    Novo Registro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Animal *</Label>
                    <AnimalSelect
                      value={recordForm.animalId}
                      onChange={(v) =>
                        setRecordForm({ ...recordForm, animalId: v })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Tipo *</Label>
                      <Input
                        placeholder="Ex: Exame"
                        value={recordForm.recordType}
                        onChange={(e) =>
                          setRecordForm({
                            ...recordForm,
                            recordType: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Data *</Label>
                      <Input
                        type="date"
                        value={recordForm.date}
                        onChange={(e) =>
                          setRecordForm({ ...recordForm, date: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Descrição *</Label>
                    <Textarea
                      placeholder="Descreva o registro..."
                      value={recordForm.description}
                      onChange={(e) =>
                        setRecordForm({
                          ...recordForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  {feedback?.tab === "records" && (
                    <p
                      className={`text-sm ${feedback.ok ? "text-primary" : "text-destructive"}`}
                    >
                      {feedback.msg}
                    </p>
                  )}
                  <Button
                    className="w-full"
                    disabled={
                      recordMutation.isPending ||
                      !recordForm.animalId ||
                      !recordForm.recordType ||
                      !recordForm.description ||
                      !recordForm.date
                    }
                    onClick={() =>
                      recordMutation.mutate({
                        data: {
                          animalId: recordForm.animalId,
                          recordType: recordForm.recordType,
                          description: recordForm.description,
                          date: recordForm.date,
                        },
                      })
                    }
                  >
                    {recordMutation.isPending
                      ? "Salvando..."
                      : "Salvar Registro"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
