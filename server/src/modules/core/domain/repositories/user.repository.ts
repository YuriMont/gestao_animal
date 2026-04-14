import type { User } from '@src/modules/core/domain/entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
