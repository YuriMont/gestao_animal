import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { AlertRule } from "@src/modules/alerts/domain/entities/alert-rule.entity";
import { PrismaAlertRepository } from "@src/modules/alerts/infrastructure/persistence/alert.repository";
import type { CreateAlertRuleDTO } from "@src/modules/alerts/presentation/dtos/alert.dto";
import type { FastifyReply, FastifyRequest } from "fastify";

export const alertController = {
  async createRule(
    request: FastifyRequest<{ Body: CreateAlertRuleDTO }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const repository = new PrismaAlertRepository(PrismaService.getInstance());
    const rule = await repository.createRule(
      AlertRule.create({ ...request.body, organizationId: tenantId }),
    );
    return reply.status(201).send({
      message: "Alert rule created",
      rule: { id: rule.id, ...rule.props },
    });
  },

  async listRules(
    request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
    reply: FastifyReply,
  ) {
    const tenantId = request.tenantId!;
    const { page, limit } = request.query;
    const repository = new PrismaAlertRepository(PrismaService.getInstance());
    const { rules, total } = await repository.findRulesByOrganization(
      tenantId,
      page,
      limit,
    );
    return reply.send({
      data: rules.map((item) => ({ id: item.id, ...item.props })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },
};
