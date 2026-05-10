import type { PrismaClient } from "@generated/prisma/client";
import type {
  CreateHealthRecordDTO,
  CreateTreatmentDTO,
  CreateVaccineDTO,
  HealthRecord,
  TreatmentRecord,
  VaccineRecord,
} from "./health.types";

export interface IHealthRepository {
  createRecord(
    data: CreateHealthRecordDTO & { organizationId: string },
  ): Promise<HealthRecord>;
  createVaccine(
    data: CreateVaccineDTO & { organizationId: string },
  ): Promise<VaccineRecord>;
  createTreatment(
    data: CreateTreatmentDTO & { organizationId: string },
  ): Promise<TreatmentRecord>;
  findByAnimal(
    animalId: string,
    organizationId: string,
  ): Promise<{
    records: HealthRecord[];
    vaccines: VaccineRecord[];
    treatments: TreatmentRecord[];
  }>;
}

export class PrismaHealthRepository implements IHealthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createRecord(
    data: CreateHealthRecordDTO & { organizationId: string },
  ): Promise<HealthRecord> {
    return this.prisma.healthRecord.create({ data });
  }

  async createVaccine(
    data: CreateVaccineDTO & { organizationId: string },
  ): Promise<VaccineRecord> {
    return this.prisma.vaccine.create({ data });
  }

  async createTreatment(
    data: CreateTreatmentDTO & { organizationId: string },
  ): Promise<TreatmentRecord> {
    return this.prisma.treatment.create({ data });
  }

  async findByAnimal(animalId: string, organizationId: string) {
    const [records, vaccines, treatments] = await Promise.all([
      this.prisma.healthRecord.findMany({
        where: { animalId, organizationId },
      }),
      this.prisma.vaccine.findMany({ where: { animalId, organizationId } }),
      this.prisma.treatment.findMany({
        where: { animalId, organizationId },
      }),
    ]);
    return { records, vaccines, treatments };
  }
}
