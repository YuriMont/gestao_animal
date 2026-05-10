import type { IReproductionRepository } from "./reproduction.repository";
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

export class ReproductionService {
  constructor(private readonly repo: IReproductionRepository) {}

  async createEstrus(
    data: CreateEstrusDTO,
    orgId: string,
  ): Promise<EstrusRecord> {
    return this.repo.createEstrus({ ...data, organizationId: orgId });
  }

  async createPregnancy(
    data: CreatePregnancyDTO,
    orgId: string,
  ): Promise<PregnancyRecord> {
    return this.repo.createPregnancy({ ...data, organizationId: orgId });
  }

  async createBirth(data: CreateBirthDTO, orgId: string): Promise<BirthRecord> {
    return this.repo.createBirth({ ...data, organizationId: orgId });
  }

  async createInsemination(
    data: CreateInseminationDTO,
    orgId: string,
  ): Promise<InseminationRecord> {
    return this.repo.createInsemination({
      ...data,
      date: data.date ?? new Date(),
      organizationId: orgId,
    });
  }

  async listPregnancies(orgId: string, page: number, limit: number) {
    return this.repo.listPregnancies(orgId, page, limit);
  }

  async listInseminations(orgId: string, page: number, limit: number) {
    return this.repo.listInseminations(orgId, page, limit);
  }

  async getAnimalHistory(animalId: string, orgId: string) {
    return this.repo.findAnimalHistory(animalId, orgId);
  }
}
