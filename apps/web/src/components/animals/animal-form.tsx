import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type PostV1AnimalsMutationRequestOriginEnumKey,
  type PostV1AnimalsMutationRequestSexEnumKey,
  type PostV1AnimalsMutationRequestSpeciesEnumKey,
  type PostV1AnimalsMutationRequestStatusEnumKey,
  useGetV1Breeds,
  useGetV1EnumsAnimalsOrigin,
  useGetV1EnumsAnimalsSex,
  useGetV1EnumsAnimalsSpecies,
  useGetV1EnumsAnimalsStatus,
} from "@/gen";
import type { AnimalFormData } from "./types";

interface AnimalFormProps {
  form: AnimalFormData;
  onChange: (f: AnimalFormData) => void;
}

export function AnimalForm({ form, onChange }: AnimalFormProps) {
  const { data: animalsSex } = useGetV1EnumsAnimalsSex();
  const { data: animalsStatus } = useGetV1EnumsAnimalsStatus();
  const { data: animalsSpecies } = useGetV1EnumsAnimalsSpecies();
  const { data: animalsOrigin } = useGetV1EnumsAnimalsOrigin();
  const { data: breedsData } = useGetV1Breeds(
    { species: form.species ?? undefined },
    { query: { enabled: !!form.species } },
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label>Tag *</Label>
        <Input
          placeholder="Ex: BOV-001"
          value={form.tag}
          onChange={(e) => onChange({ ...form, tag: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Espécie *</Label>
        <Select
          value={form.species}
          onValueChange={(v) =>
            onChange({
              ...form,
              species: v as PostV1AnimalsMutationRequestSpeciesEnumKey,
              breedId: undefined,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {animalsSpecies?.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Raça</Label>
        <Select
          value={form.breedId ?? ""}
          onValueChange={(v) => onChange({ ...form, breedId: v })}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                form.species
                  ? "Selecione a raça"
                  : "Selecione uma espécie primeiro"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {breedsData?.data.map((breed) => (
              <SelectItem key={breed.id} value={breed.id}>
                {breed.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Sexo *</Label>
        <Select
          value={form.sex}
          onValueChange={(v) =>
            onChange({
              ...form,
              sex: v as PostV1AnimalsMutationRequestSexEnumKey,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {animalsSex?.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Data de Nascimento *</Label>
        <Input
          type="date"
          value={form.birthDate}
          onChange={(e) => onChange({ ...form, birthDate: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Origem</Label>
        <Select
          value={form.origin ?? ""}
          onValueChange={(v) =>
            onChange({
              ...form,
              origin:
                (v as PostV1AnimalsMutationRequestOriginEnumKey) || undefined,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {animalsOrigin?.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2 space-y-1.5">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(v) =>
            onChange({
              ...form,
              status: v as PostV1AnimalsMutationRequestStatusEnumKey,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {animalsStatus?.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
