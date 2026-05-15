import { paginated } from "@src/common/lib";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { ParasiteMonitoringService } from "./parasitology.service";
import type {
  CreateParasiteMonitoringDTO,
  ListParasiteMonitoringQuery,
  UpdateParasiteMonitoringDTO,
} from "./parasitology.types";

export class ParasiteMonitoringController {
  constructor(private readonly service: ParasiteMonitoringService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateParasiteMonitoringDTO }>,
    reply: FastifyReply,
  ) => {
    const record = await this.service.create(request.body, request.tenantId!);
    return reply
      .status(201)
      .send({ message: "Parasite monitoring created", record });
  };

  getById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const record = await this.service.findById(id, request.tenantId!);
    if (!record) {
      return reply.status(404).send({
        error: "NOT_FOUND",
        message: "Parasite monitoring record not found",
      });
    }
    return reply.send(record);
  };

  update = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateParasiteMonitoringDTO;
    }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const record = await this.service.update(
      id,
      request.body,
      request.tenantId!,
    );
    return reply.send({ message: "Parasite monitoring updated", record });
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    await this.service.delete(id, request.tenantId!);
    return reply.status(204).send();
  };

  list = async (
    request: FastifyRequest<{ Querystring: ListParasiteMonitoringQuery }>,
    reply: FastifyReply,
  ) => {
    const result = await this.service.list(request.query, request.tenantId!);
    return reply.send(
      paginated(
        result.data,
        result.total,
        request.query.page,
        request.query.limit,
      ),
    );
  };

  getByAnimalId = async (
    request: FastifyRequest<{ Params: { animalId: string } }>,
    reply: FastifyReply,
  ) => {
    const { animalId } = request.params;
    const records = await this.service.findByAnimalId(
      animalId,
      request.tenantId!,
    );
    return reply.send(records);
  };
}
