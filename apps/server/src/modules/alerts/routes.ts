import { paginationMetaSchema } from "@src/common/lib/pagination";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createAlertRuleSchema } from "./alert-rule.types";
import { alertRuleController } from "./alerts.module";

export default async function alertRoutes(app: FastifyInstance) {
  app.post(
    "/alerts/rules",
    {
      schema: {
        tags: ["Alerts"],
        summary: "Create a new alert rule",
        security: [{ bearerAuth: [] }],
        body: createAlertRuleSchema,
        response: {
          201: z.object({
            message: z.string(),
            rule: z.object({
              id: z.string(),
              name: z.string(),
              condition: z.string(),
              value: z.string().optional(),
              organizationId: z.string(),
            }),
          }),
        },
      },
    },
    alertRuleController.create,
  );

  app.get(
    "/alerts/rules",
    {
      schema: {
        tags: ["Alerts"],
        summary: "Retrieve alert rules",
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(20),
        }),
        response: {
          200: z.object({
            data: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                condition: z.string(),
                value: z.string().optional(),
                organizationId: z.string(),
              }),
            ),
            meta: paginationMetaSchema,
          }),
        },
      },
    },
    alertRuleController.list,
  );
}
