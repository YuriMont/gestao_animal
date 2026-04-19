import type { Animal } from "@src/modules/core/domain/entities/animal.entity";
import type { IAnimalRepository } from "@src/modules/core/domain/repositories/animal.repository";
import type { AnimalSex, AnimalStatus } from "generated/prisma";

export interface GetAnimalsFilters {
	status?: AnimalStatus;
	species?: string;
	sex?: AnimalSex;
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

export class GetAnimalsUseCase {
	constructor(private readonly animalRepository: IAnimalRepository) {}

	async execute(
		organizationId: string,
		filters: GetAnimalsFilters = {},
	): Promise<PaginatedAnimals> {
		const { page = 1, limit = 20, ...rest } = filters;

		const result = await this.animalRepository.listByOrganization(
			organizationId,
			{
				...rest,
				page,
				limit,
			},
		);

		return result;
	}
}
