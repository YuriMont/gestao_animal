import { AppError } from "@src/common/errors/app-error";
import {
  getEnumValues,
  validateEnumDomain,
  validateEnumName,
} from "@src/modules/core/presentation/dtos/enums.dto";
import { type FastifyReply, type FastifyRequest } from "fastify";

export const enumsController = {
  show: async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send(await getEnumValues("animals", "animalStatus"));
  },
  hierarchical: async (request: FastifyRequest, reply: FastifyReply) => {
    const { domain, enumName } = request.params as {
      domain: string;
      enumName: string;
    };

    if (!validateEnumDomain(domain)) {
      throw new AppError(`Invalid enum domain: ${domain}`, 400, "BAD_REQUEST");
    }
    if (!validateEnumName(enumName)) {
      throw new AppError(`Invalid enum name: ${enumName}`, 400, "BAD_REQUEST");
    }

    reply.send(getEnumValues(domain, enumName));
  },
};

export type EnumsController = typeof enumsController;
