import { authController } from '@src/modules/auth/presentation/controllers/auth.controller'
import {
  loginResponseSchema,
  loginSchema,
  registerSchema,
} from '@src/modules/auth/presentation/dtos/auth.dto'
import { userResponseSchema } from '@src/modules/core/presentation/dtos/user.dto'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate user',
        description:
          'Authenticates a user and returns a JWT token. Use this token as Bearer in the Authorization header for all protected endpoints.',
        body: loginSchema,
        response: {
          200: loginResponseSchema,
        },
      },
    },
    authController.login
  )

  app.post(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description:
          'Creates a new user account linked to an existing organization. The organizationId must be a valid UUID of an existing organization.',
        body: registerSchema,
        response: {
          201: z.object({
            message: z.string(),
            user: userResponseSchema,
          }),
        },
      },
    },
    authController.register
  )
}
