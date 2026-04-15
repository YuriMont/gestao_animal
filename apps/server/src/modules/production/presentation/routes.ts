import { productionController } from "@src/modules/production/presentation/controllers/production.controller";
import {
  createMilkSchema,
  createWeightSchema,
  milkResponseSchema,
  weightResponseSchema,
  animalMetricsSchema,
} from "@src/modules/production/presentation/dtos/production.dto";
import type { FastifyInstance } from "fastify";
import z from "zod";

export default async function productionRoutes(app: FastifyInstance) {
  app.post(
    "/production/weight",
    {
      schema: {
        body: createWeightSchema,
        response: { 201: z.object({ message: z.string(), record: weightResponseSchema }) },
      },
    },
    productionController.recordWeight,
  );

  app.post(
    "/production/milk",
    {
      schema: {
        body: createMilkSchema,
        response: { 201: z.object({ message: z.string(), production: milkResponseSchema }) },
      },
    },
    productionController.recordMilk,
  );

  app.get(
    "/production/metrics/:animalId",
    { schema: { response: { 200: animalMetricsSchema } } },
    productionController.getMetrics,
  );
}
