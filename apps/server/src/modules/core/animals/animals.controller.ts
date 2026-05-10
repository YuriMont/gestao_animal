import { getEnumLabel } from "@src/common/lib/enums";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { AnimalService } from "./animals.service";
import type {
  AnimalPayload,
  CreateAnimalDTO,
  ListAnimalsQuery,
  UpdateAnimalDTO,
} from "./animals.types";

function mapAnimal(a: AnimalPayload) {
  return {
    ...a,
    species: { key: a.species, label: getEnumLabel("species", a.species) },
    sex: { key: a.sex, label: getEnumLabel("animalSex", a.sex) },
    status: { key: a.status, label: getEnumLabel("animalStatus", a.status) },
    origin: a.origin
      ? { key: a.origin, label: getEnumLabel("animalOrigin", a.origin) }
      : undefined,
    organizationId: a.organizationId,
  };
}

export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateAnimalDTO }>,
    reply: FastifyReply,
  ) => {
    const animal = await this.animalService.create(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send(mapAnimal(animal));
  };

  list = async (
    request: FastifyRequest<{ Querystring: ListAnimalsQuery }>,
    reply: FastifyReply,
  ) => {
    const result = await this.animalService.list(
      request.tenantId!,
      request.query,
    );
    return reply.send({
      data: result.animals.map(mapAnimal),
      meta: {
        total: result.total,
        page: request.query.page,
        limit: request.query.limit,
        totalPages: Math.ceil(result.total / request.query.limit),
      },
    });
  };

  getById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const animal = await this.animalService.getById(
      request.params.id,
      request.tenantId!,
    );
    return reply.send(mapAnimal(animal));
  };

  update = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateAnimalDTO;
    }>,
    reply: FastifyReply,
  ) => {
    const animal = await this.animalService.update(
      request.params.id,
      request.tenantId!,
      request.body,
    );
    return reply.send(mapAnimal(animal));
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.animalService.delete(request.params.id, request.tenantId!);
    return reply.status(204).send();
  };
}
