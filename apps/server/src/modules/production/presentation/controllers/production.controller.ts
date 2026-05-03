import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { MilkProduction } from "@src/modules/production/domain/entities/milk-production.entity";
import { WeightRecord } from "@src/modules/production/domain/entities/weight-record.entity";
import { PrismaProductionRepository } from "@src/modules/production/infrastructure/persistence/production.repository";
import type {
  CreateMilkDTO,
  CreateWeightDTO,
} from "@src/modules/production/presentation/dtos/production.dto";
import type { FastifyReply, FastifyRequest } from "fastify";

export const productionController = {
  async recordWeight(
    request: FastifyRequest<{ Body: CreateWeightDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaProductionRepository(
      PrismaService.getInstance(),
    );
    const record = await repository.createWeight(
      WeightRecord.create({
        ...request.body,
        date: request.body.date ?? new Date(),
        organizationId: tenantId,
      }),
    );
    return reply.status(201).send({
      message: "Weight recorded",
      record: { id: record.id, ...record.props },
    });
  },

  async recordMilk(
    request: FastifyRequest<{ Body: CreateMilkDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaProductionRepository(
      PrismaService.getInstance(),
    );
    const production = await repository.createMilk(
      MilkProduction.create({
        ...request.body,
        date: request.body.date ?? new Date(),
        organizationId: tenantId,
      }),
    );
    return reply.status(201).send({
      message: "Milk production recorded",
      production: { id: production.id, ...production.props },
    });
  },

  async getMetrics(
    request: FastifyRequest<{ Params: { animalId: string } }>,
    reply: FastifyReply,
  ) {
    const { animalId } = request.params;
    const tenantId = request.tenantId!;
    const repository = new PrismaProductionRepository(
      PrismaService.getInstance(),
    );
    const raw = await repository.getAnimalMetrics(animalId, tenantId);

    const averageWeight =
      raw.weights.length > 0
        ? raw.weights.reduce((sum, w) => sum + w.props.weight, 0) /
          raw.weights.length
        : 0;
    const totalMilk = raw.milk.reduce((sum, m) => sum + m.props.quantity, 0);
    const lastWeight = raw.weights.at(-1)?.props.weight;
    const lastMilk = raw.milk.at(-1)?.props.quantity;

    return reply.send({
      animalId,
      averageWeight,
      totalMilk,
      lastWeight,
      lastMilk,
    });
  },
};
