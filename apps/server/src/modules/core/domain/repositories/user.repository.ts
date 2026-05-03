import type { User } from "@src/modules/core/domain/entities/user.entity";

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  listByOrganization(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedUsers>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
