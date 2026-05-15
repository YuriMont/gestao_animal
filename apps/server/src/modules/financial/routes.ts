import { paginationMetaSchema } from "@src/common/lib/pagination";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { financialController } from "./financial.module";
import {
  createFinancialRecordSchema,
  updateFinancialRecordSchema,
} from "./financial.types";

const recordResponseSchema = z.object({
  id: z.string(),
  type: z.object({ key: z.string(), label: z.string() }),
  category: z.object({ key: z.string(), label: z.string() }),
  amount: z.number(),
  date: z.date(),
  description: z.string().nullish(),
  organizationId: z.string(),
});

const summarySchema = z.object({
  totalRevenue: z.number(),
  totalCost: z.number(),
  balance: z.number(),
});

export default async function financialRoutes(app: FastifyInstance) {
  app.post(
    "/financial/records",
    {
      schema: {
        tags: ["Financial"],
        summary: "Create a new financial record",
        security: [{ bearerAuth: [] }],
        body: createFinancialRecordSchema,
        response: {
          201: z.object({
            message: z.string(),
            record: recordResponseSchema,
          }),
        },
      },
    },
    financialController.create,
  );

  app.get(
    "/financial/summary",
    {
      schema: {
        tags: ["Financial"],
        summary: "Get financial summary",
        security: [{ bearerAuth: [] }],
        response: { 200: summarySchema },
      },
    },
    financialController.getSummary,
  );

  app.get(
    "/financial/records",
    {
      schema: {
        tags: ["Financial"],
        summary: "Get financial records",
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(20),
        }),
        response: {
          200: z.object({
            data: z.array(recordResponseSchema),
            meta: paginationMetaSchema,
          }),
        },
      },
    },
    financialController.list,
  );

  app.get(
    "/financial/records/:id",
    {
      schema: {
        tags: ["Financial"],
        summary: "Get financial record by ID",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: { 200: recordResponseSchema },
      },
    },
    financialController.getById,
  );

  app.put(
    "/financial/records/:id",
    {
      schema: {
        tags: ["Financial"],
        summary: "Update financial record",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        body: updateFinancialRecordSchema,
        response: {
          200: z.object({
            message: z.string(),
            record: recordResponseSchema,
          }),
        },
      },
    },
    financialController.update,
  );

  app.delete(
    "/financial/records/:id",
    {
      schema: {
        tags: ["Financial"],
        summary: "Delete financial record",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: { 204: z.literal(null) },
      },
    },
    financialController.delete,
  );
}
