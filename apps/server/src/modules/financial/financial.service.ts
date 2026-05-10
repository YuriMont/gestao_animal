import type { IFinancialRepository } from "./financial.repository";
import type {
  CreateFinancialRecordDTO,
  FinancialRecordRecord,
  FinancialSummary,
} from "./financial.types";

export class FinancialService {
  constructor(private readonly repo: IFinancialRepository) {}

  async create(
    data: CreateFinancialRecordDTO,
    orgId: string,
  ): Promise<FinancialRecordRecord> {
    return this.repo.create({
      ...data,
      date: data.date ?? new Date(),
      organizationId: orgId,
    });
  }

  async list(orgId: string, page: number, limit: number) {
    return this.repo.list(orgId, page, limit);
  }

  async getSummary(orgId: string): Promise<FinancialSummary> {
    return this.repo.getSummary(orgId);
  }
}
