import type { FastifyReply, FastifyRequest } from "fastify";
import type { OrganizationService } from "./organizations.service";
import type {
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
} from "./organizations.types";

export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateOrganizationDTO }>,
    reply: FastifyReply,
  ) => {
    const org = await this.organizationService.create(request.body);
    return reply.status(201).send(org);
  };

  list = async (_request: FastifyRequest, reply: FastifyReply) => {
    const orgs = await this.organizationService.list();
    return reply.send({ data: orgs });
  };

  getById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const org = await this.organizationService.getById(request.params.id);
    return reply.send(org);
  };

  update = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateOrganizationDTO;
    }>,
    reply: FastifyReply,
  ) => {
    const org = await this.organizationService.update(
      request.params.id,
      request.body,
    );
    return reply.send(org);
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.organizationService.delete(request.params.id);
    return reply.status(204).send();
  };
}
