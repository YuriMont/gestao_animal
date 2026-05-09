import type { Species } from "@generated/prisma/client";
import type { Breed } from "@src/modules/core/domain/entities/breed.entity";
import type { IBreedRepository } from "@src/modules/core/domain/repositories/breed.repository";

export interface GetBreedsFilters {
  species?: Species;
  page?: number;
  limit?: number;
}

export interface PaginatedBreeds {
  breeds: Breed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetBreedsUseCase {
  constructor(private readonly breedRepository: IBreedRepository) {}

  async execute(
    organizationId: string,
    filters: GetBreedsFilters = {},
  ): Promise<PaginatedBreeds> {
    const { page = 1, limit = 20, ...rest } = filters;

    const result = await this.breedRepository.listByOrganization(
      organizationId,
      { ...rest, page, limit },
    );

    return result;
  }
}
