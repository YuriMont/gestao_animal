import type { MilkProduction } from "@src/modules/production/domain/entities/milk-production.entity";
import type { WeightRecord } from "@src/modules/production/domain/entities/weight-record.entity";

export interface IProductionRepository {
  createWeight(record: WeightRecord): Promise<WeightRecord>;
  createMilk(production: MilkProduction): Promise<MilkProduction>;
  getAnimalMetrics(
    animalId: string,
    organizationId: string,
  ): Promise<{
    weights: WeightRecord[];
    milk: MilkProduction[];
  }>;
}
