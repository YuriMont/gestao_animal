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

const paginationMeta = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

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
            meta: paginationMeta,
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
        params: z.object({ id: z.string().uuid() }),
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
        params: z.object({ id: z.string().uuid() }),
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
        params: z.object({ id: z.string().uuid() }),
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
        params: z.object({ id: z.string().uuid() }),
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
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
      },
    },
    organizationController.delete,
  );

  // ── Enums ──────────────────────────────────────────────────────────────

  // Legacy flat endpoint (backward compatible)
  app.get(
    "/enums",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get all enum values",
        description:
          "Returns all static enum values used across the API for reference.",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            data: z.array(
              z.object({
                key: z.string(),
                label: z.string(),
              }),
            ),
          }),
        },
      },
    },
    enumsController.show,
  );

  // Hierarchical endpoint: /enums/:domain/:enumName
  app.get(
    "/enums/:domain/:enumName",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get specific enum values by domain and name",
        description:
          "Returns enum values for a specific domain (e.g., 'animals') and enum name (e.g., 'animalStatus').",
        security: [{ bearerAuth: [] }],
        params: z.object({
          domain: z.enum([
            "animals",
            "users",
            "organizations",
            "reproduction",
            "production",
            "financial",
            "alerts",
          ]),
          enumName: z.enum([
            "role",
            "animalStatus",
            "animalSex",
            "pregnancyStatus",
            "birthStatus",
            "financialType",
            "financialCategory",
            "treatmentStatus",
            "vaccineStatus",
          ]),
        }),
        response: {
          200: z.array(
            z.object({
              key: z.string(),
              label: z.string(),
            }),
          ),
        },
      },
    },
    enumsController.hierarchical,
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
            meta: paginationMeta,
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
        params: z.object({ id: z.string().uuid() }),
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
        params: z.object({ id: z.string().uuid() }),
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
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
      },
    },
    userController.delete,
  );
}
