import type { Species } from "@generated/prisma/client";
import type { Breed } from "@src/modules/core/domain/entities/breed.entity";

export interface BreedFilters {
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

export interface IBreedRepository {
  create(breed: Breed): Promise<Breed>;
  findById(id: string, organizationId: string): Promise<Breed | null>;
  findByNameAndSpecies(
    name: string,
    species: Species,
    organizationId: string,
  ): Promise<Breed | null>;
  listByOrganization(
    organizationId: string,
    filters?: BreedFilters,
  ): Promise<PaginatedBreeds>;
  update(breed: Breed): Promise<Breed>;
  delete(id: string, organizationId: string): Promise<void>;
}
