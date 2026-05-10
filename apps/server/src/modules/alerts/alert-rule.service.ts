import type { IAlertRuleRepository } from "./alert-rule.repository";
import type { AlertRuleRecord, CreateAlertRuleDTO } from "./alert-rule.types";

export class AlertRuleService {
  constructor(private readonly repo: IAlertRuleRepository) {}

  async create(
    data: CreateAlertRuleDTO,
    orgId: string,
  ): Promise<AlertRuleRecord> {
    return this.repo.create({ ...data, organizationId: orgId });
  }

  async list(orgId: string, page: number, limit: number) {
    return this.repo.list(orgId, page, limit);
  }
}
