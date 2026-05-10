import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetV1Animals } from "@/gen/hooks/animalsController/useGetV1Animals";

export function AnimalSelect({
  value,
  onChange,
  femaleOnly,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  femaleOnly?: boolean;
  id?: string;
}) {
  const animalsQuery = useGetV1Animals({
    limit: 100,
    ...(femaleOnly !== undefined
      ? { sex: femaleOnly ? "FEMALE" : "MALE" }
      : {}),
  });
  const animals = animalsQuery.data?.data ?? [];
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Selecione o animal" />
      </SelectTrigger>
      <SelectContent>
        {animals.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {a.tag} — {a.species.label} ({a.sex.key === "MALE" ? "M" : "F"})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
