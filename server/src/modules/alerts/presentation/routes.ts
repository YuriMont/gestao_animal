import { alertController } from "@src/modules/alerts/presentation/controllers/alert.controller";
import type { FastifyInstance } from "fastify";
import z from "zod";
import {
  alertRuleResponseSchema,
  createAlertRuleSchema,
} from "./dtos/alert.dto";

export default async function alertRoutes(app: FastifyInstance) {
  app.post(
    "/alerts/rules",
    {
      schema: {
        body: createAlertRuleSchema,
        response: {
          201: z.object({
            message: z.string(),
            rule: alertRuleResponseSchema,
          }),
        },
      },
    },
    alertController.createRule,
  );

  app.get(
    "/alerts/rules",
    {
      schema: {
        response: {
          200: z.array(alertRuleResponseSchema),
        },
      },
    },
    alertController.listRules,
  );
}
