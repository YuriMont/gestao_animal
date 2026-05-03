import { paginationMetaSchema } from "@src/common/dtos/pagination.dto";
import { animalController } from "@src/modules/core/presentation/controllers/animal.controller";
import { enumsController } from "@src/modules/core/presentation/controllers/enums.controller";
import { organizationController } from "@src/modules/core/presentation/controllers/organization.controller";
import { userController } from "@src/modules/core/presentation/controllers/user.controller";
import {
  animalResponseSchema,
  createAnimalSchema,
  listAnimalsQuerySchema,
  updateAnimalSchema,
} from "@src/modules/core/presentation/dtos/animal.dto";
import {
  createOrganizationSchema,
  organizationResponseSchema,
  updateOrganizationSchema,
} from "@src/modules/core/presentation/dtos/organization.dto";
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
  userResponseSchema,
} from "@src/modules/core/presentation/dtos/user.dto";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { enumResponseSchema } from "./dtos/enums.dto";

export default async function coreRoutes(app: FastifyInstance) {
  // ── Animals ──────────────────────────────────────────────────────────────
  app.post(
    "/animals",
    {
      schema: {
        tags: ["Animals"],
        summary: "Create a new animal",
        description: "Creates a new animal for the authenticated organization.",
        security: [{ bearerAuth: [] }],
        body: createAnimalSchema,
        response: { 201: animalResponseSchema },
      },
    },
    animalController.create,
  );

  app.get(
    "/animals",
    {
      schema: {
        tags: ["Animals"],
        summary: "List animals",
        description:
          "Returns a paginated list of animals for the organization. Supports filtering by status, species and sex.",
        security: [{ bearerAuth: [] }],
        querystring: listAnimalsQuerySchema,
        response: {
          200: z.object({
            data: z.array(animalResponseSchema),
            meta: paginationMetaSchema,
          }),
        },
      },
    },
    animalController.list,
  );

  app.get(
    "/animals/:id",
    {
      schema: {
        tags: ["Animals"],
        summary: "Get animal by ID",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: { 200: animalResponseSchema },
      },
    },
    animalController.getById,
  );

  app.put(
    "/animals/:id",
    {
      schema: {
        tags: ["Animals"],
        summary: "Update animal",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        body: updateAnimalSchema,
        response: { 200: animalResponseSchema },
      },
    },
    animalController.update,
  );

  app.delete(
    "/animals/:id",
    {
      schema: {
        tags: ["Animals"],
        summary: "Delete animal",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: { 204: z.null() },
      },
    },
    animalController.delete,
  );

  // ── Organizations ────────────────────────────────────────────────────────
  app.post(
    "/organizations",
    {
      schema: {
        tags: ["Organizations"],
        summary: "Create a new organization",
        body: createOrganizationSchema,
        response: { 201: organizationResponseSchema },
      },
    },
    organizationController.create,
  );

  app.put(
    "/organizations/:id",
    {
      schema: {
        tags: ["Organizations"],
        summary: "Update organization",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        body: updateOrganizationSchema,
        response: { 200: organizationResponseSchema },
      },
    },
    organizationController.update,
  );

  app.delete(
    "/organizations/:id",
    {
      schema: {
        tags: ["Organizations"],
        summary: "Delete organization",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: { 204: z.null() },
      },
    },
    organizationController.delete,
  );

  // ── Enums ──────────────────────────────────────────────────────────────
  // Animals
  app.get(
    "/enums/animals/status",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get animal statuses",
        security: [{ bearerAuth: [] }],
        response: { 200: enumResponseSchema },
      },
    },
    enumsController.getAnimalStatus,
  );

  app.get(
    "/enums/animals/sex",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get animal sexes",
        security: [{ bearerAuth: [] }],
        response: { 200: enumResponseSchema },
      },
    },
    enumsController.getAnimalSex,
  );

  app.get(
    "/enums/animals/species",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get animal species",
        security: [{ bearerAuth: [] }],
        response: { 200: enumResponseSchema },
      },
    },
    enumsController.getSpecies,
  );

  app.get(
    "/enums/animals/origin",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get animal origins",
        security: [{ bearerAuth: [] }],
        response: { 200: enumResponseSchema },
      },
    },
    enumsController.getAnimalOrigin,
  );

  // Users
  app.get(
    "/enums/users/roles",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get user roles",
        security: [{ bearerAuth: [] }],
        response: { 200: enumResponseSchema },
      },
    },
    enumsController.getUserRoles,
  );

  // Reproduction
  app.get(
    "/enums/reproduction/pregnancy-status",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get pregnancy statuses",
        security: [{ bearerAuth: [] }],
        response: { 200: enumResponseSchema },
      },
    },
    enumsController.getPregnancyStatus,
  );

  app.get(
    "/enums/reproduction/birth-status",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get birth statuses",
        security: [{ bearerAuth: [] }],
        response: { 200: enumResponseSchema },
      },
    },
    enumsController.getBirthStatus,
  );

  app.get(
    "/enums/reproduction/insemination-types",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get insemination types",
        security: [{ bearerAuth: [] }],
        response: { 200: enumResponseSchema },
      },
    },
    enumsController.getInseminationType,
  );

  // Financial
  app.get(
    "/enums/financial/types",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get financial types",
        security: [{ bearerAuth: [] }],
        response: { 200: enumResponseSchema },
      },
    },
    enumsController.getFinancialTypes,
  );

  app.get(
    "/enums/financial/categories",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get financial categories",
        security: [{ bearerAuth: [] }],
        response: { 200: enumResponseSchema },
      },
    },
    enumsController.getFinancialCategories,
  );

  // ── Users ────────────────────────────────────────────────────────────────
  app.post(
    "/users",
    {
      schema: {
        tags: ["Users"],
        summary: "Create a new user",
        description:
          "Creates a user. Prefer POST /auth/register for user onboarding.",
        security: [{ bearerAuth: [] }],
        body: createUserSchema,
        response: { 201: userResponseSchema },
      },
    },
    userController.create,
  );

  app.get(
    "/users",
    {
      schema: {
        tags: ["Users"],
        summary: "List users of the organization",
        security: [{ bearerAuth: [] }],
        querystring: listUsersQuerySchema,
        response: {
          200: z.object({
            data: z.array(userResponseSchema),
            meta: paginationMetaSchema,
          }),
        },
      },
    },
    userController.list,
  );

  app.get(
    "/users/:id",
    {
      schema: {
        tags: ["Users"],
        summary: "Get user by ID",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: { 200: userResponseSchema },
      },
    },
    userController.getById,
  );

  app.put(
    "/users/:id",
    {
      schema: {
        tags: ["Users"],
        summary: "Update user",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        body: updateUserSchema,
        response: { 200: userResponseSchema },
      },
    },
    userController.update,
  );

  app.delete(
    "/users/:id",
    {
      schema: {
        tags: ["Users"],
        summary: "Delete user",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: { 204: z.null() },
      },
    },
    userController.delete,
  );
}
