import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { CreateBreedUseCase } from "@src/modules/core/application/use-cases/create-breed.use-case";
import { DeleteBreedUseCase } from "@src/modules/core/application/use-cases/delete-breed.use-case";
import { GetBreedByIdUseCase } from "@src/modules/core/application/use-cases/get-breed-by-id.use-case";
import { GetBreedsUseCase } from "@src/modules/core/application/use-cases/get-breeds.use-case";
import { UpdateBreedUseCase } from "@src/modules/core/application/use-cases/update-breed.use-case";
import { PrismaBreedRepository } from "@src/modules/core/infrastructure/persistence/breed.repository";
import type {
  CreateBreedDTO,
  ListBreedsQueryDTO,
  UpdateBreedDTO,
} from "@src/modules/core/presentation/dtos/breed.dto";
import { getEnumLabel } from "@src/modules/core/presentation/dtos/enums.dto";
import type { FastifyReply, FastifyRequest } from "fastify";

function mapBreedResponse(breed: any) {
  const props = breed.props ? breed.props : breed;
  return {
    ...props,
    id: breed.id,
    species: {
      key: props.species,
      label: getEnumLabel("species", props.species),
    },
  };
}

function getRepo() {
  return new PrismaBreedRepository(PrismaService.getInstance());
}

export const breedController = {
  async create(
    request: FastifyRequest<{ Body: CreateBreedDTO }>,
    reply: FastifyReply,
  ) {
    const useCase = new CreateBreedUseCase(getRepo());
    const breed = await useCase.execute(request.body, request.tenantId!);
    return reply.status(201).send(mapBreedResponse(breed));
  },

  async list(
    request: FastifyRequest<{ Querystring: ListBreedsQueryDTO }>,
    reply: FastifyReply,
  ) {
    const useCase = new GetBreedsUseCase(getRepo());
    const result = await useCase.execute(request.tenantId!, request.query);

    return reply.send({
      data: result.breeds.map(mapBreedResponse),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  },

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const useCase = new GetBreedByIdUseCase(getRepo());
    const breed = await useCase.execute(request.params.id, request.tenantId!);
    return reply.send(mapBreedResponse(breed));
  },

  async update(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateBreedDTO }>,
    reply: FastifyReply,
  ) {
    const useCase = new UpdateBreedUseCase(getRepo());
    const breed = await useCase.execute(
      request.params.id,
      request.tenantId!,
      request.body,
    );
    return reply.send(mapBreedResponse(breed));
  },

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const useCase = new DeleteBreedUseCase(getRepo());
    await useCase.execute(request.params.id, request.tenantId!);
    return reply.status(204).send();
  },
};
