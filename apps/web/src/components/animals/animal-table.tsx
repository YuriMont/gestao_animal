import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type GetV1AnimalsQueryParamsStatusEnumKey,
	type GetV1EnumsAnimalsStatus200,
} from "@/gen";
import { Pencil, Trash2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

import { AnimalForm } from "./animal-form";
import type { AnimalFormData } from "./types";

interface AnimalTableProps {
	animals: any[];
	animalsStatus: GetV1EnumsAnimalsStatus200 | undefined;
	onEdit: (animal: any) => void;
	onDelete: (animal: any) => void;
	editAnimal: null | {
		id: string;
		form: AnimalFormData;
	};
	setEditAnimal: (
		animal: null | {
			id: string;
			form: AnimalFormData;
		},
	) => void;
	handleUpdate: () => void;
	updateMutationPending: boolean;
}

function statusBadgeVariant(
	status: GetV1AnimalsQueryParamsStatusEnumKey,
): "default" | "secondary" | "destructive" | "success" | "warning" | "outline" {
	const variants: Record<
		string,
		"default" | "secondary" | "destructive" | "success" | "warning" | "outline"
	> = {
		ACTIVE: "success",
		INACTIVE: "warning",
		SOLD: "secondary",
		DECEASED: "destructive",
	};
	return variants[status] ?? "outline";
}

function statusLabel(
	animalsStatus: GetV1EnumsAnimalsStatus200,
	status: string,
) {
	return animalsStatus.find((item) => item.key === status)?.label ?? status;
}

export function AnimalTable({
	animals,
	animalsStatus,
	onEdit,
	onDelete,
	editAnimal,
	setEditAnimal,
	handleUpdate,
	updateMutationPending,
}: AnimalTableProps) {
	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Tag</TableHead>
						<TableHead>Espécie</TableHead>
						<TableHead>Raça</TableHead>
						<TableHead>Sexo</TableHead>
						<TableHead>Nascimento</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{animals.map((animal) => (
						<TableRow key={animal.id}>
							<TableCell className="font-mono font-medium">
								{animal.tag}
							</TableCell>
							<TableCell>{animal.species}</TableCell>
							<TableCell>{animal.breedName ?? "—"}</TableCell>
							<TableCell>{animal.sex === "MALE" ? "Macho" : "Fêmea"}</TableCell>
							<TableCell>
								{new Date(animal.birthDate).toLocaleDateString("pt-BR")}
							</TableCell>
							<TableCell>
								<Badge variant={statusBadgeVariant(animal.status)}>
									{statusLabel(animalsStatus!, animal.status)}
								</Badge>
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end gap-1">
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => onEdit(animal)}
									>
										<Pencil className="size-3.5" />
									</Button>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => onDelete(animal)}
									>
										<Trash2 className="size-3.5 text-destructive" />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Dialog
				open={!!editAnimal}
				onOpenChange={(o) => {
					if (!o) setEditAnimal(null);
				}}
			>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Editar Animal</DialogTitle>
					</DialogHeader>
					{editAnimal && (
						<AnimalForm
							form={editAnimal.form}
							onChange={(f) => setEditAnimal({ ...editAnimal, form: f })}
						/>
					)}
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditAnimal(null)}>
							Cancelar
						</Button>
						<Button onClick={handleUpdate} disabled={updateMutationPending}>
							{updateMutationPending ? "Salvando..." : "Salvar"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
