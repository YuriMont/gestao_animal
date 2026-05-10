import type { FastifyReply, FastifyRequest } from "fastify";
import type { AlertRuleService } from "./alert-rule.service";
import type { CreateAlertRuleDTO } from "./alert-rule.types";

export class AlertRuleController {
  constructor(private readonly alertRuleService: AlertRuleService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateAlertRuleDTO }>,
    reply: FastifyReply,
  ) => {
    const rule = await this.alertRuleService.create(
      request.body,
      request.tenantId!,
    );
    return reply.status(201).send({ message: "Alert rule created", rule });
  };

  list = async (
    request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
    reply: FastifyReply,
  ) => {
    const { page = 1, limit = 20 } = request.query;
    const result = await this.alertRuleService.list(
      request.tenantId!,
      page,
      limit,
    );
    return reply.send({
      data: result.rules,
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  };
}
