import type { PrismaClient } from "@generated/prisma/client";
import type {
  CreateHealthRecordDTO,
  CreateTreatmentDTO,
  CreateVaccineDTO,
  HealthRecord,
  HealthSummary,
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
  getSummary(organizationId: string): Promise<HealthSummary>;
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

  async getSummary(organizationId: string): Promise<HealthSummary> {
    const now = new Date();

    const [activeTreatments, vaccinesDue] = await Promise.all([
      this.prisma.treatment.count({
        where: { organizationId, endDate: null },
      }),
      this.prisma.vaccine.count({
        where: {
          organizationId,
          nextDueDate: { lte: now },
        },
      }),
    ]);

    return { activeTreatments, vaccinesDue };
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
