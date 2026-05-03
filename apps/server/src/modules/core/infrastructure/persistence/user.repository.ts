import type { PrismaClient, User as PrismaUser } from "@prisma/client";
import { User } from "@src/modules/core/domain/entities/user.entity";
import type {
  IUserRepository,
  PaginatedUsers,
} from "@src/modules/core/domain/repositories/user.repository";

function toEntity(u: PrismaUser): User {
  return User.create(
    {
      email: u.email,
      password: u.password,
      name: u.name,
      role: u.role as "VET" | "MANAGER" | "OPERATOR",
      organizationId: u.organizationId,
    },
    u.id,
  );
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        email: user.props.email,
        password: user.props.password,
        name: user.props.name,
        role: user.props.role,
        organizationId: user.props.organizationId,
      },
    });
    return toEntity(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? toEntity(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? toEntity(user) : null;
  }

  async listByOrganization(
    organizationId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedUsers> {
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

    return {
      users: users.map(toEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id! },
      data: {
        name: user.props.name,
        role: user.props.role,
      },
    });
    return toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
