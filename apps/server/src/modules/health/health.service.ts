import type { IHealthRepository } from "./health.repository";
import type {
  CreateHealthRecordDTO,
  CreateTreatmentDTO,
  CreateVaccineDTO,
  HealthRecord,
  TreatmentRecord,
  VaccineRecord,
} from "./health.types";

export class HealthService {
  constructor(private readonly repo: IHealthRepository) {}

  async createRecord(
    data: CreateHealthRecordDTO,
    orgId: string,
  ): Promise<HealthRecord> {
    return this.repo.createRecord({ ...data, organizationId: orgId });
  }

  async createVaccine(
    data: CreateVaccineDTO,
    orgId: string,
  ): Promise<VaccineRecord> {
    return this.repo.createVaccine({ ...data, organizationId: orgId });
  }

  async createTreatment(
    data: CreateTreatmentDTO,
    orgId: string,
  ): Promise<TreatmentRecord> {
    return this.repo.createTreatment({ ...data, organizationId: orgId });
  }

  async getAnimalHistory(animalId: string, orgId: string) {
    return this.repo.findByAnimal(animalId, orgId);
  }
}
