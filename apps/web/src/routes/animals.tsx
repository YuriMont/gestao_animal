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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	type GetV1AnimalsQueryParamsStatusEnumKey,
	postV1AnimalsMutationRequestSchema,
	useGetV1EnumsAnimalsStatus,
} from "@/gen";
import { useDeleteV1AnimalsId } from "@/gen/hooks/animalsController/useDeleteV1AnimalsId";
import {
	getV1AnimalsQueryKey,
	useGetV1Animals,
} from "@/gen/hooks/animalsController/useGetV1Animals";
import { usePostV1Animals } from "@/gen/hooks/animalsController/usePostV1Animals";
import { usePutV1AnimalsId } from "@/gen/hooks/animalsController/usePutV1AnimalsId";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Beef, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/animals")({
	component: AnimalsPage,
});

const defaultForm: AnimalFormData = {
	tag: "",
	species: "",
	breedId: "",
	sex: "FEMALE",
	birthDate: "",
	origin: "",
	status: "ACTIVE",
};

function AnimalsPage() {
	const qc = useQueryClient();
	const [createOpen, setCreateOpen] = useState(false);
	const [form, setForm] = useState<AnimalFormData>(defaultForm);
	const [page, setPage] = useState(1);

	// "Draft" state — only committed to query on Buscar click
	const [statusDraft, setStatusDraft] =
		useState<GetV1AnimalsQueryParamsStatusEnumKey>();
	const [speciesDraft, setSpeciesDraft] = useState("");

	// Committed filters that actually drive the query
	const [statusFilter, setStatusFilter] =
		useState<GetV1AnimalsQueryParamsStatusEnumKey>();
	const [speciesFilter, setSpeciesFilter] = useState("");

	const [editAnimal, setEditAnimal] = useState<null | {
		id: string;
		form: AnimalFormData;
	}>(null);

	const { data: animalsStatus } = useGetV1EnumsAnimalsStatus();

	const params = {
		page,
		limit: 15,
		...(statusFilter && { status: statusFilter }),
		...(speciesFilter && { species: speciesFilter }),
	};

	const animalsQuery = useGetV1Animals(params);
	const animals = animalsQuery.data?.data ?? [];
	const meta = animalsQuery.data?.meta;

	const createMutation = usePostV1Animals({
		mutation: {
			onSuccess: () => {
				qc.invalidateQueries({ queryKey: getV1AnimalsQueryKey() });
				setCreateOpen(false);
				setForm(defaultForm);
			},
		},
	});

	const updateMutation = usePutV1AnimalsId({
		mutation: {
			onSuccess: () => {
				qc.invalidateQueries({ queryKey: getV1AnimalsQueryKey() });
				setEditAnimal(null);
			},
		},
	});

	const deleteMutation = useDeleteV1AnimalsId({
		mutation: {
			onSuccess: () => {
				qc.invalidateQueries({ queryKey: getV1AnimalsQueryKey() });
				setEditAnimal(null);
			},
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

	function handleEdit(animal: any) {
		setEditAnimal({
			id: animal.id,
			form: {
				tag: animal.tag,
				species: animal.species,
				breedId: animal.breedId || "",
				sex: animal.sex,
				birthDate: animal.birthDate,
				origin: animal.origin || "",
				status: animal.status,
			},
		});
	}

	function handleDelete(animal: any) {
		deleteMutation.mutate({
			id: animal.id,
		});
	}

	function handleSearch() {
		setPage(1);
		setStatusFilter(statusDraft);
		setSpeciesFilter(speciesDraft);
	}

	function handleClearFilters() {
		setStatusDraft(undefined);
		setSpeciesDraft("");
		setPage(1);
		setStatusFilter(undefined);
		setSpeciesFilter("");
	}

	const hasActiveFilters = !!statusFilter || !!speciesFilter;

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
						<DialogContent className="max-w-lg">
							<DialogHeader>
								<DialogTitle>Novo Animal</DialogTitle>
							</DialogHeader>
							<AnimalForm form={form} onChange={setForm} />
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

				<div className="p-6 space-y-4">
					{/* Search bar — committed only on button click */}
					<div className="flex gap-3 flex-wrap">
						<div className="flex items-center gap-2 flex-1 min-w-48 max-w-xs">
							<Search className="size-4 text-muted-foreground shrink-0" />
							<Input
								placeholder="Filtrar por espécie..."
								value={speciesDraft}
								onChange={(e) => setSpeciesDraft(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
								className="h-8"
							/>
						</div>
						<Select
							value={statusDraft ?? "all"}
							onValueChange={(v) => {
								if (v === "all") {
									setStatusDraft(undefined);
								} else {
									setStatusDraft(v as GetV1AnimalsQueryParamsStatusEnumKey);
								}
							}}
						>
							<SelectTrigger className="w-44 h-8">
								<SelectValue placeholder="Todos os status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos os status</SelectItem>
								{animalsStatus?.map((item) => (
									<SelectItem key={item.key} value={item.key}>
										{item.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button size="sm" onClick={handleSearch} className="h-8">
							<Search className="size-3.5" />
							Buscar
						</Button>
						{hasActiveFilters && (
							<Button
								size="sm"
								variant="ghost"
								onClick={handleClearFilters}
								className="h-8"
							>
								Limpar filtros
							</Button>
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
									animalsStatus={animalsStatus}
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
						<div className="flex items-center justify-between text-sm text-muted-foreground">
							<span>{meta.total} animais no total</span>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={page <= 1}
									onClick={() => setPage((p) => p - 1)}
								>
									<ChevronLeft className="size-4" />
								</Button>
								<span>
									Página {page} de {meta.totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									disabled={page >= meta.totalPages}
									onClick={() => setPage((p) => p + 1)}
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
