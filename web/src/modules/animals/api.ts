import api from "@/api/client";
import type { Animal, CreateAnimalInput } from "./types";

export const animalApi = {
	async getAll(): Promise<Animal[]> {
		const { data } = await api.get<Animal[]>("/animals");
		return data;
	},

	async getById(id: string): Promise<Animal> {
		const { data } = await api.get<Animal>(`/animals/${id}`);
		return data;
	},

	async create(input: CreateAnimalInput): Promise<Animal> {
		const { data } = await api.post<{ animal: Animal }>("/animals", input);
		return data.animal;
	},

	async update(id: string, input: Partial<CreateAnimalInput>): Promise<Animal> {
		const { data } = await api.patch<Animal>(`/animals/${id}`, input);
		return data;
	},

	async delete(id: string): Promise<void> {
		await api.delete(`/animals/${id}`);
	},
};
