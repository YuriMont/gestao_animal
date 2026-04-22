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
	useGetV1EnumsAnimalsSex,
	useGetV1EnumsAnimalsStatus,
	type PostV1AnimalsMutationRequestSexEnumKey,
	type PostV1AnimalsMutationRequestStatusEnumKey,
} from "@/gen";
import type { AnimalFormData } from "./types";

interface AnimalFormProps {
	form: AnimalFormData;
	onChange: (f: AnimalFormData) => void;
}

export function AnimalForm({ form, onChange }: AnimalFormProps) {
	const { data: animalsSex } = useGetV1EnumsAnimalsSex();
	const { data: animalsStatus } = useGetV1EnumsAnimalsStatus();

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
				<Input
					placeholder="Ex: Bovino"
					value={form.species}
					onChange={(e) => onChange({ ...form, species: e.target.value })}
				/>
			</div>
			<div className="space-y-1.5">
				<Label>Raça</Label>
				<Input
					placeholder="Ex: Nelore"
					value={form.breed}
					onChange={(e) => onChange({ ...form, breed: e.target.value })}
				/>
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
				<Input
					placeholder="Ex: Próprio"
					value={form.origin}
					onChange={(e) => onChange({ ...form, origin: e.target.value })}
				/>
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
