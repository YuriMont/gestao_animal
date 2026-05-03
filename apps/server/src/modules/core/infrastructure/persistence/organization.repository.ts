import type { PrismaClient } from "@prisma/client";
import { Organization } from "@src/modules/core/domain/entities/organization.entity";
import type { IOrganizationRepository } from "@src/modules/core/domain/repositories/organization.repository";

export class PrismaOrganizationRepository implements IOrganizationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(organization: Organization): Promise<Organization> {
    const created = await this.prisma.organization.create({
      data: {
        name: organization.props.name,
      },
    });

    return Organization.create(
      {
        name: created.name,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
      created.id,
    );
  }

  async findById(id: string): Promise<Organization | null> {
    const org = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!org) return null;

    return Organization.create(
      {
        name: org.name,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
      },
      org.id,
    );
  }

  async list(): Promise<Organization[]> {
    const orgs = await this.prisma.organization.findMany();
    return orgs.map((o) =>
      Organization.create(
        {
          name: o.name,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
        },
        o.id,
      ),
    );
  }

  async update(organization: Organization): Promise<Organization> {
    const updated = await this.prisma.organization.update({
      where: { id: organization.id! },
      data: {
        name: organization.props.name,
      },
    });

    return Organization.create(
      {
        name: updated.name,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
      updated.id,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.delete({
      where: { id },
    });
  }
}
