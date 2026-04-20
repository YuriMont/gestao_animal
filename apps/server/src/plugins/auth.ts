import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

export interface UserPayload {
  id: string
  email: string
  role: 'VET' | 'MANAGER' | 'OPERATOR'
  organizationId: string
}

export async function authPlugin(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Authorization header is missing or malformed',
    })
  }

  const token = authHeader.split(' ')[1]

  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')

  try {
    const decoded = jwt.verify(token, secret) as UserPayload
    request.user = decoded
    request.tenantId = decoded.organizationId
  } catch (_err) {
    return reply
      .status(401)
      .send({ error: 'Unauthorized', message: 'Invalid or expired token' })
  }
}

export function authorize(...roles: Array<'VET' | 'MANAGER' | 'OPERATOR'>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user || !roles.includes(request.user.role as any)) {
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      })
    }
  }
}
