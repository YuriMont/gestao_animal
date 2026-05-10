import { getEnumLabel } from "@src/common/lib/enums";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { ReproductionService } from "./reproduction.service";
import type {
  CreateBirthDTO,
  CreateEstrusDTO,
  CreateInseminationDTO,
  CreatePregnancyDTO,
} from "./reproduction.types";

function mapEnum(field: string, value: string) {
  return { key: value, label: getEnumLabel(field, value) };
}

export class ReproductionController {
  constructor(private readonly reproductionService: ReproductionService) {}

  createEstrus = async (
    request: FastifyRequest<{ Body: CreateEstrusDTO }>,
    reply: FastifyReply,
  ) => {
    const estrus = await this.reproductionService.createEstrus(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send({ message: "Estrus cycle recorded", estrus });
  };

  createPregnancy = async (
    request: FastifyRequest<{ Body: CreatePregnancyDTO }>,
    reply: FastifyReply,
  ) => {
    const pregnancy = await this.reproductionService.createPregnancy(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send({
      message: "Pregnancy recorded",
      pregnancy: {
        ...pregnancy,
        status: mapEnum("pregnancyStatus", pregnancy.status),
      },
    });
  };

  createBirth = async (
    request: FastifyRequest<{ Body: CreateBirthDTO }>,
    reply: FastifyReply,
  ) => {
    const birth = await this.reproductionService.createBirth(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send({
      message: "Birth recorded",
      birth: { ...birth, status: mapEnum("birthStatus", birth.status) },
    });
  };

  createInsemination = async (
    request: FastifyRequest<{ Body: CreateInseminationDTO }>,
    reply: FastifyReply,
  ) => {
    const insemination = await this.reproductionService.createInsemination(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send({
      message: "Insemination recorded",
      insemination: {
        ...insemination,
        type: mapEnum("inseminationType", insemination.type),
      },
    });
  };

  getPregnancies = async (
    request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
    reply: FastifyReply,
  ) => {
    const { page = 1, limit = 20 } = request.query;
    const result = await this.reproductionService.listPregnancies(
      request.tenantId!,
      page,
      limit,
    );
    return reply.send({
      data: result.pregnancies.map((p) => ({
        ...p,
        status: mapEnum("pregnancyStatus", p.status),
      })),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  };

  getInseminations = async (
    request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
    reply: FastifyReply,
  ) => {
    const { page = 1, limit = 20 } = request.query;
    const result = await this.reproductionService.listInseminations(
      request.tenantId!,
      page,
      limit,
    );
    return reply.send({
      data: result.inseminations.map((i) => ({
        ...i,
        type: mapEnum("inseminationType", i.type),
      })),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  };

  getAnimalHistory = async (
    request: FastifyRequest<{ Params: { animalId: string } }>,
    reply: FastifyReply,
  ) => {
    const { animalId } = request.params;
    const history = await this.reproductionService.getAnimalHistory(
      animalId,
      request.tenantId!,
    );
    return reply.send({
      estrus: history.estrus,
      pregnancies: history.pregnancies.map((p) => ({
        ...p,
        status: mapEnum("pregnancyStatus", p.status),
      })),
      births: history.births.map((b) => ({
        ...b,
        status: mapEnum("birthStatus", b.status),
      })),
      inseminations: history.inseminations.map((i) => ({
        ...i,
        type: mapEnum("inseminationType", i.type),
      })),
    });
  };
}
