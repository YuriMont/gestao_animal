import type { PrismaClient } from "@generated/prisma/client";
import type {
  AnimalPayload,
  CreateAnimalDTO,
  ListAnimalsQuery,
  UpdateAnimalDTO,
} from "./animals.types";

export interface IAnimalRepository {
  create(
    data: CreateAnimalDTO & { organizationId: string },
  ): Promise<AnimalPayload>;
  findById(id: string, organizationId: string): Promise<AnimalPayload | null>;
  findByTag(tag: string, organizationId: string): Promise<AnimalPayload | null>;
  list(
    organizationId: string,
    filters: ListAnimalsQuery,
  ): Promise<{ animals: AnimalPayload[]; total: number }>;
  update(
    id: string,
    data: UpdateAnimalDTO,
    organizationId: string,
  ): Promise<AnimalPayload>;
  delete(id: string, organizationId: string): Promise<void>;
}

export class PrismaAnimalRepository implements IAnimalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateAnimalDTO & { organizationId: string },
  ): Promise<AnimalPayload> {
    const a = await this.prisma.animal.create({
      data,
      include: {
        breed: true,
      },
    });
    return a;
  }

  async findById(
    id: string,
    organizationId: string,
  ): Promise<AnimalPayload | null> {
    const a = await this.prisma.animal.findFirst({
      where: { id, organizationId },
      include: {
        breed: true,
      },
    });
    return a ?? null;
  }

  async findByTag(
    tag: string,
    organizationId: string,
  ): Promise<AnimalPayload | null> {
    const a = await this.prisma.animal.findFirst({
      where: { tag, organizationId },
      include: {
        breed: true,
      },
    });
    return a;
  }

  async list(
    organizationId: string,
    filters: ListAnimalsQuery,
  ): Promise<{ animals: AnimalPayload[]; total: number }> {
    const { page = 1, limit = 20, tag, birthDateStart, birthDateEnd, ...where } = filters;
    const skip = (page - 1) * limit;

    const dbWhere: any = { organizationId, ...where };

    if (tag) {
      dbWhere.tag = { contains: tag, mode: "insensitive" };
    }

    if (birthDateStart || birthDateEnd) {
      dbWhere.birthDate = {};
      if (birthDateStart) dbWhere.birthDate.gte = birthDateStart;
      if (birthDateEnd) dbWhere.birthDate.lte = birthDateEnd;
    }

    const [animals, total] = await this.prisma.$transaction([
      this.prisma.animal.findMany({
        where: dbWhere,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          breed: true,
        },
      }),
      this.prisma.animal.count({ where: dbWhere }),
    ]);
    return { animals: animals, total };
  }

  async update(
    id: string,
    data: UpdateAnimalDTO,
    organizationId: string,
  ): Promise<AnimalPayload> {
    const a = await this.prisma.animal.update({
      where: { id, organizationId },
      data,
      include: {
        breed: true,
      },
    });
    return a;
  }

  async delete(id: string, organizationId: string): Promise<void> {
    await this.prisma.animal.delete({ where: { id, organizationId } });
  }
}
