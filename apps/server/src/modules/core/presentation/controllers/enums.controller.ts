import { getEnumValues } from "@src/modules/core/presentation/dtos/enums.dto";
import type { FastifyReply, FastifyRequest } from "fastify";

export const enumsController = {
  getAnimalStatus: async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("animalStatus"));
  },
  getAnimalSex: async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("animalSex"));
  },
  getSpecies: async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("species"));
  },
  getAnimalOrigin: async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("animalOrigin"));
  },
  getUserRoles: async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("role"));
  },
  getPregnancyStatus: async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("pregnancyStatus"));
  },
  getBirthStatus: async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("birthStatus"));
  },
  getInseminationType: async (
    _request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    reply.send(getEnumValues("inseminationType"));
  },
  getFinancialTypes: async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("financialType"));
  },
  getFinancialCategories: async (
    _request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    reply.send(getEnumValues("financialCategory"));
  },
};

export type EnumsController = typeof enumsController;
