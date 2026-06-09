import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { productionController } from "./production.module";
import { createMilkSchema, createWeightSchema } from "./production.types";

const weightSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  weight: z.number(),
  date: z.date(),
  organizationId: z.string(),
});

const milkSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  quantity: z.number(),
  unit: z.string(),
  date: z.date(),
  organizationId: z.string(),
});

const metricsSchema = z.object({
  animalId: z.string(),
  averageWeight: z.number(),
  totalMilk: z.number(),
  lastWeight: z.number().optional(),
  lastMilk: z.number().optional(),
});

const productionSummarySchema = z.object({
  totalMilk: z.number(),
  averageWeight: z.number(),
});

export default async function productionRoutes(app: FastifyInstance) {
  app.get(
    "/production/summary",
    {
      schema: {
        tags: ["Production"],
        summary: "Get production summary for dashboard",
        security: [{ bearerAuth: [] }],
        response: { 200: productionSummarySchema },
      },
    },
    productionController.getSummary,
  );

  app.post(
    "/production/weight",
    {
      schema: {
        tags: ["Production"],
        summary: "Record animal weight",
        security: [{ bearerAuth: [] }],
        body: createWeightSchema,
        response: {
          201: z.object({ message: z.string(), record: weightSchema }),
        },
      },
    },
    productionController.recordWeight,
  );

  app.post(
    "/production/milk",
    {
      schema: {
        tags: ["Production"],
        summary: "Record milking activity",
        security: [{ bearerAuth: [] }],
        body: createMilkSchema,
        response: {
          201: z.object({ message: z.string(), production: milkSchema }),
        },
      },
    },
    productionController.recordMilk,
  );

  app.get(
    "/production/metrics/:animalId",
    {
      schema: {
        tags: ["Production"],
        summary: "Get production metrics",
        security: [{ bearerAuth: [] }],
        params: z.object({ animalId: z.string() }),
        response: { 200: metricsSchema },
      },
    },
    productionController.getMetrics,
  );
}
