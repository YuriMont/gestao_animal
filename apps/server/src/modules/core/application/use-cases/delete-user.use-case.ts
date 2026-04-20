import { NotFoundError } from '@src/common/errors/app-error'
import type { IUserRepository } from '@src/modules/core/domain/repositories/user.repository'

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, organizationId: string): Promise<void> {
    const existing = await this.userRepository.findById(id)
    if (!existing || existing.props.organizationId !== organizationId) {
      throw new NotFoundError('User')
    }
    await this.userRepository.delete(id)
  }
}
