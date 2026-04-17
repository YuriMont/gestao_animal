import type { User } from '@src/modules/core/domain/entities/user.entity';
import type { IUserRepository } from '@src/modules/core/domain/repositories/user.repository';

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(organizationId: string, page = 1, limit = 20): Promise<{ users: User[]; total: number; page: number; limit: number; totalPages: number }> {
    return this.userRepository.listByOrganization(organizationId, page, limit);
  }
}
