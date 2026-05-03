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
      estrus: { id: estrus.id, ...estrus.props },
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
      pregnancy: { id: pregnancy.id, ...pregnancy.props },
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
      birth: { id: birth.id, ...birth.props },
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
      insemination: { id: insemination.id, ...insemination.props },
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
      data: pregnancies.map((item) => ({ id: item.id, ...item.props })),
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
      data: inseminations.map((item) => ({ id: item.id, ...item.props })),
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
      estrus: history.estrus.map((e) => ({ id: e.id, ...e.props })),
      pregnancies: history.pregnancies.map((p) => ({ id: p.id, ...p.props })),
      births: history.births.map((b) => ({ id: b.id, ...b.props })),
      inseminations: history.inseminations.map((i) => ({ id: i.id, ...i.props })),
    });
  },
};
