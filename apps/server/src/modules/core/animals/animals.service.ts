import { ConflictError, NotFoundError } from "@src/common/errors/app-error";
import type { IAnimalRepository } from "./animals.repository";
import type {
  AnimalWithBreed,
  CreateAnimalDTO,
  ListAnimalsQuery,
  UpdateAnimalDTO,
} from "./animals.types";

export class AnimalService {
  constructor(private readonly repo: IAnimalRepository) {}

  async create(data: CreateAnimalDTO, orgId: string): Promise<AnimalWithBreed> {
    const existing = await this.repo.findByTag(data.tag, orgId);
    if (existing) {
      throw new ConflictError(
        "Animal with this tag already exists in the organization",
      );
    }
    return this.repo.create({ ...data, organizationId: orgId });
  }

  async list(orgId: string, filters: ListAnimalsQuery) {
    return this.repo.list(orgId, filters);
  }

  async getById(id: string, orgId: string): Promise<AnimalWithBreed> {
    const animal = await this.repo.findById(id, orgId);
    if (!animal) throw new NotFoundError("Animal");
    return animal;
  }

  async update(
    id: string,
    orgId: string,
    data: UpdateAnimalDTO,
  ): Promise<AnimalWithBreed> {
    await this.getById(id, orgId);
    return this.repo.update(id, data, orgId);
  }

  async delete(id: string, orgId: string): Promise<void> {
    await this.getById(id, orgId);
    await this.repo.delete(id, orgId);
  }
}
