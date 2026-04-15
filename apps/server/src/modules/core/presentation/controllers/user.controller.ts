import { PrismaService } from '@src/infrastructure/persistence/prisma.service';
import { CreateUserUseCase } from '@src/modules/core/application/use-cases/create-user.use-case';
import { PrismaUserRepository } from '@src/modules/core/infrastructure/persistence/user.repository';
import type { CreateUserDTO } from '@src/modules/core/presentation/dtos/user.dto';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const userController = {
  async create(request: FastifyRequest<{ Body: CreateUserDTO }>, reply: FastifyReply) {
    const repository = new PrismaUserRepository(PrismaService.getInstance());
    const useCase = new CreateUserUseCase(repository);

    try {
      const user = await useCase.execute(request.body);

      return reply.status(201).send({
        message: 'User created successfully',
        user: {
          ...user.props,
          id: user.id,
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
