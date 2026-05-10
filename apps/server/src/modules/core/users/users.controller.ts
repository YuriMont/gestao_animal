import { getEnumLabel } from "@src/common/lib/enums";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserService } from "./users.service";
import type {
  CreateUserDTO,
  ListUsersQuery,
  UpdateUserDTO,
} from "./users.types";

function mapUser(u: any) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: { key: u.role, label: getEnumLabel("role", u.role) },
    organizationId: u.organizationId,
  };
}

export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (
    request: FastifyRequest<{ Body: CreateUserDTO }>,
    reply: FastifyReply,
  ) => {
    const user = await this.userService.create(request.body);
    return reply.status(201).send(mapUser(user));
  };

  list = async (
    request: FastifyRequest<{ Querystring: ListUsersQuery }>,
    reply: FastifyReply,
  ) => {
    const result = await this.userService.list(
      request.tenantId!,
      request.query,
    );
    return reply.send({
      data: result.users.map(mapUser),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  };

  getById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const user = await this.userService.getById(
      request.params.id,
      request.tenantId!,
    );
    return reply.send(mapUser(user));
  };

  update = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateUserDTO;
    }>,
    reply: FastifyReply,
  ) => {
    const user = await this.userService.update(
      request.params.id,
      request.tenantId!,
      request.body,
    );
    return reply.send(mapUser(user));
  };

  delete = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.userService.delete(request.params.id, request.tenantId!);
    return reply.status(204).send();
  };
}
