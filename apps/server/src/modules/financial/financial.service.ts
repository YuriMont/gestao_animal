import { NotFoundError } from "@src/common/errors/app-error";
import type { IFinancialRepository } from "./financial.repository";
import type {
  CreateFinancialRecordDTO,
  FinancialRecordRecord,
  FinancialSummary,
  UpdateFinancialRecordDTO,
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

  async getById(id: string, orgId: string): Promise<FinancialRecordRecord> {
    const record = await this.repo.getById(id, orgId);
    if (!record) {
      throw new NotFoundError("Registro não encontrado");
    }
    return record;
  }

  async update(
    id: string,
    data: UpdateFinancialRecordDTO,
    orgId: string,
  ): Promise<FinancialRecordRecord> {
    const existing = await this.repo.getById(id, orgId);
    if (!existing) {
      throw new NotFoundError("Registro não encontrado");
    }
    return this.repo.update(id, data, orgId);
  }

  async delete(id: string, orgId: string): Promise<void> {
    const existing = await this.repo.getById(id, orgId);
    if (!existing) {
      throw new NotFoundError("Registro não encontrado");
    }
    return this.repo.delete(id, orgId);
  }
}
