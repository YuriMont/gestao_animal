import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { CreateAnimalUseCase } from "@src/modules/core/application/use-cases/create-animal.use-case";
import { DeleteAnimalUseCase } from "@src/modules/core/application/use-cases/delete-animal.use-case";
import { GetAnimalByIdUseCase } from "@src/modules/core/application/use-cases/get-animal-by-id.use-case";
import { GetAnimalsUseCase } from "@src/modules/core/application/use-cases/get-animals.use-case";
import { UpdateAnimalUseCase } from "@src/modules/core/application/use-cases/update-animal.use-case";
import { PrismaAnimalRepository } from "@src/modules/core/infrastructure/persistence/animal.repository";
import type {
  CreateAnimalDTO,
  ListAnimalsQueryDTO,
  UpdateAnimalDTO,
} from "@src/modules/core/presentation/dtos/animal.dto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { getEnumLabel } from "@src/modules/core/presentation/dtos/enums.dto";

function mapAnimalResponse(animal: any) {
  const props = animal.props ? animal.props : animal;
  return {
    ...props,
    id: animal.id,
    breedName: props.breedName ?? null,
    species: { key: props.species, label: getEnumLabel("species", props.species) },
    sex: { key: props.sex, label: getEnumLabel("animalSex", props.sex) },
    status: { key: props.status, label: getEnumLabel("animalStatus", props.status) },
    origin: props.origin ? { key: props.origin, label: getEnumLabel("animalOrigin", props.origin) } : undefined,
  };
}

function getRepo() {
  return new PrismaAnimalRepository(PrismaService.getInstance());
}

export const animalController = {
  async create(
    request: FastifyRequest<{ Body: CreateAnimalDTO }>,
    reply: FastifyReply,
  ) {
    const useCase = new CreateAnimalUseCase(getRepo());
    const animal = await useCase.execute(request.body, request.tenantId!);
    return reply.status(201).send(mapAnimalResponse(animal));
  },

  async list(
    request: FastifyRequest<{ Querystring: ListAnimalsQueryDTO }>,
    reply: FastifyReply,
  ) {
    const useCase = new GetAnimalsUseCase(getRepo());
    const result = await useCase.execute(request.tenantId!, request.query);

    return reply.send({
      data: result.animals.map(mapAnimalResponse),
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
    const useCase = new GetAnimalByIdUseCase(getRepo());
    const animal = await useCase.execute(request.params.id, request.tenantId!);
    return reply.send(mapAnimalResponse(animal));
  },

  async update(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateAnimalDTO }>,
    reply: FastifyReply,
  ) {
    const useCase = new UpdateAnimalUseCase(getRepo());
    const animal = await useCase.execute(
      request.params.id,
      request.tenantId!,
      request.body,
    );
    return reply.send(mapAnimalResponse(animal));
  },

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const useCase = new DeleteAnimalUseCase(getRepo());
    await useCase.execute(request.params.id, request.tenantId!);
    return reply.status(204).send();
  },
};
