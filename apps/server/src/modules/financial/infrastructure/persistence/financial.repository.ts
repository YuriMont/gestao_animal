import type { PrismaClient } from "@prisma/client";
import { FinancialRecord } from "@src/modules/financial/domain/entities/financial-record.entity";
import type { IFinancialRepository } from "@src/modules/financial/domain/repositories/financial.repository";

export class PrismaFinancialRepository implements IFinancialRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async create(record: FinancialRecord): Promise<FinancialRecord> {
		const created = await this.prisma.financialRecord.create({
			data: {
				type: record.props.type,
				category: record.props.category,
				amount: record.props.amount,
				date: record.props.date,
				description: record.props.description,
				organizationId: record.props.organizationId,
			},
		});
		return FinancialRecord.create({ ...record.props }, created.id);
	}

	async listByOrganization(organizationId: string): Promise<FinancialRecord[]> {
		const records = await this.prisma.financialRecord.findMany({
			where: { organizationId },
			orderBy: { date: "desc" },
		});
		return records.map((r) =>
			FinancialRecord.create(
				{
					type: r.type as any,
					category: r.category,
					amount: r.amount,
					date: r.date,
					description: r.description ?? undefined,
					organizationId: r.organizationId,
				},
				r.id,
			),
		);
	}

	async getSummary(organizationId: string) {
		const records = await this.prisma.financialRecord.findMany({
			where: { organizationId },
		});

		let totalCosts = 0;
		let totalRevenue = 0;

		records.forEach((r) => {
			if (r.type === "COST") totalCosts += r.amount;
			if (r.type === "REVENUE") totalRevenue += r.amount;
		});

		return {
			totalCosts,
			totalRevenue,
			balance: totalRevenue - totalCosts,
		};
	}
}
