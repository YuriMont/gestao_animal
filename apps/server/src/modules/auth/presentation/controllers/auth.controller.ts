import { PrismaService } from '@src/infrastructure/persistence/prisma.service'
import { LoginUseCase } from '@src/modules/auth/application/use-cases/login.use-case'
import type {
  LoginDTO,
  RegisterDTO,
} from '@src/modules/auth/presentation/dtos/auth.dto'
import { CreateUserUseCase } from '@src/modules/core/application/use-cases/create-user.use-case'
import { PrismaUserRepository } from '@src/modules/core/infrastructure/persistence/user.repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const authController = {
  async login(
    request: FastifyRequest<{ Body: LoginDTO }>,
    reply: FastifyReply
  ) {
    const repository = new PrismaUserRepository(PrismaService.getInstance())
    const useCase = new LoginUseCase(repository)
    const result = await useCase.execute(request.body)
    return reply.status(200).send(result)
  },

  async register(
    request: FastifyRequest<{ Body: RegisterDTO }>,
    reply: FastifyReply
  ) {
    const repository = new PrismaUserRepository(PrismaService.getInstance())
    const useCase = new CreateUserUseCase(repository)
    const user = await useCase.execute(request.body)
    return reply.status(201).send({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.props.email,
        name: user.props.name,
        role: user.props.role,
        organizationId: user.props.organizationId,
      },
    })
  },
}
