import type { PrismaClient } from "@generated/prisma/client";
import type {
  AnimalWithBreed,
  CreateAnimalDTO,
  ListAnimalsQuery,
  UpdateAnimalDTO,
} from "./animals.types";

const include = { breed: true } as const;

function toRecord(a: any): AnimalWithBreed {
  return {
    id: a.id,
    tag: a.tag,
    species: a.species,
    breedId: a.breedId,
    breed: a.breed ? { id: a.breed.id, name: a.breed.name } : null,
    sex: a.sex,
    birthDate: a.birthDate,
    origin: a.origin,
    status: a.status,
  };
}

export interface IAnimalRepository {
  create(
    data: CreateAnimalDTO & { organizationId: string },
  ): Promise<AnimalWithBreed>;
  findById(id: string, organizationId: string): Promise<AnimalWithBreed | null>;
  findByTag(
    tag: string,
    organizationId: string,
  ): Promise<AnimalWithBreed | null>;
  list(
    organizationId: string,
    filters: ListAnimalsQuery,
  ): Promise<{ animals: AnimalWithBreed[]; total: number }>;
  update(
    id: string,
    data: UpdateAnimalDTO,
    organizationId: string,
  ): Promise<AnimalWithBreed>;
  delete(id: string, organizationId: string): Promise<void>;
}

export class PrismaAnimalRepository implements IAnimalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateAnimalDTO & { organizationId: string },
  ): Promise<AnimalWithBreed> {
    const a = await this.prisma.animal.create({
      data,
      include,
    });
    return toRecord(a);
  }

  async findById(
    id: string,
    organizationId: string,
  ): Promise<AnimalWithBreed | null> {
    const a = await this.prisma.animal.findFirst({
      where: { id, organizationId },
      include,
    });
    return a ? toRecord(a) : null;
  }

  async findByTag(
    tag: string,
    organizationId: string,
  ): Promise<AnimalWithBreed | null> {
    const a = await this.prisma.animal.findFirst({
      where: { tag, organizationId },
      include,
    });
    return a ? toRecord(a) : null;
  }

  async list(
    organizationId: string,
    filters: ListAnimalsQuery,
  ): Promise<{ animals: AnimalWithBreed[]; total: number }> {
    const { page = 1, limit = 20, ...where } = filters;
    const skip = (page - 1) * limit;
    const dbWhere = { organizationId, ...where };
    const [animals, total] = await this.prisma.$transaction([
      this.prisma.animal.findMany({
        where: dbWhere,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include,
      }),
      this.prisma.animal.count({ where: dbWhere }),
    ]);
    return { animals: animals.map(toRecord), total };
  }

  async update(
    id: string,
    data: UpdateAnimalDTO,
    organizationId: string,
  ): Promise<AnimalWithBreed> {
    const a = await this.prisma.animal.update({
      where: { id, organizationId },
      data,
      include,
    });
    return toRecord(a);
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await this.prisma.animal.delete({ where: { id, organizationId } });
  }
}
