import { paginationMetaSchema } from '@src/common/dtos/pagination.dto'
import { financialController } from '@src/modules/financial/presentation/controllers/financial.controller'
import {
  createFinancialRecordSchema,
  financialRecordResponseSchema,
  financialSummarySchema,
} from '@src/modules/financial/presentation/dtos/financial.dto'
import type { FastifyInstance } from 'fastify'
import z from 'zod'

export default async function financialRoutes(app: FastifyInstance) {
  app.post(
    '/financial/records',
    {
      schema: {
        tags: ['Financial'],
        summary: 'Create a new financial record',
        description:
          'Create a new financial record for an organization. Used to document financial transactions, payments, expenses, or other financial activities associated with livestock operations. This endpoint provides programmatic access to financial records.',
        body: createFinancialRecordSchema,
        response: {
          201: z.object({
            message: z.string(),
            record: financialRecordResponseSchema,
          }),
        },
      },
    },
    financialController.create
  )

  app.get(
    '/financial/summary',
    {
      schema: {
        tags: ['Financial'],
        summary: 'Get financial summary',
        description:
          'Get a financial summary for the organization. Returns aggregated financial statistics including total income, expenses, available funds, and other key metrics. Useful for quick overview of financial health.',
        response: {
          200: financialSummarySchema,
        },
      },
    },
    financialController.getSummary
  )

  app.get(
    '/financial/records',
    {
      schema: {
        summary: 'Get financial records',
        tags: ['Financial'],
        description:
          'Retrieve financial records for an organization. Returns all financial records including payments, expenses, receipts, and other financial activity. Useful for auditing and financial analysis.',
        querystring: z.object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(20),
        }),
        response: {
          200: z.object({
            data: z.array(financialRecordResponseSchema),
            meta: paginationMetaSchema,
          }),
        },
      },
    },
    financialController.list
  )
}
