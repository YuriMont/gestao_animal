import { getEnumLabel } from "@src/common/lib/enums";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { BreedService } from "./breeds.service";
import type {
  CreateBreedDTO,
  ListBreedsQuery,
  UpdateBreedDTO,
} from "./breeds.types";

function mapBreed(b: any) {
  return {
    ...b,
    species: { key: b.species, label: getEnumLabel("species", b.species) },
  };
}

export class BreedController {
  constructor(private readonly breedService: BreedService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateBreedDTO }>,
    reply: FastifyReply,
  ) => {
    const breed = await this.breedService.create(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send(mapBreed(breed));
  };

  list = async (
    request: FastifyRequest<{ Querystring: ListBreedsQuery }>,
    reply: FastifyReply,
  ) => {
    const result = await this.breedService.list(
      request.tenantId!,
      request.query,
    );
    return reply.send({
      data: result.breeds.map(mapBreed),
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
    const breed = await this.breedService.getById(
      request.params.id,
      request.tenantId!,
    );
    return reply.send(mapBreed(breed));
  };

  update = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateBreedDTO;
    }>,
    reply: FastifyReply,
  ) => {
    const breed = await this.breedService.update(
      request.params.id,
      request.tenantId!,
      request.body,
    );
    return reply.send(mapBreed(breed));
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.breedService.delete(request.params.id, request.tenantId!);
    return reply.status(204).send();
  };
}
