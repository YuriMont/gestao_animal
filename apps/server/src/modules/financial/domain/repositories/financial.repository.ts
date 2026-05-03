import type { FinancialRecord } from "@src/modules/financial/domain/entities/financial-record.entity";

export interface IFinancialRepository {
  create(record: FinancialRecord): Promise<FinancialRecord>;
  listByOrganization(
    organizationId: string,
    page?: number,
    limit?: number,
  ): Promise<{ records: FinancialRecord[]; total: number }>;
  getSummary(organizationId: string): Promise<{
    totalCost: number;
    totalRevenue: number;
    balance: number;
  }>;
}
