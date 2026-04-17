import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@src/common/errors/app-error';
import type { IUserRepository } from '@src/modules/core/domain/repositories/user.repository';
import type { LoginDTO } from '@src/modules/auth/presentation/dtos/auth.dto';

export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: LoginDTO): Promise<{ token: string; user: { id: string; email: string; name: string; role: string; organizationId: string } }> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.props.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not configured');

    const token = jwt.sign(
      {
        id: user.id,
        email: user.props.email,
        role: user.props.role,
        organizationId: user.props.organizationId,
      },
      secret,
      { expiresIn: '24h' },
    );

    return {
      token,
      user: {
        id: user.id!,
        email: user.props.email,
        name: user.props.name,
        role: user.props.role,
        organizationId: user.props.organizationId,
      },
    };
  }
}
