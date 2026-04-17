import { AppError } from "@src/common/errors/app-error";
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
		return reply.status(201).send({ ...animal.props, id: animal.id });
	},

	async list(
		request: FastifyRequest<{ Querystring: ListAnimalsQueryDTO }>,
		reply: FastifyReply,
	) {
		const useCase = new GetAnimalsUseCase(getRepo());
		const result = await useCase.execute(request.tenantId!, request.query);
		return reply.send({
			data: result.animals.map((a) => ({ ...a.props, id: a.id })),
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
		return reply.send({ ...animal.props, id: animal.id });
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
		return reply.send({ ...animal.props, id: animal.id });
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
