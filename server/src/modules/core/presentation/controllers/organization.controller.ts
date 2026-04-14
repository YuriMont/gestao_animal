import { PrismaService } from '@src/infrastructure/persistence/prisma.service';
import { CreateOrganizationUseCase } from '@src/modules/core/application/use-cases/create-organization.use-case';
import { PrismaOrganizationRepository } from '@src/modules/core/infrastructure/persistence/organization.repository';
import type { CreateOrganizationDTO } from '@src/modules/core/presentation/dtos/organization.dto';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const organizationController = {
  async create(request: FastifyRequest<{ Body: CreateOrganizationDTO }>, reply: FastifyReply) {
    const repository = new PrismaOrganizationRepository(PrismaService.getInstance());
    const useCase = new CreateOrganizationUseCase(repository);

    try {
      const org = await useCase.execute(request.body);

      return reply.status(201).send({
        message: 'Organization created successfully',
        organization: {
          ...org.props,
          id: org.id,
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
