import type { Prisma, PrismaClient } from "@generated/prisma/client";
import { NotFoundError } from "@src/common/errors/app-error";
import type {
  CreateParasiteMonitoringDTO,
  ListParasiteMonitoringQuery,
  ParasiteMonitoringRecord,
  UpdateParasiteMonitoringDTO,
} from "./parasitology.types";

export interface ParasiteMonitoringRepository {
  create(
    data: CreateParasiteMonitoringDTO,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord>;
  findById(
    id: string,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord | null>;
  update(
    id: string,
    data: UpdateParasiteMonitoringDTO,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord>;
  delete(id: string, organizationId: string): Promise<void>;
  list(
    query: ListParasiteMonitoringQuery,
    organizationId: string,
  ): Promise<{ data: ParasiteMonitoringRecord[]; total: number }>;
  findByAnimalId(
    animalId: string,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord[]>;
}

export class PrismaParasiteMonitoringRepository
  implements ParasiteMonitoringRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateParasiteMonitoringDTO,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord> {
    const record = await this.prisma.parasiteMonitoring.create({
      data: {
        ...data,
        organizationId,
      },
    });
    return record;
  }

  async findById(
    id: string,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord | null> {
    const record = await this.prisma.parasiteMonitoring.findFirst({
      where: { id, organizationId },
    });
    return record;
  }

  async update(
    id: string,
    data: UpdateParasiteMonitoringDTO,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord> {
    const existing = await this.findById(id, organizationId);
    if (!existing) {
      throw new NotFoundError("Parasite monitoring record not found");
    }

    const record = await this.prisma.parasiteMonitoring.update({
      where: { id },
      data,
    });
    return record;
  }

  async delete(id: string, organizationId: string): Promise<void> {
    const existing = await this.findById(id, organizationId);
    if (!existing) {
      throw new NotFoundError("Parasite monitoring record not found");
    }

    await this.prisma.$transaction([
      this.prisma.parasiteMonitoring.delete({ where: { id } }),
    ]);
  }

  async list(
    query: ListParasiteMonitoringQuery,
    organizationId: string,
  ): Promise<{ data: ParasiteMonitoringRecord[]; total: number }> {
    const { animalId, dateFrom, dateTo, page, limit } = query;

    const where: Prisma.ParasiteMonitoringWhereInput = {
      organizationId,
      ...(animalId && { animalId }),
      ...(dateFrom && { date: { gte: dateFrom } }),
      ...(dateTo && { date: { lte: dateTo } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.parasiteMonitoring.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.parasiteMonitoring.count({ where }),
    ]);

    return { data, total };
  }

  async findByAnimalId(
    animalId: string,
    organizationId: string,
  ): Promise<ParasiteMonitoringRecord[]> {
    const records = await this.prisma.parasiteMonitoring.findMany({
      where: { animalId, organizationId },
      orderBy: { date: "desc" },
    });
    return records;
  }
}
