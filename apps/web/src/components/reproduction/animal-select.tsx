import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GetV1AnimalsQueryParamsSexEnumKey } from "@/gen";
import { useGetV1Animals } from "@/gen/hooks/animalsController/useGetV1Animals";

export function AnimalSelect({
  value,
  onChange,
  sex,
  id,
  femaleOnly,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  sex?: GetV1AnimalsQueryParamsSexEnumKey;
  id?: string;
  femaleOnly?: boolean;
  className?: string;
}) {
  const animalsQuery = useGetV1Animals({
    limit: 100,
    sex: femaleOnly ? "FEMALE" : sex,
  });
  const animals = animalsQuery.data?.data ?? [];
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className={className}>
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
