import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { animalApi } from "./api";
import { type CreateAnimalInput, createAnimalSchema } from "./types";

interface AnimalFormProps {
	isOpen: boolean;
	onClose: () => void;
}

export function AnimalForm({ isOpen, onClose }: AnimalFormProps) {
	const queryClient = useQueryClient();
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateAnimalInput>({
		resolver: zodResolver(createAnimalSchema),
	});

	const mutation = useMutation({
		mutationFn: (data: CreateAnimalInput) => animalApi.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["animals"] });
			setIsSubmitted(true);
			setTimeout(() => {
				setIsSubmitted(false);
				reset();
				onClose();
			}, 2000);
		},
	});

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
				<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
					<h3 className="text-lg font-semibold text-slate-800">
						Add New Animal
					</h3>
					<button
						onClick={onClose}
						className="p-1 hover:bg-slate-200 rounded-full transition-colors"
					>
						<X className="w-5 h-5 text-slate-500" />
					</button>
				</div>

				{isSubmitted ? (
					<div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
						<div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
							<CheckCircle2 className="w-8 h-8" />
						</div>
						<div>
							<h4 className="text-xl font-bold text-slate-900">
								Animal Created!
							</h4>
							<p className="text-slate-500">
								The animal has been successfully registered.
							</p>
						</div>
					</div>
				) : (
					<form
						onSubmit={handleSubmit((data) => mutation.mutate(data))}
						className="p-6 space-y-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-slate-700">
									Tag
								</label>
								<input
									{...register("tag")}
									className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-emerald-500/20 outline-none ${
										errors.tag
											? "border-red-500"
											: "border-slate-200 focus:border-emerald-500"
									}`}
									placeholder="e.g. BR-102"
								/>
								{errors.tag && (
									<p className="text-xs text-red-500">{errors.tag.message}</p>
								)}
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-slate-700">
									Species
								</label>
								<input
									{...register("species")}
									className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:ring-2 focus:ring-emerald-500/20 outline-none ${
										errors.species
											? "border-red-500"
											: "border-slate-200 focus:border-emerald-500"
									}`}
									placeholder="e.g. Bovine"
								/>
								{errors.species && (
									<p className="text-xs text-red-500">
										{errors.species.message}
									</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-slate-700">
									Breed (Optional)
								</label>
								<input
									{...register("breed")}
									className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-emerald-500/20 outline-none focus:border-emerald-500"
									placeholder="e.g. Angus"
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-slate-700">
									Sex
								</label>
								<select
									{...register("sex")}
									className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-emerald-500/20 outline-none focus:border-emerald-500 bg-white"
								>
									<option value="">Select...</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
								{errors.sex && (
									<p className="text-xs text-red-500">{errors.sex.message}</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-slate-700">
									Birth Date
								</label>
								<input
									type="date"
									{...register("birthDate")}
									className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-emerald-500/20 outline-none focus:border-emerald-500"
								/>
								{errors.birthDate && (
									<p className="text-xs text-red-500">
										{errors.birthDate.message}
									</p>
								)}
							</div>
							<div className="space-y-1.5">
								<label className="text-sm font-medium text-slate-700">
									Status
								</label>
								<select
									{...register("status")}
									className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-emerald-500/20 outline-none focus:border-emerald-500 bg-white"
								>
									<option value="">Select...</option>
									<option value="Active">Active</option>
									<option value="Quarantine">Quarantine</option>
									<option value="Sold">Sold</option>
								</select>
								{errors.status && (
									<p className="text-xs text-red-500">
										{errors.status.message}
									</p>
								)}
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-sm font-medium text-slate-700">
								Origin (Optional)
							</label>
							<input
								{...register("origin")}
								className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm transition-all focus:ring-2 focus:ring-emerald-500/20 outline-none focus:border-emerald-500"
								placeholder="e.g. Local Farm A"
							/>
						</div>

						<div className="pt-6 flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={mutation.isPending}
								className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm disabled:opacity-50"
							>
								{mutation.isPending ? "Creating..." : "Create Animal"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
