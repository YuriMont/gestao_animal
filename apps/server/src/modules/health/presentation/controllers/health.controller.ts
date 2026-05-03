import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { HealthRecord } from "@src/modules/health/domain/entities/health-record.entity";
import { Treatment } from "@src/modules/health/domain/entities/treatment.entity";
import { Vaccine } from "@src/modules/health/domain/entities/vaccine.entity";
import { PrismaHealthRepository } from "@src/modules/health/infrastructure/persistence/health.repository";
import type {
  CreateHealthRecordDTO,
  CreateTreatmentDTO,
  CreateVaccineDTO,
} from "@src/modules/health/presentation/dtos/health.dto";
import type { FastifyReply, FastifyRequest } from "fastify";

export const healthController = {
  async createRecord(
    request: FastifyRequest<{ Body: CreateHealthRecordDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaHealthRepository(PrismaService.getInstance());
    const record = await repository.createRecord(
      HealthRecord.create({ ...request.body, organizationId: tenantId }),
    );
    return reply.status(201).send({
      message: "Health record created",
      record: { id: record.id, ...record.props },
    });
  },

  async createVaccine(
    request: FastifyRequest<{ Body: CreateVaccineDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaHealthRepository(PrismaService.getInstance());
    const vaccine = await repository.createVaccine(
      Vaccine.create({ ...request.body, organizationId: tenantId }),
    );
    return reply.status(201).send({
      message: "Vaccine recorded",
      vaccine: { id: vaccine.id, ...vaccine.props },
    });
  },

  async createTreatment(
    request: FastifyRequest<{ Body: CreateTreatmentDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaHealthRepository(PrismaService.getInstance());
    const treatment = await repository.createTreatment(
      Treatment.create({ ...request.body, organizationId: tenantId }),
    );
    return reply.status(201).send({
      message: "Treatment started",
      treatment: { id: treatment.id, ...treatment.props },
    });
  },

  async getAnimalHistory(
    request: FastifyRequest<{ Params: { animalId: string } }>,
    reply: FastifyReply,
  ) {
    const { animalId } = request.params;
    const tenantId = request.tenantId!;
    const repository = new PrismaHealthRepository(PrismaService.getInstance());
    const history = await repository.findByAnimal(animalId, tenantId);

    return reply.send({
      records: history.records.map((r) => ({ id: r.id, ...r.props })),
      vaccines: history.vaccines.map((v) => ({ id: v.id, ...v.props })),
      treatments: history.treatments.map((t) => ({ id: t.id, ...t.props })),
    });
  },
};
