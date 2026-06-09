import type { IProductionRepository } from "./production.repository";
import type {
  AnimalMetrics,
  CreateMilkDTO,
  CreateWeightDTO,
  MilkProductionRecord,
  ProductionSummary,
  WeightRecord,
} from "./production.types";

export class ProductionService {
  constructor(private readonly repo: IProductionRepository) {}

  async createWeight(
    data: CreateWeightDTO,
    orgId: string,
  ): Promise<WeightRecord> {
    return this.repo.createWeight({
      ...data,
      date: data.date ?? new Date(),
      organizationId: orgId,
    });
  }

  async createMilk(
    data: CreateMilkDTO,
    orgId: string,
  ): Promise<MilkProductionRecord> {
    return this.repo.createMilk({
      ...data,
      date: data.date ?? new Date(),
      organizationId: orgId,
    });
  }

  async getSummary(orgId: string): Promise<ProductionSummary> {
    return this.repo.getSummary(orgId);
  }

  async getMetrics(animalId: string, orgId: string): Promise<AnimalMetrics> {
    const raw = await this.repo.getAnimalMetrics(animalId, orgId);

    const averageWeight =
      raw.weights.length > 0
        ? raw.weights.reduce((sum, w) => sum + w.weight, 0) / raw.weights.length
        : 0;
    const totalMilk = raw.milk.reduce((sum, m) => sum + m.quantity, 0);

    return {
      animalId,
      averageWeight,
      totalMilk,
      lastWeight: raw.weights.at(-1)?.weight,
      lastMilk: raw.milk.at(-1)?.quantity,
    };
  }
}
