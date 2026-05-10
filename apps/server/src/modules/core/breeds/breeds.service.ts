import type { Species } from "@generated/prisma/client";
import { ConflictError, NotFoundError } from "@src/common/errors/app-error";
import type { IBreedRepository } from "./breeds.repository";
import type {
  BreedRecord,
  CreateBreedDTO,
  ListBreedsQuery,
  UpdateBreedDTO,
} from "./breeds.types";

export class BreedService {
  constructor(private readonly repo: IBreedRepository) {}

  async create(data: CreateBreedDTO, orgId: string): Promise<BreedRecord> {
    const existing = await this.repo.findByNameAndSpecies(
      data.name,
      data.species,
      orgId,
    );
    if (existing) {
      throw new ConflictError(
        "Breed with this name and species already exists in the organization",
      );
    }
    return this.repo.create({ ...data, organizationId: orgId });
  }

  async list(orgId: string, filters: ListBreedsQuery) {
    return this.repo.list(orgId, filters);
  }

  async getById(id: string, orgId: string): Promise<BreedRecord> {
    const breed = await this.repo.findById(id, orgId);
    if (!breed) throw new NotFoundError("Breed");
    return breed;
  }

  async update(
    id: string,
    orgId: string,
    data: UpdateBreedDTO,
  ): Promise<BreedRecord> {
    const existing = await this.getById(id, orgId);
    const name = data.name ?? existing.name;
    const species = data.species ?? existing.species;
    const duplicate = await this.repo.findByNameAndSpecies(
      name,
      species as Species,
      orgId,
    );
    if (duplicate && duplicate.id !== id) {
      throw new ConflictError(
        "Breed with this name and species already exists in the organization",
      );
    }
    return this.repo.update(id, data, orgId);
  }

  async delete(id: string, orgId: string): Promise<void> {
    await this.getById(id, orgId);
    await this.repo.delete(id, orgId);
  }
}
