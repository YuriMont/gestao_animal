import { getEnumValues } from "@src/common/lib/enums";
import { paginationMetaSchema } from "@src/common/lib/pagination";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { animalController } from "../core.module";
import {
  createAnimalSchema,
  listAnimalsQuerySchema,
  updateAnimalSchema,
} from "./animals.types";

const enumField = z.object({ key: z.string(), label: z.string() });

const animalResponseSchema = z.object({
  id: z.string(),
  tag: z.string(),
  species: enumField,
  breed: z.object({ id: z.string(), name: z.string() }).nullish(),
  sex: enumField,
  birthDate: z.date(),
  origin: enumField.optional(),
  status: enumField,
  organizationId: z.string(),
});

export default async function animalRoutes(app: FastifyInstance) {
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
}
