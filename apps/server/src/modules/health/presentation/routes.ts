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
        tags: ["Health"],
        summary: "Create a health record",
        description:
          "Create a health record for an animal. Used to track veterinary treatments, medications, or clinical observations made on an animal. This endpoint provides programmatic access to health records linked to a specific animal.",
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
        tags: ["Health"],
        summary: "Create a vaccination record",
        description:
          "Create a vaccination record for an animal. Used to document completed vaccination schedules and track immunization history. This endpoint provides programmatic access to vaccination records.",
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
        tags: ["Health"],
        summary: "Create a treatment record",
        description:
          "Create a treatment record for an animal. Used to document veterinary treatments administered, medications, procedures, or other health interventions. This endpoint provides programmatic access to treatment records.",
        body: createTreatmentSchema,
        response: { 201: z.object({ message: z.string(), treatment: treatmentResponseSchema }) },
      },
    },
    healthController.createTreatment,
  );

  app.get(
    "/health/history/:animalId",
    {
      schema: {
        summary: "Get health history for an animal",
        tags: ["Health"],
        description:
          "Get the complete history of health records for a specific animal. Returns all available health records including treatments, vaccinations, and clinical observations.",
        response: {
          200: z.array(z.any())
        }
      }
    },
    healthController.getAnimalHistory,
  );
}
