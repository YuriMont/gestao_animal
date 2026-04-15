import { PrismaService } from '@src/infrastructure/persistence/prisma.service';
import { AlertRule } from '@src/modules/alerts/domain/entities/alert-rule.entity';
import { PrismaAlertRepository } from '@src/modules/alerts/infrastructure/persistence/alert.repository';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const alertController = {
  async createRule(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId;
    const repository = new PrismaAlertRepository(PrismaService.getInstance());

    try {
      const rule = await repository.createRule(
        AlertRule.create({
          ...(request.body as any),
          organizationId: tenantId!,
        }),
      );
      return reply.status(201).send({ message: 'Alert rule created', rule });
    } catch (error: any) {
      return reply.status(400).send({ error: 'Bad Request', message: error.message });
    }
  },

  async listRules(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId;
    const repository = new PrismaAlertRepository(PrismaService.getInstance());
    const rules = await repository.findRulesByOrganization(tenantId!);
    return reply.send(rules);
  },
};
