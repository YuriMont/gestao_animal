import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { organizationController } from "../core.module";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "./organizations.types";

const orgResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export default async function organizationRoutes(app: FastifyInstance) {
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
}
