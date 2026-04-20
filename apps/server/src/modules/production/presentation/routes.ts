import { productionController } from '@src/modules/production/presentation/controllers/production.controller'
import {
  animalMetricsSchema,
  createMilkSchema,
  createWeightSchema,
  milkResponseSchema,
  weightResponseSchema,
} from '@src/modules/production/presentation/dtos/production.dto'
import type { FastifyInstance } from 'fastify'
import z from 'zod'

export default async function productionRoutes(app: FastifyInstance) {
  app.post(
    '/production/weight',
    {
      schema: {
        tags: ['Production'],
        summary: 'Record animal weight',
        description:
          "Record an animal's current weight measurement. Used to track livestock weight gain and monitor animal health over time. Weight records should be accurate and logged regularly.",
        body: createWeightSchema,
        response: {
          201: z.object({ message: z.string(), record: weightResponseSchema }),
        },
      },
    },
    productionController.recordWeight
  )

  app.post(
    '/production/milk',
    {
      schema: {
        tags: ['Production'],
        summary: 'Record milking activity',
        description:
          'Record a milking activity for an animal. Used to document milk production volumes and timing. This endpoint provides programmatic access to production records in the milking cycle.',
        body: createMilkSchema,
        response: {
          201: z.object({
            message: z.string(),
            production: milkResponseSchema,
          }),
        },
      },
    },
    productionController.recordMilk
  )

  app.get(
    '/production/metrics/:animalId',
    {
      schema: {
        tags: ['Production'],
        summary: 'Get production metrics',
        description:
          'Retrieve production statistics for a specific animal. Returns metrics including milk production, weight gain, and other production indicators. Useful for quick analysis of production performance.',
        schema: {
          response: {
            200: animalMetricsSchema,
          },
        },
      },
    },
    productionController.getMetrics
  )
}
