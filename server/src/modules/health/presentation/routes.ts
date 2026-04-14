import { healthController } from "@src/modules/health/presentation/controllers/health.controller";
import type { FastifyInstance } from "fastify";
import z from "zod";
import {
  createHealthRecordSchema,
  createTreatmentSchema,
  createVaccineSchema,
  healthRecordResponseSchema,
  treatmentResponseSchema,
  vaccineResponseSchema,
} from "./dtos/health.dto";

export default async function healthRoutes(app: FastifyInstance) {
  app.post(
    "/health/records",
    {
      schema: {
        body: createHealthRecordSchema,
        response: { 201: z.object({ message: z.string(), record: healthRecordResponseSchema }) },
      },
    },
    healthController.createRecord,
  );

  app.post(
    "/health/vaccines",
    {
      schema: {
        body: createVaccineSchema,
        response: { 201: z.object({ message: z.string(), vaccine: vaccineResponseSchema }) },
      },
    },
    healthController.createVaccine,
  );

  app.post(
    "/health/treatments",
    {
      schema: {
        body: createTreatmentSchema,
        response: { 201: z.object({ message: z.string(), treatment: treatmentResponseSchema }) },
      },
    },
    healthController.createTreatment,
  );

  app.get(
    "/health/history/:animalId",
    { schema: { response: { 200: z.array(z.any()) } } },
    healthController.getAnimalHistory,
  );
}
