import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Beef,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { AnimalForm } from "@/components/animals/animal-form";
import { AnimalTable } from "@/components/animals/animal-table";
import type { AnimalFormData } from "@/components/animals/types";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";
import {
  type GetV1Animals200,
  type GetV1AnimalsQueryParamsSexEnumKey,
  type GetV1AnimalsQueryParamsSpeciesEnumKey,
  type GetV1AnimalsQueryParamsStatusEnumKey,
  type PostV1AnimalsMutationRequestOriginEnumKey,
  type PostV1AnimalsMutationRequestSpeciesEnumKey,
  postV1AnimalsMutationRequestSchema,
  useGetV1Breeds,
  useGetV1EnumsAnimalsSex,
  useGetV1EnumsAnimalsSpecies,
  useGetV1EnumsAnimalsStatus,
} from "@/gen";

type AnimalItem = GetV1Animals200["data"][number];

import { Badge } from "@/components/ui/badge";
import { useDeleteV1AnimalsId } from "@/gen/hooks/animalsController/useDeleteV1AnimalsId";
import {
  getV1AnimalsQueryKey,
  useGetV1Animals,
} from "@/gen/hooks/animalsController/useGetV1Animals";
import { usePostV1Animals } from "@/gen/hooks/animalsController/usePostV1Animals";
import { usePutV1AnimalsId } from "@/gen/hooks/animalsController/usePutV1AnimalsId";

export const Route = createFileRoute("/animals")({
  component: AnimalsPage,
});

const defaultForm: AnimalFormData = {
  tag: "",
  species: "" as PostV1AnimalsMutationRequestSpeciesEnumKey,
  breedId: "",
  sex: "FEMALE",
  birthDate: "",
  origin: "" as PostV1AnimalsMutationRequestOriginEnumKey,
  status: "ACTIVE",
};

function AnimalsPage() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<AnimalFormData>(defaultForm);
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Draft state - only committed on Buscar click
  const [tagDraft, setTagDraft] = useState("");
  const [sexDraft, setSexDraft] = useState("");
  const [speciesDraft, setSpeciesDraft] = useState("");
  const [breedDraft, setBreedDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState("");
  const [birthDateStartDraft, setBirthDateStartDraft] = useState("");
  const [birthDateEndDraft, setBirthDateEndDraft] = useState("");

  // Committed filters that drive the query
  const [tagFilter, setTagFilter] = useState("");
  const [sexFilter, setSexFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [breedFilter, setBreedFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [birthDateStartFilter, setBirthDateStartFilter] = useState("");
  const [birthDateEndFilter, setBirthDateEndFilter] = useState("");

  const [editAnimal, setEditAnimal] = useState<null | {
    id: string;
    form: AnimalFormData;
  }>(null);

  const { data: animalsStatus } = useGetV1EnumsAnimalsStatus();
  const { data: animalsSex } = useGetV1EnumsAnimalsSex();
  const { data: animalsSpecies } = useGetV1EnumsAnimalsSpecies();
  const { data: breedsData } = useGetV1Breeds(
    { species: speciesDraft as GetV1AnimalsQueryParamsSpeciesEnumKey },
    { query: { enabled: !!speciesDraft } },
  );

  const params = {
    page,
    limit: 15,
    ...(tagFilter && { tag: tagFilter }),
    ...(sexFilter && { sex: sexFilter as GetV1AnimalsQueryParamsSexEnumKey }),
    ...(speciesFilter && {
      species: speciesFilter as GetV1AnimalsQueryParamsSpeciesEnumKey,
    }),
    ...(breedFilter && { breedId: breedFilter }),
    ...(statusFilter && {
      status: statusFilter as GetV1AnimalsQueryParamsStatusEnumKey,
    }),
    ...(birthDateStartFilter && { birthDateStart: birthDateStartFilter }),
    ...(birthDateEndFilter && { birthDateEnd: birthDateEndFilter }),
  };

  const animalsQuery = useGetV1Animals(params);
  const animals = animalsQuery.data?.data ?? [];
  const meta = animalsQuery.data?.meta;

  const [mutationError, setMutationError] = useState<string | null>(null);

  const createMutation = usePostV1Animals({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getV1AnimalsQueryKey() });
        setCreateOpen(false);
        setForm(defaultForm);
        setMutationError(null);
      },
      onError: () => setMutationError("Erro ao criar animal. Tente novamente."),
    },
  });

  const updateMutation = usePutV1AnimalsId({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getV1AnimalsQueryKey() });
        setEditAnimal(null);
        setMutationError(null);
      },
      onError: () =>
        setMutationError("Erro ao atualizar animal. Tente novamente."),
    },
  });

  const deleteMutation = useDeleteV1AnimalsId({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getV1AnimalsQueryKey() });
        setEditAnimal(null);
      },
      onError: () =>
        setMutationError("Erro ao excluir animal. Tente novamente."),
    },
  });

  function handleCreate() {
    const result = postV1AnimalsMutationRequestSchema.safeParse(form);
    if (!result.success) return;
    createMutation.mutate({
      data: {
        ...result.data,
      },
    });
  }

  function handleUpdate() {
    if (!editAnimal) return;
    updateMutation.mutate({
      id: editAnimal.id,
      data: {
        ...editAnimal.form,
      },
    });
  }

  function handleEdit(animal: AnimalItem) {
    setEditAnimal({
      id: animal.id,
      form: {
        tag: animal.tag,
        species: animal.species
          .key as PostV1AnimalsMutationRequestSpeciesEnumKey,
        breedId: animal.breed?.id || "",
        sex: animal.sex.key as AnimalFormData["sex"],
        birthDate: animal.birthDate,
        origin: animal.origin?.key as
          | PostV1AnimalsMutationRequestOriginEnumKey
          | undefined,
        status: animal.status.key as AnimalFormData["status"],
      },
    });
  }

  function handleDelete(animal: AnimalItem) {
    deleteMutation.mutate({
      id: animal.id,
    });
  }

  function handleSearch() {
    setPage(1);
    setTagFilter(tagDraft);
    setSexFilter(sexDraft);
    setSpeciesFilter(speciesDraft);
    setBreedFilter(breedDraft);
    setStatusFilter(statusDraft);
    setBirthDateStartFilter(birthDateStartDraft);
    setBirthDateEndFilter(birthDateEndDraft);
  }

  function handleClearFilters() {
    setTagDraft("");
    setSexDraft("");
    setSpeciesDraft("");
    setBreedDraft("");
    setStatusDraft("");
    setBirthDateStartDraft("");
    setBirthDateEndDraft("");
    setPage(1);
    setTagFilter("");
    setSexFilter("");
    setSpeciesFilter("");
    setBreedFilter("");
    setStatusFilter("");
    setBirthDateStartFilter("");
    setBirthDateEndFilter("");
  }

  const hasActiveFilters =
    !!tagFilter ||
    !!sexFilter ||
    !!speciesFilter ||
    !!breedFilter ||
    !!statusFilter ||
    !!birthDateStartFilter ||
    !!birthDateEndFilter;

  const activeFiltersCount = [
    tagDraft,
    sexDraft,
    speciesDraft,
    breedDraft,
    statusDraft,
    birthDateStartDraft,
    birthDateEndDraft,
  ].filter(Boolean).length;

  return (
    <AppLayout>
      <div className="flex flex-col">
        <PageHeader
          title="Animais"
          description="Gerencie o rebanho da sua propriedade"
        >
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Novo Animal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg w-full mx-auto">
              <DialogHeader>
                <DialogTitle>Novo Animal</DialogTitle>
              </DialogHeader>
              <AnimalForm form={form} onChange={setForm} />
              {mutationError && (
                <p className="text-sm text-destructive">{mutationError}</p>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Search bar */}
          <div className="space-y-4">
            {/* Top Bar */}
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

                <Input
                  placeholder="Buscar por tag, brinco ou identificação..."
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-11 pl-10 pr-4 rounded-xl bg-background"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant={sheetOpen ? "default" : "outline"}
                  onClick={() => setSheetOpen(!sheetOpen)}
                  className="h-11 rounded-xl gap-2 px-4"
                >
                  <Filter className="size-4" />

                  <span>Filtros</span>

                  {activeFiltersCount > 0 && (
                    <div className="min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-white text-[11px] flex items-center justify-center">
                      {activeFiltersCount}
                    </div>
                  )}

                  {sheetOpen ? (
                    <ChevronUp className="size-4 opacity-70" />
                  ) : (
                    <ChevronDown className="size-4 opacity-70" />
                  )}
                </Button>

                <Button onClick={handleSearch} className="h-11 rounded-xl px-5">
                  <Search className="size-4 mr-2" />
                  Buscar
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={handleClearFilters}
                    className="h-11 rounded-xl"
                  >
                    <X className="size-4 mr-2" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {/* Filters Panel */}
            {sheetOpen && (
              <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-5 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-base">
                        Filtros avançados
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        Refine sua busca utilizando os campos abaixo
                      </p>
                    </div>

                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        {activeFiltersCount} ativo
                        {activeFiltersCount > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>

                  {/* Main Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Sexo */}
                    <div className="space-y-2">
                      <Label>Sexo</Label>

                      <Select
                        value={sexDraft || "__all__"}
                        onValueChange={(v) =>
                          setSexDraft(v === "__all__" ? "" : v)
                        }
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="__all__">Todos</SelectItem>

                          {animalsSex?.map((item) => (
                            <SelectItem key={item.key} value={item.key}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Espécie */}
                    <div className="space-y-2">
                      <Label>Espécie</Label>

                      <Select
                        value={speciesDraft || "__all__"}
                        onValueChange={(v) => {
                          const value = v === "__all__" ? "" : v;

                          setSpeciesDraft(value);

                          if (value) {
                            setBreedDraft("");
                          }
                        }}
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="__all__">Todas</SelectItem>

                          {animalsSpecies?.map((item) => (
                            <SelectItem key={item.key} value={item.key}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Raça */}
                    <div className="space-y-2">
                      <Label>Raça</Label>

                      <Select
                        value={breedDraft || "__all__"}
                        onValueChange={(v) =>
                          setBreedDraft(v === "__all__" ? "" : v)
                        }
                        disabled={!speciesDraft}
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue
                            placeholder={
                              speciesDraft ? "Selecione" : "Escolha uma espécie"
                            }
                          />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="__all__">Todas</SelectItem>

                          {breedsData?.data.map((breed) => (
                            <SelectItem key={breed.id} value={breed.id}>
                              {breed.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label>Status</Label>

                      <Select
                        value={statusDraft || "__all__"}
                        onValueChange={(v) =>
                          setStatusDraft(v === "__all__" ? "" : v)
                        }
                      >
                        <SelectTrigger className="h-10 rounded-xl">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="__all__">Todos</SelectItem>

                          {animalsStatus?.map((item) => (
                            <SelectItem key={item.key} value={item.key}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label>Período de nascimento</Label>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="date"
                        value={birthDateStartDraft}
                        onChange={(e) => setBirthDateStartDraft(e.target.value)}
                        className="h-10 rounded-xl"
                      />

                      <Input
                        type="date"
                        value={birthDateEndDraft}
                        onChange={(e) => setBirthDateEndDraft(e.target.value)}
                        className="h-10 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={handleClearFilters}>
                      Limpar filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              {animalsQuery.isLoading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : animals.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
                  <Beef className="size-10 opacity-30" />
                  <p className="text-sm">Nenhum animal encontrado</p>
                </div>
              ) : (
                <AnimalTable
                  animals={animals}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  editAnimal={editAnimal}
                  setEditAnimal={setEditAnimal}
                  handleUpdate={handleUpdate}
                  updateMutationPending={updateMutation.isPending}
                />
              )}
            </CardContent>
          </Card>

          {meta && meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
              <span className="text-center sm:text-left">
                {meta.total} animais no total
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="touch-target h-9 w-9 p-0"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs sm:text-sm">
                  {page}/{meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="touch-target h-9 w-9 p-0"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
