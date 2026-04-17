import bcrypt from 'bcrypt';
import { ConflictError } from '@src/common/errors/app-error';
import { User } from '@src/modules/core/domain/entities/user.entity';
import type { IUserRepository } from '@src/modules/core/domain/repositories/user.repository';

const SALT_ROUNDS = 12;

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: any): Promise<User> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = User.create({
      ...data,
      password: hashedPassword,
      role: data.role ?? 'OPERATOR',
    });

    return this.userRepository.create(user);
  }
}
