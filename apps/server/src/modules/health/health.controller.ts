import type { FastifyReply, FastifyRequest } from "fastify";
import type { HealthService } from "./health.service";
import type {
  CreateHealthRecordDTO,
  CreateTreatmentDTO,
  CreateVaccineDTO,
} from "./health.types";

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  createRecord = async (
    request: FastifyRequest<{ Body: CreateHealthRecordDTO }>,
    reply: FastifyReply,
  ) => {
    const record = await this.healthService.createRecord(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send({ message: "Health record created", record });
  };

  createVaccine = async (
    request: FastifyRequest<{ Body: CreateVaccineDTO }>,
    reply: FastifyReply,
  ) => {
    const vaccine = await this.healthService.createVaccine(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send({ message: "Vaccine recorded", vaccine });
  };

  createTreatment = async (
    request: FastifyRequest<{ Body: CreateTreatmentDTO }>,
    reply: FastifyReply,
  ) => {
    const treatment = await this.healthService.createTreatment(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send({ message: "Treatment started", treatment });
  };

  getAnimalHistory = async (
    request: FastifyRequest<{ Params: { animalId: string } }>,
    reply: FastifyReply,
  ) => {
    const { animalId } = request.params;
    const history = await this.healthService.getAnimalHistory(
      animalId,
      request.tenantId!,
    );
    return reply.send(history);
  };
}
