import { NotFoundError } from "@src/common/errors/app-error";
import type { IOrganizationRepository } from "./organizations.repository";
import type {
  CreateOrganizationDTO,
  OrganizationRecord,
  UpdateOrganizationDTO,
} from "./organizations.types";

export class OrganizationService {
  constructor(private readonly repo: IOrganizationRepository) {}

  async create(data: CreateOrganizationDTO): Promise<OrganizationRecord> {
    return this.repo.create(data);
  }

  async getById(id: string): Promise<OrganizationRecord> {
    const org = await this.repo.findById(id);
    if (!org) throw new NotFoundError("Organization");
    return org;
  }

  async list() {
    return this.repo.list();
  }

  async update(
    id: string,
    data: UpdateOrganizationDTO,
  ): Promise<OrganizationRecord> {
    await this.getById(id);
    return this.repo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.repo.delete(id);
  }
}
