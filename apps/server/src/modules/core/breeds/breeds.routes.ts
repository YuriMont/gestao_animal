import { enumField } from "@src/common/lib";
import { paginationMetaSchema } from "@src/common/lib/pagination";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { breedController } from "../core.module";
import {
  createBreedSchema,
  listBreedsQuerySchema,
  updateBreedSchema,
} from "./breeds.types";

const breedResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  species: enumField,
  organizationId: z.string(),
});

export default async function breedRoutes(app: FastifyInstance) {
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
}
