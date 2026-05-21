import type { PrismaClient, Species } from "@generated/prisma/client";
import type {
  BreedRecord,
  CreateBreedDTO,
  ListBreedsQuery,
  UpdateBreedDTO,
} from "./breeds.types";

export interface IBreedRepository {
  create(
    data: CreateBreedDTO & { organizationId: string },
  ): Promise<BreedRecord>;
  findById(id: string, organizationId: string): Promise<BreedRecord | null>;
  findByNameAndSpecies(
    name: string,
    species: Species,
    organizationId: string,
  ): Promise<BreedRecord | null>;
  list(
    organizationId: string,
    filters: ListBreedsQuery,
  ): Promise<{ breeds: BreedRecord[]; total: number }>;
  update(
    id: string,
    data: UpdateBreedDTO,
    organizationId: string,
  ): Promise<BreedRecord>;
  delete(id: string, organizationId: string): Promise<void>;
}

export class PrismaBreedRepository implements IBreedRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateBreedDTO & { organizationId: string },
  ): Promise<BreedRecord> {
    return this.prisma.breed.create({ data });
  }

  async findById(
    id: string,
    organizationId: string,
  ): Promise<BreedRecord | null> {
    return this.prisma.breed.findFirst({ where: { id, organizationId } });
  }

  async findByNameAndSpecies(
    name: string,
    species: Species,
    organizationId: string,
  ): Promise<BreedRecord | null> {
    return this.prisma.breed.findFirst({
      where: { name, species, organizationId },
    });
  }

  async list(
    organizationId: string,
    filters: ListBreedsQuery,
  ): Promise<{ breeds: BreedRecord[]; total: number }> {
    const { page = 1, limit = 20, ...where } = filters;
    const skip = (page - 1) * limit;
    const dbWhere = { organizationId, ...where };
    const [breeds, total] = await this.prisma.$transaction([
      this.prisma.breed.findMany({
        where: dbWhere,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      this.prisma.breed.count({ where: dbWhere }),
    ]);
    return { breeds, total };
  }

  async update(
    id: string,
    data: UpdateBreedDTO,
    organizationId: string,
  ): Promise<BreedRecord> {
    return this.prisma.breed.update({
      where: { id, organizationId },
      data,
    });
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.animal.updateMany({
        where: { breedId: id },
        data: { breedId: null },
      }),
      this.prisma.breed.delete({ where: { id, organizationId } }),
    ]);
  }
}
