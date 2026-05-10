import type { PrismaClient } from "@generated/prisma/client";
import type { AlertRuleRecord, CreateAlertRuleDTO } from "./alert-rule.types";

export interface IAlertRuleRepository {
  create(
    data: CreateAlertRuleDTO & { organizationId: string },
  ): Promise<AlertRuleRecord>;
  list(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<{ rules: AlertRuleRecord[]; total: number }>;
}

export class PrismaAlertRuleRepository implements IAlertRuleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateAlertRuleDTO & { organizationId: string },
  ): Promise<AlertRuleRecord> {
    const created = await this.prisma.alertRule.create({ data });
    return created;
  }

  async list(
    organizationId: string,
    page = 1,
    limit = 20,
  ): Promise<{ rules: AlertRuleRecord[]; total: number }> {
    const skip = (page - 1) * limit;
    const [rules, total] = await Promise.all([
      this.prisma.alertRule.findMany({
        where: { organizationId },
        skip,
        take: limit,
      }),
      this.prisma.alertRule.count({ where: { organizationId } }),
    ]);
    return { rules, total };
  }
}
