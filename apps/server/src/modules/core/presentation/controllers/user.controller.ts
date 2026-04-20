import { PrismaService } from '@src/infrastructure/persistence/prisma.service'
import { CreateUserUseCase } from '@src/modules/core/application/use-cases/create-user.use-case'
import { DeleteUserUseCase } from '@src/modules/core/application/use-cases/delete-user.use-case'
import { ListUsersUseCase } from '@src/modules/core/application/use-cases/list-users.use-case'
import { UpdateUserUseCase } from '@src/modules/core/application/use-cases/update-user.use-case'
import { PrismaUserRepository } from '@src/modules/core/infrastructure/persistence/user.repository'
import type {
  CreateUserDTO,
  ListUsersQueryDTO,
  UpdateUserDTO,
} from '@src/modules/core/presentation/dtos/user.dto'
import type { FastifyReply, FastifyRequest } from 'fastify'

function getRepo() {
  return new PrismaUserRepository(PrismaService.getInstance())
}

function safeUser(user: any) {
  return {
    id: user.id,
    email: user.props.email,
    name: user.props.name,
    role: user.props.role,
    organizationId: user.props.organizationId,
  }
}

export const userController = {
  async create(
    request: FastifyRequest<{ Body: CreateUserDTO }>,
    reply: FastifyReply
  ) {
    const useCase = new CreateUserUseCase(getRepo())
    const user = await useCase.execute(request.body)
    return reply.status(201).send(safeUser(user))
  },

  async list(
    request: FastifyRequest<{ Querystring: ListUsersQueryDTO }>,
    reply: FastifyReply
  ) {
    const useCase = new ListUsersUseCase(getRepo())
    const { page, limit } = request.query
    const result = await useCase.execute(request.tenantId!, page, limit)
    return reply.send({
      data: result.users.map(safeUser),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    })
  },

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const repo = getRepo()
    const user = await repo.findById(request.params.id)
    if (!user || user.props.organizationId !== request.tenantId) {
      return reply
        .status(404)
        .send({ error: 'Not Found', message: 'User not found' })
    }
    return reply.send(safeUser(user))
  },

  async update(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserDTO }>,
    reply: FastifyReply
  ) {
    const useCase = new UpdateUserUseCase(getRepo())
    const user = await useCase.execute(
      request.params.id,
      request.tenantId!,
      request.body
    )
    return reply.send(safeUser(user))
  },

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const useCase = new DeleteUserUseCase(getRepo())
    await useCase.execute(request.params.id, request.tenantId!)
    return reply.status(204).send()
  },
}
