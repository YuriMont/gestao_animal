import type { FastifyReply, FastifyRequest } from "fastify";
import type { ProductionService } from "./production.service";
import type { CreateMilkDTO, CreateWeightDTO } from "./production.types";

export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  recordWeight = async (
    request: FastifyRequest<{ Body: CreateWeightDTO }>,
    reply: FastifyReply,
  ) => {
    const record = await this.productionService.createWeight(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send({ message: "Weight recorded", record });
  };

  recordMilk = async (
    request: FastifyRequest<{ Body: CreateMilkDTO }>,
    reply: FastifyReply,
  ) => {
    const production = await this.productionService.createMilk(
      request.body,
      request.tenantId!,
    );
    return reply
      .status(201)
      .send({ message: "Milk production recorded", production });
  };

  getMetrics = async (
    request: FastifyRequest<{ Params: { animalId: string } }>,
    reply: FastifyReply,
  ) => {
    const metrics = await this.productionService.getMetrics(
      request.params.animalId,
      request.tenantId!,
    );
    return reply.send(metrics);
  };

  getSummary = async (_request: FastifyRequest, reply: FastifyReply) => {
    const summary = await this.productionService.getSummary(
      _request.tenantId!,
    );
    return reply.send(summary);
  };
}
