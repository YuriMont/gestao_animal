import { financialController } from '@src/modules/financial/presentation/controllers/financial.controller';
import { createFinancialRecordSchema, financialRecordResponseSchema, financialSummarySchema } from '@src/modules/financial/presentation/dtos/financial.dto';
import type { FastifyInstance } from 'fastify';
import z from 'zod';

export default async function financialRoutes(app: FastifyInstance) {
  app.post(
    '/financial/records',
    {
      schema: {
        body: createFinancialRecordSchema,
        response: {
          201: z.object({
            message: z.string(),
            record: financialRecordResponseSchema
          })
        }
      }
    },
    financialController.create,
  );

  app.get('/financial/summary', {
    schema: {
      response: {
        200: financialSummarySchema
      }
    }
  }, financialController.getSummary);

  app.get('/financial/records', {
    schema: {
      response: {
        200: z.array(financialRecordResponseSchema)
      }
    }
  }, financialController.list);
}
