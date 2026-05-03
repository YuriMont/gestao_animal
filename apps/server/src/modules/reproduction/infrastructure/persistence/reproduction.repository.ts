import type { PrismaClient } from "@prisma/client";
import { Birth } from "@src/modules/reproduction/domain/entities/birth.entity";
import { Estrus } from "@src/modules/reproduction/domain/entities/estrus.entity";
import { Insemination } from "@src/modules/reproduction/domain/entities/insemination.entity";
import { Pregnancy } from "@src/modules/reproduction/domain/entities/pregnancy.entity";
import type { IReproductionRepository } from "@src/modules/reproduction/domain/repositories/reproduction.repository";

export class PrismaReproductionRepository implements IReproductionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createEstrus(estrus: Estrus): Promise<Estrus> {
    const created = await this.prisma.estrus.create({
      data: {
        animalId: estrus.props.animalId,
        startDate: estrus.props.startDate,
        endDate: estrus.props.endDate ?? undefined,
        observation: estrus.props.observation,
        organizationId: estrus.props.organizationId,
      },
    });
    return Estrus.create({ ...estrus.props }, created.id);
  }

  async createPregnancy(pregnancy: Pregnancy): Promise<Pregnancy> {
    const created = await this.prisma.pregnancy.create({
      data: {
        animalId: pregnancy.props.animalId,
        detectedDate: pregnancy.props.detectedDate,
        expectedDate: pregnancy.props.expectedDate ?? undefined,
        status: pregnancy.props.status,
        organizationId: pregnancy.props.organizationId,
      },
    });
    return Pregnancy.create({ ...pregnancy.props }, created.id);
  }

  async createBirth(birth: Birth): Promise<Birth> {
    const created = await this.prisma.birth.create({
      data: {
        motherId: birth.props.motherId,
        fatherId: birth.props.fatherId ?? undefined,
        birthDate: birth.props.birthDate ?? undefined,
        offspringTag: birth.props.offspringTag ?? undefined,
        status: birth.props.status,
        organizationId: birth.props.organizationId,
      },
    });
    return Birth.create({ ...birth.props }, created.id);
  }

  async createInsemination(insemination: Insemination): Promise<Insemination> {
    const created = await this.prisma.insemination.create({
      data: {
        animalId: insemination.props.animalId,
        type: insemination.props.type,
        date: insemination.props.date,
        fatherId: insemination.props.fatherId ?? undefined,
        semenBatch: insemination.props.semenBatch ?? undefined,
        success: insemination.props.success ?? undefined,
        organizationId: insemination.props.organizationId,
      },
    });
    return Insemination.create({ ...insemination.props }, created.id);
  }

  async findPregnanciesByOrganization(
    organizationId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ pregnancies: Pregnancy[]; total: number }> {
    const skip = (page - 1) * limit;
    const results = await this.prisma.pregnancy.findMany({
      where: { organizationId },
      skip,
      take: limit,
    });
    const total = await this.prisma.pregnancy.count({
      where: { organizationId },
    });
    return {
      pregnancies: results.map((p) =>
        Pregnancy.create(
          {
            animalId: p.animalId,
            detectedDate: p.detectedDate,
            expectedDate: p.expectedDate ?? undefined,
            status: p.status,
            organizationId: p.organizationId,
          },
          p.id,
        ),
      ),
      total,
    };
  }

  async findInseminationsByOrganization(
    organizationId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ inseminations: Insemination[]; total: number }> {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      this.prisma.insemination.findMany({
        where: { organizationId },
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      this.prisma.insemination.count({ where: { organizationId } }),
    ]);
    return {
      inseminations: results.map((i) =>
        Insemination.create(
          {
            animalId: i.animalId,
            type: i.type,
            date: i.date,
            fatherId: i.fatherId ?? undefined,
            semenBatch: i.semenBatch ?? undefined,
            success: i.success ?? undefined,
            organizationId: i.organizationId,
          },
          i.id,
        ),
      ),
      total,
    };
  }

  async findReproductionHistoryByAnimal(
    animalId: string,
    organizationId: string,
  ) {
    const [estrus, pregnancies, births, inseminations] = await Promise.all([
      this.prisma.estrus.findMany({ where: { animalId, organizationId } }),
      this.prisma.pregnancy.findMany({ where: { animalId, organizationId } }),
      this.prisma.birth.findMany({
        where: {
          OR: [{ motherId: animalId }, { fatherId: animalId }],
          organizationId,
        },
      }),
      this.prisma.insemination.findMany({
        where: {
          OR: [{ animalId }, { fatherId: animalId }],
          organizationId,
        },
      }),
    ]);

    return {
      estrus: estrus.map((e) =>
        Estrus.create(
          {
            animalId: e.animalId,
            startDate: e.startDate,
            endDate: e.endDate ?? undefined,
            observation: e.observation ?? undefined,
            organizationId: e.organizationId,
          },
          e.id,
        ),
      ),
      pregnancies: pregnancies.map((p) =>
        Pregnancy.create(
          {
            animalId: p.animalId,
            detectedDate: p.detectedDate,
            expectedDate: p.expectedDate ?? undefined,
            status: p.status,
            organizationId: p.organizationId,
          },
          p.id,
        ),
      ),
      births: births.map((b) =>
        Birth.create(
          {
            motherId: b.motherId,
            fatherId: b.fatherId ?? undefined,
            birthDate: b.birthDate ?? undefined,
            offspringTag: b.offspringTag ?? undefined,
            status: b.status,
            organizationId: b.organizationId,
          },
          b.id,
        ),
      ),
      inseminations: inseminations.map((i) =>
        Insemination.create(
          {
            animalId: i.animalId,
            type: i.type,
            date: i.date,
            fatherId: i.fatherId ?? undefined,
            semenBatch: i.semenBatch ?? undefined,
            success: i.success ?? undefined,
            organizationId: i.organizationId,
          },
          i.id,
        ),
      ),
    };
  }
}
