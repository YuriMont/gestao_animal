import { PrismaService } from '@src/infrastructure/persistence/prisma.service'
import { Birth } from '@src/modules/reproduction/domain/entities/birth.entity'
import { Estrus } from '@src/modules/reproduction/domain/entities/estrus.entity'
import { Pregnancy } from '@src/modules/reproduction/domain/entities/pregnancy.entity'
import { PrismaReproductionRepository } from '@src/modules/reproduction/infrastructure/persistence/reproduction.repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const reproductionController = {
  async createEstrus(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance()
    )

    try {
      const estrus = await repository.createEstrus(
        Estrus.create({
          ...(request.body as any),
          organizationId: tenantId!,
        })
      )
      return reply
        .status(201)
        .send({ message: 'Estrus cycle recorded', estrus })
    } catch (error: any) {
      return reply
        .status(400)
        .send({ error: 'Bad Request', message: error.message })
    }
  },

  async createPregnancy(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance()
    )

    try {
      const pregnancy = await repository.createPregnancy(
        Pregnancy.create({
          ...(request.body as any),
          organizationId: tenantId!,
        })
      )
      return reply
        .status(201)
        .send({ message: 'Pregnancy recorded', pregnancy })
    } catch (error: any) {
      return reply
        .status(400)
        .send({ error: 'Bad Request', message: error.message })
    }
  },

  async createBirth(request: FastifyRequest, reply: FastifyReply) {
    const tenantId = request.tenantId
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance()
    )

    try {
      const birth = await repository.createBirth(
        Birth.create({
          ...(request.body as any),
          organizationId: tenantId!,
        })
      )
      return reply.status(201).send({ message: 'Birth recorded', birth })
    } catch (error: any) {
      return reply
        .status(400)
        .send({ error: 'Bad Request', message: error.message })
    }
  },

  async getPregnancies(
    request: FastifyRequest<{ Querystring: { page: number; limit: number } }>,
    reply: FastifyReply
  ) {
    const tenantId = request.tenantId
    const { page, limit } = request.query
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance()
    )
    const { pregnancies, total } =
      await repository.findPregnanciesByOrganization(tenantId!, page, limit)
    return reply.send({
      data: pregnancies.map(item => ({ id: item.id, ...item.props })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  },

  async getAnimalHistory(
    request: FastifyRequest<{ Params: { animalId: string } }>,
    reply: FastifyReply
  ) {
    const { animalId } = request.params
    const tenantId = request.tenantId
    const repository = new PrismaReproductionRepository(
      PrismaService.getInstance()
    )

    const history = await repository.findReproductionHistoryByAnimal(
      animalId,
      tenantId!
    )
    return reply.send(history)
  },
}
