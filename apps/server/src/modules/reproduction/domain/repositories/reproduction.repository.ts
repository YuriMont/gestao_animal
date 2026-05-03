import type { Birth } from "@src/modules/reproduction/domain/entities/birth.entity";
import type { Estrus } from "@src/modules/reproduction/domain/entities/estrus.entity";
import type { Insemination } from "@src/modules/reproduction/domain/entities/insemination.entity";
import type { Pregnancy } from "@src/modules/reproduction/domain/entities/pregnancy.entity";

export interface IReproductionRepository {
  createEstrus(estrus: Estrus): Promise<Estrus>;
  createPregnancy(pregnancy: Pregnancy): Promise<Pregnancy>;
  createBirth(birth: Birth): Promise<Birth>;
  createInsemination(insemination: Insemination): Promise<Insemination>;

  findPregnanciesByOrganization(
    organizationId: string,
    page?: number,
    limit?: number,
  ): Promise<{ pregnancies: Pregnancy[]; total: number }>;
  findInseminationsByOrganization(
    organizationId: string,
    page?: number,
    limit?: number,
  ): Promise<{ inseminations: Insemination[]; total: number }>;
  findReproductionHistoryByAnimal(
    animalId: string,
    organizationId: string,
  ): Promise<{
    estrus: Estrus[];
    pregnancies: Pregnancy[];
    births: Birth[];
    inseminations: Insemination[];
  }>;
}
