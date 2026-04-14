import { User } from '@src/modules/core/domain/entities/user.entity';
import type { IUserRepository } from '@src/modules/core/domain/repositories/user.repository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: any): Promise<User> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const user = User.create(data);
    return this.userRepository.create(user);
  }
}
