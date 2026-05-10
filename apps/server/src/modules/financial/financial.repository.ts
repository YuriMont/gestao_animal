import type { PrismaClient } from "@generated/prisma/client";
import type {
  CreateFinancialRecordDTO,
  FinancialRecordRecord,
  FinancialSummary,
} from "./financial.types";

export interface IFinancialRepository {
  create(
    data: CreateFinancialRecordDTO & { organizationId: string },
  ): Promise<FinancialRecordRecord>;
  list(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<{ records: FinancialRecordRecord[]; total: number }>;
  getSummary(organizationId: string): Promise<FinancialSummary>;
}

export class PrismaFinancialRepository implements IFinancialRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateFinancialRecordDTO & { organizationId: string },
  ): Promise<FinancialRecordRecord> {
    return this.prisma.financialRecord.create({ data });
  }

  async list(
    organizationId: string,
    page = 1,
    limit = 20,
  ): Promise<{ records: FinancialRecordRecord[]; total: number }> {
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      this.prisma.financialRecord.findMany({
        where: { organizationId },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.financialRecord.count({ where: { organizationId } }),
    ]);
    return { records, total };
  }

  async getSummary(organizationId: string): Promise<FinancialSummary> {
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

    return { totalCost, totalRevenue, balance: totalRevenue - totalCost };
  }
}
