import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { Birth } from "@src/modules/reproduction/domain/entities/birth.entity";
import { Estrus } from "@src/modules/reproduction/domain/entities/estrus.entity";
import { Insemination } from "@src/modules/reproduction/domain/entities/insemination.entity";
import { Pregnancy } from "@src/modules/reproduction/domain/entities/pregnancy.entity";
import { PrismaReproductionRepository } from "@src/modules/reproduction/infrastructure/persistence/reproduction.repository";
import type {
  CreateBirthDTO,
  CreateEstrusDTO,
  CreateInseminationDTO,
  CreatePregnancyDTO,
} from "@src/modules/reproduction/presentation/dtos/reproduction.dto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { getEnumLabel } from "@src/modules/core/presentation/dtos/enums.dto";

function mapEstrus(item: any) {
  const props = item.props ? item.props : item;
  return { id: item.id, ...props };
}

function mapPregnancy(item: any) {
  const props = item.props ? item.props : item;
  return {
    ...props,
    id: item.id,
    status: { key: props.status, label: getEnumLabel("pregnancyStatus", props.status) }
  };
}

function mapBirth(item: any) {
  const props = item.props ? item.props : item;
  return {
    ...props,
    id: item.id,
    status: { key: props.status, label: getEnumLabel("birthStatus", props.status) }
  };
}

function mapInsemination(item: any) {
  const props = item.props ? item.props : item;
  return {
    ...props,
    id: item.id,
    type: { key: props.type, label: getEnumLabel("inseminationType", props.type) }
  };
}

export const reproductionController = {
  async createEstrus(
    request: FastifyRequest<{ Body: CreateEstrusDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance(),
    );
    const estrus = await repository.createEstrus(
      Estrus.create({ ...request.body, organizationId: tenantId }),
    );
    return reply.status(201).send({
      message: "Estrus cycle recorded",
      estrus: mapEstrus(estrus),
    });
  },

  async createPregnancy(
    request: FastifyRequest<{ Body: CreatePregnancyDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance(),
    );
    const pregnancy = await repository.createPregnancy(
      Pregnancy.create({ ...request.body, organizationId: tenantId }),
    );
    return reply.status(201).send({
      message: "Pregnancy recorded",
      pregnancy: mapPregnancy(pregnancy),
    });
  },

  async createBirth(
    request: FastifyRequest<{ Body: CreateBirthDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance(),
    );
    const birth = await repository.createBirth(
      Birth.create({ ...request.body, organizationId: tenantId }),
    );
    return reply.status(201).send({
      message: "Birth recorded",
      birth: mapBirth(birth),
    });
  },

  async createInsemination(
    request: FastifyRequest<{ Body: CreateInseminationDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance(),
    );
    const insemination = await repository.createInsemination(
      Insemination.create({
        ...request.body,
        date: request.body.date ?? new Date(),
        organizationId: tenantId,
      }),
    );
    return reply.status(201).send({
      message: "Insemination recorded",
      insemination: mapInsemination(insemination),
    });
  },

  async getPregnancies(
    request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const { page, limit } = request.query;
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance(),
    );
    const { pregnancies, total } =
      await repository.findPregnanciesByOrganization(tenantId, page, limit);
    return reply.send({
      data: pregnancies.map(mapPregnancy),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },

  async getInseminations(
    request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const { page, limit } = request.query;
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance(),
    );
    const { inseminations, total } =
      await repository.findInseminationsByOrganization(tenantId, page, limit);
    return reply.send({
      data: inseminations.map(mapInsemination),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },

  async getAnimalHistory(
    request: FastifyRequest<{ Params: { animalId: string } }>,
    reply: FastifyReply,
  ) {
    const { animalId } = request.params;
    const tenantId = request.tenantId!;
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance(),
    );
    const history = await repository.findReproductionHistoryByAnimal(
      animalId,
      tenantId,
    );
    return reply.send({
      estrus: history.estrus.map(mapEstrus),
      pregnancies: history.pregnancies.map(mapPregnancy),
      births: history.births.map(mapBirth),
      inseminations: history.inseminations.map(mapInsemination),
    });
  },
};
