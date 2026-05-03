import type { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    tenantId?: string;
    user?: {
      id: string;
      email: string;
      role: string;
      organizationId: string;
    };
  }
}
