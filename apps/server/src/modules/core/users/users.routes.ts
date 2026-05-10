import { enumField, getEnumValues } from "@src/common/lib/enums";
import { paginationMetaSchema } from "@src/common/lib/pagination";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { userController } from "../core.module";
import {
  createUserSchema,
  listUsersQuerySchema,
  updateUserSchema,
} from "./users.types";


const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: enumField,
  organizationId: z.string(),
});

export default async function userRoutes(app: FastifyInstance) {
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
}
