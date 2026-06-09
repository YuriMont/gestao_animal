import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { healthController } from "./health.module";
import {
  createHealthRecordSchema,
  createTreatmentSchema,
  createVaccineSchema,
} from "./health.types";
import parasitologyRoutes from "./parasitology/parasitology.routes";

const recordSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  date: z.date(),
  description: z.string(),
  observation: z.string().nullish(),
  organizationId: z.string(),
});

const vaccineSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  vaccineName: z.string(),
  doseNumber: z.number(),
  dateAdministered: z.date(),
  nextDueDate: z.date().nullish(),
  organizationId: z.string(),
});

const treatmentSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  diagnosis: z.string(),
  medication: z.string(),
  dosage: z.string().nullish(),
  startDate: z.date(),
  endDate: z.date().nullish(),
  organizationId: z.string(),
});

const healthSummarySchema = z.object({
  activeTreatments: z.number(),
  vaccinesDue: z.number(),
});

export default async function healthRoutes(app: FastifyInstance) {
  app.register(parasitologyRoutes, { prefix: "/parasitology" });

  app.get(
    "/health/summary",
    {
      schema: {
        tags: ["Health"],
        summary: "Get health summary for dashboard",
        security: [{ bearerAuth: [] }],
        response: { 200: healthSummarySchema },
      },
    },
    healthController.getSummary,
  );

  app.post(
    "/health/records",
    {
      schema: {
        tags: ["Health"],
        summary: "Create a health record",
        security: [{ bearerAuth: [] }],
        body: createHealthRecordSchema,
        response: {
          201: z.object({ message: z.string(), record: recordSchema }),
        },
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
        security: [{ bearerAuth: [] }],
        body: createVaccineSchema,
        response: {
          201: z.object({ message: z.string(), vaccine: vaccineSchema }),
        },
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
        security: [{ bearerAuth: [] }],
        body: createTreatmentSchema,
        response: {
          201: z.object({ message: z.string(), treatment: treatmentSchema }),
        },
      },
    },
    healthController.createTreatment,
  );

  app.get(
    "/health/history/:animalId",
    {
      schema: {
        tags: ["Health"],
        summary: "Get health history for an animal",
        security: [{ bearerAuth: [] }],
        params: z.object({ animalId: z.string() }),
        response: {
          200: z.object({
            records: z.array(recordSchema),
            vaccines: z.array(vaccineSchema),
            treatments: z.array(treatmentSchema),
          }),
        },
      },
    },
    healthController.getAnimalHistory,
  );
}
