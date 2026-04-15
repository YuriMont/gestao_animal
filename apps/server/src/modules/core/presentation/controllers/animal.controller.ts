import { PrismaService } from '@src/infrastructure/persistence/prisma.service';
import { CreateAnimalUseCase } from '@src/modules/core/application/use-cases/create-animal.use-case';
import { PrismaAnimalRepository } from '@src/modules/core/infrastructure/persistence/animal.repository';
import type { CreateAnimalDTO } from '@src/modules/core/presentation/dtos/animal.dto';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const animalController = {
  async create(request: FastifyRequest<{ Body: CreateAnimalDTO }>, reply: FastifyReply) {
    const tenantId = request.tenantId; // Decorated by tenantContextHook

    const repository = new PrismaAnimalRepository(PrismaService.getInstance());
    const useCase = new CreateAnimalUseCase(repository);

    try {
      const animal = await useCase.execute(request.body, tenantId!);

      return reply.status(201).send({
        message: 'Animal created successfully',
        animal: {
          ...animal.props,
          id: animal.id,
        },
      });
    } catch (error: any) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: error.message,
      });
    }
  },
};
