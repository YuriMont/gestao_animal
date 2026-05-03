import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
	useGetV1EnumsFinancialCategories,
	useGetV1EnumsFinancialTypes,
} from "@/gen";
import {
	getV1FinancialRecordsQueryKey,
} from "@/gen/hooks/financialController/useGetV1FinancialRecords";
import {
	getV1FinancialSummaryQueryKey,
} from "@/gen/hooks/financialController/useGetV1FinancialSummary";
import { usePostV1FinancialRecords } from "@/gen/hooks/financialController/usePostV1FinancialRecords";
import type { PostV1FinancialRecordsMutationRequestTypeEnumKey } from "@/gen/models/financialController/PostV1FinancialRecords";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

const INITIAL_FINANCIAL_FORM = {
	type: "INCOME" as PostV1FinancialRecordsMutationRequestTypeEnumKey,
	category: "",
	amount: 0,
	date: "",
	description: "",
};

export function FinancialFormDialog() {
	const qc = useQueryClient();
	const [open, setOpen] = useState(false);
	const { data: financialTypes } = useGetV1EnumsFinancialTypes();
	const { data: financialCategories } = useGetV1EnumsFinancialCategories();
	const [form, setForm] = useState(INITIAL_FINANCIAL_FORM);

	const [error, setError] = useState<string | null>(null);

	const createMutation = usePostV1FinancialRecords({
		mutation: {
			onSuccess: () => {
				qc.invalidateQueries({ queryKey: getV1FinancialRecordsQueryKey() });
				qc.invalidateQueries({ queryKey: getV1FinancialSummaryQueryKey() });
				setOpen(false);
				setForm(INITIAL_FINANCIAL_FORM);
				setError(null);
			},
			onError: () => setError("Erro ao salvar lançamento. Tente novamente."),
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm">
					<Plus className="size-4" />
					Novo Lançamento
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Novo Lançamento Financeiro</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label>Tipo *</Label>
							<Select
								value={form.type}
								onValueChange={(v) =>
									setForm({
										...form,
										type: v as PostV1FinancialRecordsMutationRequestTypeEnumKey,
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{financialTypes?.map((item) => (
										<SelectItem key={item.key} value={item.key}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1.5">
							<Label>Categoria *</Label>
							<Select
								value={form.category}
								onValueChange={(v) => setForm({ ...form, category: v })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione..." />
								</SelectTrigger>
								<SelectContent>
									{financialCategories?.map((item) => (
										<SelectItem key={item.key} value={item.key}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5">
							<Label>Valor (R$) *</Label>
							<Input
								type="number"
								step="0.01"
								placeholder="0,00"
								value={form.amount || ""}
								onChange={(e) =>
									setForm({ ...form, amount: Number(e.target.value) })
								}
							/>
						</div>
						<div className="space-y-1.5">
							<Label>Data *</Label>
							<Input
								type="date"
								value={form.date}
								onChange={(e) =>
									setForm({ ...form, date: e.target.value })
								}
							/>
						</div>
					</div>
					<div className="space-y-1.5">
						<Label>Descrição</Label>
						<Textarea
							placeholder="Detalhes..."
							value={form.description}
							onChange={(e) =>
								setForm({ ...form, description: e.target.value })
							}
						/>
					</div>
				</div>
				{error && <p className="text-sm text-destructive">{error}</p>}
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancelar
					</Button>
					<Button
						disabled={
							createMutation.isPending ||
							!form.category ||
							!form.amount ||
							!form.date
						}
						onClick={() =>
							createMutation.mutate({
								data: {
									type: form.type,
									category: form.category,
									amount: Number(form.amount),
									date: form.date,
									description: form.description || undefined,
								},
							})
						}
					>
						{createMutation.isPending ? "Salvando..." : "Salvar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
