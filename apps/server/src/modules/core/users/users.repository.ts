import type { Prisma, PrismaClient } from "@generated/prisma/client";
import type { ListUsersQuery, UserRecord } from "./users.types";

export interface IUserRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<UserRecord>;
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  list(
    organizationId: string,
    filters: ListUsersQuery,
  ): Promise<{ users: UserRecord[]; total: number }>;
  update(
    id: string,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<UserRecord>;
  delete(id: string): Promise<void>;
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.UserUncheckedCreateInput): Promise<UserRecord> {
    return this.prisma.user.create({ data }) as unknown as Promise<UserRecord>;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({
      where: { email },
    }) as unknown as Promise<UserRecord | null>;
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({
      where: { id },
    }) as unknown as Promise<UserRecord | null>;
  }

  async list(
    organizationId: string,
    filters: ListUsersQuery,
  ): Promise<{ users: UserRecord[]; total: number }> {
    const { page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const where = { organizationId };
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { users: users as unknown as UserRecord[], total };
  }

  async update(
    id: string,
    data: Prisma.UserUncheckedUpdateInput,
  ): Promise<UserRecord> {
    return this.prisma.user.update({
      where: { id },
      data,
    }) as unknown as Promise<UserRecord>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
