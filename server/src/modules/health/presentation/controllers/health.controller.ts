import { PrismaService } from '@src/infrastructure/persistence/prisma.service';
import { HealthRecord } from '@src/modules/health/domain/entities/health-record.entity';
import { Treatment } from '@src/modules/health/domain/entities/treatment.entity';
import { Vaccine } from '@src/modules/health/domain/entities/vaccine.entity';
import { PrismaHealthRepository } from '@src/modules/health/infrastructure/persistence/health.repository';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const healthController = {
  async createRecord(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId;
    const repository = new PrismaHealthRepository(PrismaService.getInstance());

    try {
      const record = await repository.createRecord(
        HealthRecord.create({
          ...(request.body as any),
          organizationId: tenantId!,
        }),
      );
      return reply.status(201).send({ message: 'Health record created', record });
    } catch (error: any) {
      return reply.status(400).send({ error: 'Bad Request', message: error.message });
    }
  },

  async createVaccine(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId;
    const repository = new PrismaHealthRepository(PrismaService.getInstance());

    try {
      const vaccine = await repository.createVaccine(
        Vaccine.create({
          ...(request.body as any),
          organizationId: tenantId!,
        }),
      );
      return reply.status(201).send({ message: 'Vaccine recorded', vaccine });
    } catch (error: any) {
      return reply.status(400).send({ error: 'Bad Request', message: error.message });
    }
  },

  async createTreatment(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId;
    const repository = new PrismaHealthRepository(PrismaService.getInstance());

    try {
      const treatment = await repository.createTreatment(
        Treatment.create({
          ...(request.body as any),
          organizationId: tenantId!,
        }),
      );
      return reply.status(201).send({ message: 'Treatment started', treatment });
    } catch (error: any) {
      return reply.status(400).send({ error: 'Bad Request', message: error.message });
    }
  },

  async getAnimalHistory(
    request: FastifyRequest<{ Params: { animalId: string } }>,
    reply: FastifyReply,
  ) {
    const { animalId } = request.params;
    const tenantId = request.tenantId;
    const repository = new PrismaHealthRepository(PrismaService.getInstance());

    const history = await repository.findByAnimal(animalId, tenantId!);
    return reply.send(history);
  },
};
