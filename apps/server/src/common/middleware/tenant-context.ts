import type { FastifyReply, FastifyRequest } from "fastify";

export async function tenantContextHook(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // In a real scenario, the tenantId is extracted from the decoded JWT payload
  // For now, we check for a header 'x-tenant-id' for development/testing
  const tenantId = request.headers["x-tenant-id"] as string;

  if (!tenantId) {
    return reply.status(400).send({
      error: "Tenant Missing",
      message: "Organization ID (x-tenant-id) must be provided in headers",
    });
  }

  request.tenantId = tenantId;
}
