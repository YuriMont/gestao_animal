import type { HealthRecord } from "@src/modules/health/domain/entities/health-record.entity";
import type { Treatment } from "@src/modules/health/domain/entities/treatment.entity";
import type { Vaccine } from "@src/modules/health/domain/entities/vaccine.entity";

export interface IHealthRepository {
  createRecord(record: HealthRecord): Promise<HealthRecord>;
  createVaccine(vaccine: Vaccine): Promise<Vaccine>;
  createTreatment(treatment: Treatment): Promise<Treatment>;

  findByAnimal(
    animalId: string,
    organizationId: string,
  ): Promise<{
    records: HealthRecord[];
    vaccines: Vaccine[];
    treatments: Treatment[];
  }>;
}
