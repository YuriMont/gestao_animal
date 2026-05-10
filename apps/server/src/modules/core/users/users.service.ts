import { NotFoundError } from "@src/common/errors/app-error";
import type { IUserRepository } from "./users.repository";
import type {
  CreateUserDTO,
  ListUsersQuery,
  SafeUser,
  UpdateUserDTO,
  UserRecord,
} from "./users.types";

function safeUser(u: UserRecord): SafeUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    organizationId: u.organizationId,
  };
}

export class UserService {
  constructor(private readonly repo: IUserRepository) {}

  async create(data: CreateUserDTO): Promise<SafeUser> {
    const user = await this.repo.create(data as any);
    return safeUser(user);
  }

  async list(orgId: string, filters: ListUsersQuery) {
    const result = await this.repo.list(orgId, filters);
    return {
      users: result.users.map(safeUser),
      total: result.total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(result.total / filters.limit),
    };
  }

  async getById(id: string, orgId: string): Promise<SafeUser> {
    const user = await this.repo.findById(id);
    if (!user || user.organizationId !== orgId) {
      throw new NotFoundError("User");
    }
    return safeUser(user);
  }

  async update(
    id: string,
    orgId: string,
    data: UpdateUserDTO,
  ): Promise<SafeUser> {
    const existing = await this.repo.findById(id);
    if (!existing || existing.organizationId !== orgId) {
      throw new NotFoundError("User");
    }
    const updated = await this.repo.update(id, data as any);
    return safeUser(updated);
  }

  async delete(id: string, orgId: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing || existing.organizationId !== orgId) {
      throw new NotFoundError("User");
    }
    await this.repo.delete(id);
  }
}
