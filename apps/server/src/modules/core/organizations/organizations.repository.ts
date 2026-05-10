import type { PrismaClient } from "@generated/prisma/client";
import type {
  CreateOrganizationDTO,
  OrganizationRecord,
  UpdateOrganizationDTO,
} from "./organizations.types";

export interface IOrganizationRepository {
  create(data: CreateOrganizationDTO): Promise<OrganizationRecord>;
  findById(id: string): Promise<OrganizationRecord | null>;
  list(): Promise<OrganizationRecord[]>;
  update(id: string, data: UpdateOrganizationDTO): Promise<OrganizationRecord>;
  delete(id: string): Promise<void>;
}

export class PrismaOrganizationRepository implements IOrganizationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateOrganizationDTO): Promise<OrganizationRecord> {
    return this.prisma.organization.create({ data });
  }

  async findById(id: string): Promise<OrganizationRecord | null> {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  async list(): Promise<OrganizationRecord[]> {
    return this.prisma.organization.findMany();
  }

  async update(
    id: string,
    data: UpdateOrganizationDTO,
  ): Promise<OrganizationRecord> {
    return this.prisma.organization.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.delete({ where: { id } });
  }
}
