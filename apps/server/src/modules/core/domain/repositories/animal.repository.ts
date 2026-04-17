import type { Animal } from "@src/modules/core/domain/entities/animal.entity";

export interface AnimalFilters {
	status?: string;
	species?: string;
	sex?: string;
	page?: number;
	limit?: number;
}

export interface PaginatedAnimals {
	animals: Animal[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface IAnimalRepository {
	create(animal: Animal): Promise<Animal>;
	findById(id: string, organizationId: string): Promise<Animal | null>;
	findByTag(tag: string, organizationId: string): Promise<Animal | null>;
	listByOrganization(
		organizationId: string,
		filters?: AnimalFilters,
	): Promise<PaginatedAnimals>;
	update(animal: Animal): Promise<Animal>;
	delete(id: string, organizationId: string): Promise<void>;
}
