import type { Animal } from '@src/modules/core/domain/entities/animal.entity';
import type { IAnimalRepository } from '@src/modules/core/domain/repositories/animal.repository';

export interface GetAnimalsFilters {
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

export class GetAnimalsUseCase {
  constructor(private readonly animalRepository: IAnimalRepository) {}

  async execute(organizationId: string, filters: GetAnimalsFilters = {}): Promise<PaginatedAnimals> {
    const { page = 1, limit = 20, ...rest } = filters;
    return this.animalRepository.listByOrganization(organizationId, { ...rest, page, limit });
  }
}
