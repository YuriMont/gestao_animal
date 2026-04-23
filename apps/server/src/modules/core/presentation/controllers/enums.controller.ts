import { getEnumValues } from '@src/modules/core/presentation/dtos/enums.dto'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const enumsController = {
  getAnimalStatus: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues('animals', 'animalStatus'))
  },
  getAnimalSex: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues('animals', 'animalSex'))
  },
  getSpecies: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues('animals', 'species'))
  },
  getAnimalOrigin: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues('animals', 'animalOrigin'))
  },
  getUserRoles: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues('users', 'role'))
  },
  getPregnancyStatus: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues('reproduction', 'pregnancyStatus'))
  },
  getBirthStatus: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues('reproduction', 'birthStatus'))
  },
  getInseminationType: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues('reproduction', 'inseminationType'))
  },
  getFinancialTypes: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues('financial', 'financialType'))
  },
  getFinancialCategories: async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    reply.send(getEnumValues('financial', 'financialCategory'))
  },
}

export type EnumsController = typeof enumsController
