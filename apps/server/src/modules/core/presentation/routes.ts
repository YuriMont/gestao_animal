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
        tags: ["Animals"],
        summary: "Create a new animal",
        description: "Create a new animal record for the organization. Used to document animal details including species, breed, sex, birth information, and current status. This endpoint allows programmatic addition of animals to the system.",
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
        tags: ["Organizations"],
        summary: "Create a new organization",
        description: "Create a new organization record for the system. Used to document the parent entity for animals, users, records, and other entities belonging to it. This endpoint allows programmatic addition of new organizations.",
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
        tags: ["Users"],
        summary: "Create a new user",
        description: "Create a new user record for the organization. Used to define user accounts with their roles and permissions. This endpoint is used to programmatically create users associated with a specific organization.",
        body: createUserSchema,
        response: {
          201: userResponseSchema,
        },
      },
    },
    userController.create,
  );
}
