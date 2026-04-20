import { alertController } from "@src/modules/alerts/presentation/controllers/alert.controller";
import { paginationMetaSchema } from "@src/common/dtos/pagination.dto";
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
				tags: ["Alerts"],
				summary: "Create a new alert rule",
				description:
					"Create a new alert rule configuration for an organization. Used to define when and what actions should be taken when a specific alert condition occurs. This endpoint is used to programmatically define alert rules that can be triggered when certain animal health or behavior conditions are met.",
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
				tags: ["Alerts"],
				summary: "Retrieve alert rules",
				description:
					"Retrieve alert rule configurations for an organization. Used to list and inspect existing alert rules that define when and what actions should be taken when specific alert conditions occur. This endpoint allows programmatic access to alert rules that can be triggered based on animal health or behavior conditions.",
				querystring: z.object({
					page: z.coerce.number().int().min(1).default(1),
					limit: z.coerce.number().int().min(1).max(100).default(20),
				}),
				response: {
					200: z.object({
						data: z.array(alertRuleResponseSchema),
						meta: paginationMetaSchema,
					}),
				},
			},
		},
		alertController.listRules,
	);
}
