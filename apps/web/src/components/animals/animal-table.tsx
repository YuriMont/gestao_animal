import { useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Milk, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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
import type { GetV1AnimalsQueryParamsStatusEnumKey } from "@/gen";
import type { Animal } from "@/types/animal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AnimalForm } from "./animal-form";
import type { AnimalFormData } from "./types";

interface AnimalTableProps {
  animals: Animal[];
  onEdit: (animal: Animal) => void;
  onDelete: (animal: Animal) => void;
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
  deleteMutationPending: boolean;
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
    QUARANTINE: "warning",
    SOLD: "secondary",
    DECEASED: "destructive",
  };
  return variants[status] ?? "outline";
}

export function AnimalTable({
  animals,
  onEdit,
  onDelete,
  editAnimal,
  setEditAnimal,
  handleUpdate,
  updateMutationPending,
  deleteMutationPending,
}: AnimalTableProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);

  function handleEditClick(animal: Animal) {
    onEdit(animal);
  }

  function handleHealthClick(animal: Animal) {
    navigate({ to: "/health", search: { animalId: animal.id } });
  }

  function handleReproductionClick(animal: Animal) {
    navigate({ to: "/reproduction", search: { animalId: animal.id } });
  }

  function handleProductionClick(animal: Animal) {
    navigate({ to: "/production", search: { animalId: animal.id } });
  }

  function handleDeleteClick(animal: Animal) {
    setAnimalToDelete(animal);
    setDeleteDialogOpen(true);
  }

  function confirmDelete() {
    if (animalToDelete) {
      onDelete(animalToDelete);
      setDeleteDialogOpen(false);
      setAnimalToDelete(null);
    }
  }
  return (
    <>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <Table className="min-w-[600px]">
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
                <TableCell>{animal.species.label}</TableCell>
                <TableCell>{animal.breed?.name ?? "—"}</TableCell>
                <TableCell>{animal.sex.label}</TableCell>
                <TableCell>
                  {new Date(animal.birthDate).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusBadgeVariant(
                      animal.status.key as GetV1AnimalsQueryParamsStatusEnumKey,
                    )}
                  >
                    {animal.status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <Menu className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEditClick(animal)}>
                        <Pencil className="mr-2 size-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleHealthClick(animal)}
                      >
                        <Plus className="mr-2 size-4" />
                        Saúde
                      </DropdownMenuItem>
                      {animal.sex.key === "FEMALE" && (
                        <DropdownMenuItem
                          onClick={() => handleReproductionClick(animal)}
                        >
                          <Heart className="mr-2 size-4" />
                          Reprodução
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleProductionClick(animal)}
                      >
                        <Milk className="mr-2 size-4" />
                        Produção
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDeleteClick(animal)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Excluir Animal</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o animal {animalToDelete?.tag}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutationPending}
            >
              {deleteMutationPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
