import type { AlertRule } from '@src/modules/alerts/domain/entities/alert-rule.entity';

export interface IAlertRepository {
  createRule(rule: AlertRule): Promise<AlertRule>;
  findRulesByOrganization(organizationId: string): Promise<AlertRule[]>;
}
