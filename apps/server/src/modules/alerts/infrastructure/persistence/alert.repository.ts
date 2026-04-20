import type { PrismaClient } from "@prisma/client";
import { AlertRule } from "@src/modules/alerts/domain/entities/alert-rule.entity";
import type { IAlertRepository } from "@src/modules/alerts/domain/repositories/alert.repository";

export class PrismaAlertRepository implements IAlertRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async createRule(rule: AlertRule): Promise<AlertRule> {
		const created = await this.prisma.alertRule.create({
			data: {
				name: rule.props.name,
				condition: rule.props.condition,
				value: rule.props.value,
				organizationId: rule.props.organizationId,
			},
		});
		return AlertRule.create({ ...rule.props }, created.id);
	}

	async findRulesByOrganization(
		organizationId: string,
		page: number = 1,
		limit: number = 20,
	): Promise<{ rules: AlertRule[]; total: number }> {
		const skip = (page - 1) * limit;
		const rules = await this.prisma.alertRule.findMany({
			where: { organizationId },
			skip,
			take: limit,
		});
		const total = await this.prisma.alertRule.count({
			where: { organizationId },
		});
		return {
			rules: rules.map((r) =>
				AlertRule.create(
					{
						name: r.name,
						condition: r.condition,
						value: r.value ?? undefined,
						organizationId: r.organizationId,
					},
					r.id,
				),
			),
			total,
		};
	}
}
