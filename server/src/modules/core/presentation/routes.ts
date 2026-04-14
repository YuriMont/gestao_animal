import { animalController } from '@src/modules/core/presentation/controllers/animal.controller';
import { organizationController } from '@src/modules/core/presentation/controllers/organization.controller';
import { userController } from '@src/modules/core/presentation/controllers/user.controller';
import { createAnimalSchema, animalResponseSchema } from '@src/modules/core/presentation/dtos/animal.dto';
import { createOrganizationSchema, organizationResponseSchema } from '@src/modules/core/presentation/dtos/organization.dto';
import { createUserSchema, userResponseSchema } from '@src/modules/core/presentation/dtos/user.dto';
import type { FastifyInstance } from 'fastify';

export default async function coreRoutes(app: FastifyInstance) {
  // Animals
  app.post(
    '/animals',
    {
      schema: {
        body: createAnimalSchema,
        response: {
          201: animalResponseSchema,
        },
      },
    },
    animalController.create,
  );

  // Organizations
  app.post(
    '/organizations',
    {
      schema: {
        body: createOrganizationSchema,
        response: {
          201: organizationResponseSchema,
        },
      },
    },
    organizationController.create,
  );

  // Users
  app.post(
    '/users',
    {
      schema: {
        body: createUserSchema,
        response: {
          201: userResponseSchema,
        },
      },
    },
    userController.create,
  );
}
