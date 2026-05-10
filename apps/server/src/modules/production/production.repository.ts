import type { PrismaClient } from "@generated/prisma/client";
import type {
  CreateMilkDTO,
  CreateWeightDTO,
  MilkProductionRecord,
  WeightRecord,
} from "./production.types";

export interface IProductionRepository {
  createWeight(
    data: CreateWeightDTO & { organizationId: string },
  ): Promise<WeightRecord>;
  createMilk(
    data: CreateMilkDTO & { organizationId: string },
  ): Promise<MilkProductionRecord>;
  getAnimalMetrics(
    animalId: string,
    organizationId: string,
  ): Promise<{ weights: WeightRecord[]; milk: MilkProductionRecord[] }>;
}

export class PrismaProductionRepository implements IProductionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createWeight(
    data: CreateWeightDTO & { organizationId: string },
  ): Promise<WeightRecord> {
    return this.prisma.weightRecord.create({ data });
  }

  async createMilk(
    data: CreateMilkDTO & { organizationId: string },
  ): Promise<MilkProductionRecord> {
    return this.prisma.milkProduction.create({ data });
  }

  async getAnimalMetrics(animalId: string, organizationId: string) {
    const [weights, milk] = await Promise.all([
      this.prisma.weightRecord.findMany({
        where: { animalId, organizationId },
        orderBy: { date: "asc" },
      }),
      this.prisma.milkProduction.findMany({
        where: { animalId, organizationId },
        orderBy: { date: "asc" },
      }),
    ]);
    return { weights, milk };
  }
}
