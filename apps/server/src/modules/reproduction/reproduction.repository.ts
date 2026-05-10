import type { PrismaClient } from "@generated/prisma/client";
import type {
  BirthRecord,
  CreateBirthDTO,
  CreateEstrusDTO,
  CreateInseminationDTO,
  CreatePregnancyDTO,
  EstrusRecord,
  InseminationRecord,
  PregnancyRecord,
} from "./reproduction.types";

export interface IReproductionRepository {
  createEstrus(
    data: CreateEstrusDTO & { organizationId: string },
  ): Promise<EstrusRecord>;
  createPregnancy(
    data: CreatePregnancyDTO & { organizationId: string },
  ): Promise<PregnancyRecord>;
  createBirth(
    data: CreateBirthDTO & { organizationId: string },
  ): Promise<BirthRecord>;
  createInsemination(
    data: CreateInseminationDTO & { organizationId: string },
  ): Promise<InseminationRecord>;
  listPregnancies(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<{ pregnancies: PregnancyRecord[]; total: number }>;
  listInseminations(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<{ inseminations: InseminationRecord[]; total: number }>;
  findAnimalHistory(
    animalId: string,
    organizationId: string,
  ): Promise<{
    estrus: EstrusRecord[];
    pregnancies: PregnancyRecord[];
    births: BirthRecord[];
    inseminations: InseminationRecord[];
  }>;
}

export class PrismaReproductionRepository implements IReproductionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createEstrus(
    data: CreateEstrusDTO & { organizationId: string },
  ): Promise<EstrusRecord> {
    return this.prisma.estrus.create({ data });
  }

  async createPregnancy(
    data: CreatePregnancyDTO & { organizationId: string },
  ): Promise<PregnancyRecord> {
    return this.prisma.pregnancy.create({ data });
  }

  async createBirth(
    data: CreateBirthDTO & { organizationId: string },
  ): Promise<BirthRecord> {
    return this.prisma.birth.create({ data });
  }

  async createInsemination(
    data: CreateInseminationDTO & { organizationId: string },
  ): Promise<InseminationRecord> {
    return this.prisma.insemination.create({ data });
  }

  async listPregnancies(
    organizationId: string,
    page = 1,
    limit = 20,
  ): Promise<{ pregnancies: PregnancyRecord[]; total: number }> {
    const skip = (page - 1) * limit;
    const [pregnancies, total] = await Promise.all([
      this.prisma.pregnancy.findMany({
        where: { organizationId },
        skip,
        take: limit,
      }),
      this.prisma.pregnancy.count({ where: { organizationId } }),
    ]);
    return { pregnancies, total };
  }

  async listInseminations(
    organizationId: string,
    page = 1,
    limit = 20,
  ): Promise<{ inseminations: InseminationRecord[]; total: number }> {
    const skip = (page - 1) * limit;
    const [inseminations, total] = await Promise.all([
      this.prisma.insemination.findMany({
        where: { organizationId },
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      this.prisma.insemination.count({ where: { organizationId } }),
    ]);
    return { inseminations, total };
  }

  async findAnimalHistory(animalId: string, organizationId: string) {
    const [estrus, pregnancies, births, inseminations] = await Promise.all([
      this.prisma.estrus.findMany({ where: { animalId, organizationId } }),
      this.prisma.pregnancy.findMany({
        where: { animalId, organizationId },
      }),
      this.prisma.birth.findMany({
        where: {
          OR: [{ motherId: animalId }, { fatherId: animalId }],
          organizationId,
        },
      }),
      this.prisma.insemination.findMany({
        where: {
          OR: [{ animalId }, { fatherId: animalId }],
          organizationId,
        },
      }),
    ]);
    return { estrus, pregnancies, births, inseminations };
  }
}
