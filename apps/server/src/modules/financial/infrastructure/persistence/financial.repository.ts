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

  async listByOrganization(
    organizationId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ records: FinancialRecord[]; total: number }> {
    const skip = (page - 1) * limit;
    const records = await this.prisma.financialRecord.findMany({
      where: { organizationId },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    });

    const total = await this.prisma.financialRecord.count({
      where: { organizationId },
    });

    return {
      records: records.map((r) =>
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
      ),
      total,
    };
  }

  async getSummary(organizationId: string) {
    const [expenseAgg, incomeAgg] = await this.prisma.$transaction([
      this.prisma.financialRecord.aggregate({
        where: { organizationId, type: "EXPENSE" },
        _sum: { amount: true },
      }),
      this.prisma.financialRecord.aggregate({
        where: { organizationId, type: "INCOME" },
        _sum: { amount: true },
      }),
    ]);

    const totalCost = expenseAgg._sum.amount ?? 0;
    const totalRevenue = incomeAgg._sum.amount ?? 0;

    return {
      totalCost,
      totalRevenue,
      balance: totalRevenue - totalCost,
    };
  }
}
