import { getEnumValues } from "@src/common/lib/enums";
import type { FastifyInstance } from "fastify";
import { z } from "zod";

export default async function enumRoutes(app: FastifyInstance) {
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
}
