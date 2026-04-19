import { NotFoundError } from "@src/common/errors/app-error";
import { PrismaService } from "@src/infrastructure/persistence/prisma.service";
import { CreateOrganizationUseCase } from "@src/modules/core/application/use-cases/create-organization.use-case";
import { Organization } from "@src/modules/core/domain/entities/organization.entity";
import { PrismaOrganizationRepository } from "@src/modules/core/infrastructure/persistence/organization.repository";
import type { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
} from "../dtos/organization.dto";

function getRepo() {
  return new PrismaOrganizationRepository(PrismaService.getInstance());
}

function safeOrg(org: any) {
  return {
    id: org.id,
    name: org.props.name,
    createdAt: org.props.createdAt,
    updatedAt: org.props.updatedAt,
  };
}

export const organizationController = {
  async create(
    request: FastifyRequest<{ Body: CreateOrganizationDTO }>,
    reply: FastifyReply,
  ) {
    const useCase = new CreateOrganizationUseCase(getRepo());
    const org = await useCase.execute(request.body);
    return reply.status(201).send(safeOrg(org));
  },

  async list(_request: FastifyRequest, reply: FastifyReply) {
    const repo = getRepo();
    const orgs = await repo.list();
    return reply.send({ data: orgs.map(safeOrg) });
  },

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const repo = getRepo();
    const org = await repo.findById(request.params.id);
    if (!org) throw new NotFoundError("Organization");
    return reply.send(safeOrg(org));
  },

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateOrganizationDTO;
    }>,
    reply: FastifyReply,
  ) {
    const repo = getRepo();
    const existing = await repo.findById(request.params.id);
    if (!existing) throw new NotFoundError("Organization");

    const updated = await repo.update(
      Organization.create(
        { ...existing.props, name: request.body.name },
        request.params.id,
      ),
    );
    return reply.send(safeOrg(updated));
  },

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const repo = getRepo();
    const existing = await repo.findById(request.params.id);
    if (!existing) throw new NotFoundError("Organization");
    await repo.delete(request.params.id);
    return reply.status(204).send();
  },
};
