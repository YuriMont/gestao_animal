import { getEnumValues } from "@src/modules/core/presentation/dtos/enums.dto";
import { type FastifyReply, type FastifyRequest } from "fastify";

export const enumsController = {
  getAnimalStatus: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("animals", "animalStatus"));
  },
  getAnimalSex: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("animals", "animalSex"));
  },
  getUserRoles: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("users", "role"));
  },
  getPregnancyStatus: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("reproduction", "pregnancyStatus"));
  },
  getBirthStatus: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("reproduction", "birthStatus"));
  },
  getFinancialTypes: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(getEnumValues("financial", "financialType"));
  },
  getFinancialCategories: async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    reply.send(getEnumValues("financial", "financialCategory"));
  },
};

export type EnumsController = typeof enumsController;
