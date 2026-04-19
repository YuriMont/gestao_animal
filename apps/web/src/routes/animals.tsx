import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Beef,
	ChevronLeft,
	ChevronRight,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import type { z } from "zod/v4";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
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
	type PostV1AnimalsMutationRequestSexEnumKey,
	type PostV1AnimalsMutationRequestStatusEnumKey,
	postV1AnimalsMutationRequestSchema,
	useGetV1EnumsAnimalsSex,
	useGetV1EnumsAnimalsStatus,
} from "@/gen";
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

type AnimalFormData = z.infer<typeof postV1AnimalsMutationRequestSchema>;

const defaultForm: AnimalFormData = {
	tag: "",
	species: "",
	breed: "",
	sex: "FEMALE" as PostV1AnimalsMutationRequestSexEnumKey,
	birthDate: "",
	origin: "",
	status: "ACTIVE" as PostV1AnimalsMutationRequestStatusEnumKey,
};

function statusBadgeVariant(
	status: GetV1AnimalsQueryParamsStatusEnumKey,
): "default" | "secondary" | "destructive" | "success" | "warning" | "outline" {
	switch (status) {
		case "ACTIVE":
			return "success";
		case "INACTIVE":
			return "warning";
		case "SOLD":
			return "secondary";
		case "DECEASED":
			return "destructive";
		default:
			return "outline";
	}
}

function statusLabel(
	animalsStatus: GetV1EnumsAnimalsStatus200,
	status: string,
) {
	return animalsStatus.filter((item) => (item.key = status))[0].label;
}

function AnimalForm({
	form,
	onChange,
}: {
	form: AnimalFormData;
	onChange: (f: AnimalFormData) => void;
}) {
	const { data: animalsStatus } = useGetV1EnumsAnimalsStatus();
	const { data: animalsSex } = useGetV1EnumsAnimalsSex();

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

function AnimalsPage() {
	const qc = useQueryClient();
	const [page, setPage] = useState(1);
	const [statusFilter, setStatusFilter] =
		useState<GetV1AnimalsQueryParamsStatusEnumKey>();
	const [speciesFilter, setSpeciesFilter] = useState("");
	const [createOpen, setCreateOpen] = useState(false);
	const [editAnimal, setEditAnimal] = useState<null | {
		id: string;
		form: AnimalFormData;
	}>(null);
	const [form, setForm] = useState<AnimalFormData>(defaultForm);

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
			onSuccess: () =>
				qc.invalidateQueries({ queryKey: getV1AnimalsQueryKey() }),
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
					<div className="flex gap-3">
						<div className="flex items-center gap-2 flex-1 max-w-xs">
							<Search className="size-4 text-muted-foreground shrink-0" />
							<Input
								placeholder="Filtrar por espécie..."
								value={speciesFilter}
								onChange={(e) => {
									setSpeciesFilter(e.target.value);
									setPage(1);
								}}
								className="h-8"
							/>
						</div>
						<Select
							value={statusFilter}
							onValueChange={(v) => {
								if (v === "all") {
									setStatusFilter(undefined);
								} else {
									setStatusFilter(v as GetV1AnimalsQueryParamsStatusEnumKey);
								}

								setPage(1);
							}}
						>
							<SelectTrigger className="w-40 h-8">
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
												<TableCell>{animal.breed ?? "—"}</TableCell>
												<TableCell>
													{animal.sex === "MALE" ? "Macho" : "Fêmea"}
												</TableCell>
												<TableCell>
													{new Date(animal.birthDate).toLocaleDateString(
														"pt-BR",
													)}
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
															onClick={() =>
																setEditAnimal({
																	id: animal.id,
																	form: {
																		tag: animal.tag,
																		species: animal.species,
																		breed: animal.breed ?? "",
																		sex: animal.sex as PostV1AnimalsMutationRequestSexEnumKey,
																		birthDate: animal.birthDate.split("T")[0],
																		origin: animal?.origin ?? "",
																		status:
																			animal.status as PostV1AnimalsMutationRequestStatusEnumKey,
																	},
																})
															}
														>
															<Pencil className="size-3.5" />
														</Button>
														<Button
															variant="ghost"
															size="icon-sm"
															onClick={() => {
																if (confirm(`Excluir ${animal.tag}?`))
																	deleteMutation.mutate({ id: animal.id });
															}}
														>
															<Trash2 className="size-3.5 text-destructive" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
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
						<Button onClick={handleUpdate} disabled={updateMutation.isPending}>
							{updateMutation.isPending ? "Salvando..." : "Salvar"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppLayout>
	);
}
