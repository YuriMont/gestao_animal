import type { PrismaClient } from '@prisma/client';
import { User } from '@src/modules/core/domain/entities/user.entity';
import type { IUserRepository } from '@src/modules/core/domain/repositories/user.repository';

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

    return User.create(
      {
        ...user.props,
      },
      created.id,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return User.create(
      {
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role as any,
        organizationId: user.organizationId,
      },
      user.id,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return User.create(
      {
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role as any,
        organizationId: user.organizationId,
      },
      user.id,
    );
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id! },
      data: {
        email: user.props.email,
        name: user.props.name,
        role: user.props.role,
        organizationId: user.props.organizationId,
      },
    });

    return User.create(
      {
        ...user.props,
      },
      updated.id,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
