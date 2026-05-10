import { getEnumValues } from "@src/common/lib/enums";
import { paginationMetaSchema } from "@src/common/lib/pagination";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  createAnimalSchema,
  listAnimalsQuerySchema,
  updateAnimalSchema,
} from "./animals/animals.types";
import {
  createBreedSchema,
  listBreedsQuerySchema,
  updateBreedSchema,
} from "./breeds/breeds.types";
import {
  animalController,
  breedController,
  organizationController,
  userController,
} from "./core.module";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "./organizations/organizations.types";
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
} from "./users/users.types";

const enumField = z.object({ key: z.string(), label: z.string() });

const animalResponseSchema = z.object({
  id: z.string(),
  tag: z.string(),
  species: enumField,
  breed: z.object({ id: z.string(), name: z.string() }).optional(),
  sex: enumField,
  birthDate: z.date(),
  origin: enumField.optional(),
  status: enumField,
  organizationId: z.string(),
});

const breedResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: enumField,
  organizationId: z.string(),
});

const orgResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: enumField,
  organizationId: z.string(),
});

export default async function coreRoutes(app: FastifyInstance) {
  // ── Animals ──────────────────────────────────────────────────────────────
  app.post(
    "/animals",
    {
      schema: {
        tags: ["Animals"],
        summary: "Create a new animal",
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

  // ── Breeds ────────────────────────────────────────────────────────────────
  app.post(
    "/breeds",
    {
      schema: {
        tags: ["Breeds"],
        summary: "Create a new breed",
        security: [{ bearerAuth: [] }],
        body: createBreedSchema,
        response: { 201: breedResponseSchema },
      },
    },
    breedController.create,
  );

  app.get(
    "/breeds",
    {
      schema: {
        tags: ["Breeds"],
        summary: "List breeds",
        security: [{ bearerAuth: [] }],
        querystring: listBreedsQuerySchema,
        response: {
          200: z.object({
            data: z.array(breedResponseSchema),
            meta: paginationMetaSchema,
          }),
        },
      },
    },
    breedController.list,
  );

  app.get(
    "/breeds/:id",
    {
      schema: {
        tags: ["Breeds"],
        summary: "Get breed by ID",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: { 200: breedResponseSchema },
      },
    },
    breedController.getById,
  );

  app.put(
    "/breeds/:id",
    {
      schema: {
        tags: ["Breeds"],
        summary: "Update breed",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        body: updateBreedSchema,
        response: { 200: breedResponseSchema },
      },
    },
    breedController.update,
  );

  app.delete(
    "/breeds/:id",
    {
      schema: {
        tags: ["Breeds"],
        summary: "Delete breed",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: { 204: z.null() },
      },
    },
    breedController.delete,
  );

  // ── Organizations ────────────────────────────────────────────────────────
  app.post(
    "/organizations",
    {
      schema: {
        tags: ["Organizations"],
        summary: "Create a new organization",
        body: createOrganizationSchema,
        response: { 201: orgResponseSchema },
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
        response: { 200: orgResponseSchema },
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
  app.get(
    "/enums/animals/status",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get animal statuses",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(z.object({ key: z.string(), label: z.string() })),
        },
      },
    },
    async (_req, reply) => reply.send(getEnumValues("animalStatus")),
  );

  app.get(
    "/enums/animals/sex",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get animal sexes",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(z.object({ key: z.string(), label: z.string() })),
        },
      },
    },
    async (_req, reply) => reply.send(getEnumValues("animalSex")),
  );

  app.get(
    "/enums/animals/species",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get animal species",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(z.object({ key: z.string(), label: z.string() })),
        },
      },
    },
    async (_req, reply) => reply.send(getEnumValues("species")),
  );

  app.get(
    "/enums/animals/origin",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get animal origins",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(z.object({ key: z.string(), label: z.string() })),
        },
      },
    },
    async (_req, reply) => reply.send(getEnumValues("animalOrigin")),
  );

  app.get(
    "/enums/users/roles",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get user roles",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(z.object({ key: z.string(), label: z.string() })),
        },
      },
    },
    async (_req, reply) => reply.send(getEnumValues("role")),
  );

  app.get(
    "/enums/reproduction/pregnancy-status",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get pregnancy statuses",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(z.object({ key: z.string(), label: z.string() })),
        },
      },
    },
    async (_req, reply) => reply.send(getEnumValues("pregnancyStatus")),
  );

  app.get(
    "/enums/reproduction/birth-status",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get birth statuses",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(z.object({ key: z.string(), label: z.string() })),
        },
      },
    },
    async (_req, reply) => reply.send(getEnumValues("birthStatus")),
  );

  app.get(
    "/enums/reproduction/insemination-types",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get insemination types",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(z.object({ key: z.string(), label: z.string() })),
        },
      },
    },
    async (_req, reply) => reply.send(getEnumValues("inseminationType")),
  );

  app.get(
    "/enums/financial/types",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get financial types",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(z.object({ key: z.string(), label: z.string() })),
        },
      },
    },
    async (_req, reply) => reply.send(getEnumValues("financialType")),
  );

  app.get(
    "/enums/financial/categories",
    {
      schema: {
        tags: ["Enums"],
        summary: "Get financial categories",
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(z.object({ key: z.string(), label: z.string() })),
        },
      },
    },
    async (_req, reply) => reply.send(getEnumValues("financialCategory")),
  );

  // ── Users ────────────────────────────────────────────────────────────────
  app.post(
    "/users",
    {
      schema: {
        tags: ["Users"],
        summary: "Create a new user",
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
