import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export interface UserPayload {
  id: string;
  email: string;
  role: 'VET' | 'MANAGER' | 'OPERATOR';
  organizationId: string;
}

export async function authPlugin(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Authorization header is missing',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid token format',
    });
  }

  try {
    // Secret should be in .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as UserPayload;
    request.user = decoded;
    request.tenantId = decoded.organizationId;
  } catch (_err) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
}

export function authorize(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    if (!user || !roles.includes(user.role)) {
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      });
    }
  };
}
