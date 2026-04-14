import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AnimalForm } from "./AnimalForm";
import { AnimalsTable } from "./AnimalsTable";
import { animalApi } from "./api";

export function AnimalsPage() {
	const [isFormOpen, setIsFormOpen] = useState(false);

	const { data, isLoading } = useQuery({
		queryKey: ["animals"],
		queryFn: () => animalApi.getAll(),
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64 text-slate-500 italic">
				Loading animals...
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-slate-800">
					Animals Management
				</h2>
				<button
					onClick={() => setIsFormOpen(true)}
					className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm shadow-sm"
				>
					+ Add Animal
				</button>
			</div>

			<AnimalsTable data={data || []} />

			<AnimalForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
		</div>
	);
}
