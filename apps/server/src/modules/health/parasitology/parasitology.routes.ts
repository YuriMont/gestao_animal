import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { parasitologyController } from "./parasitology.module";
import {
  createParasiteMonitoringSchema,
  listParasiteMonitoringQuerySchema,
  parasiteMonitoringResponseSchema,
  updateParasiteMonitoringSchema,
} from "./parasitology.types";

const parasiteMonitoringSchema = parasiteMonitoringResponseSchema;

export default async function parasitologyRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        tags: ["Parasite Monitoring"],
        summary: "Create parasite monitoring record",
        security: [{ bearerAuth: [] }],
        body: createParasiteMonitoringSchema,
        response: {
          201: z.object({
            message: z.string(),
            record: parasiteMonitoringSchema,
          }),
        },
      },
    },
    parasitologyController.create,
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["Parasite Monitoring"],
        summary: "List parasite monitoring records",
        security: [{ bearerAuth: [] }],
        querystring: listParasiteMonitoringQuerySchema,
        response: {
          200: z.object({
            data: z.array(parasiteMonitoringSchema),
            meta: z.object({
              total: z.number(),
              page: z.number(),
              limit: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    },
    parasitologyController.list,
  );

  app.get(
    "/animal/:animalId",
    {
      schema: {
        tags: ["Parasite Monitoring"],
        summary: "Get parasite monitoring records by animal",
        security: [{ bearerAuth: [] }],
        params: z.object({ animalId: z.string() }),
        response: {
          200: z.array(parasiteMonitoringSchema),
        },
      },
    },
    parasitologyController.getByAnimalId,
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Parasite Monitoring"],
        summary: "Get parasite monitoring record by ID",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: {
          200: parasiteMonitoringSchema,
        },
      },
    },
    parasitologyController.getById,
  );

  app.put(
    "/:id",
    {
      schema: {
        tags: ["Parasite Monitoring"],
        summary: "Update parasite monitoring record",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        body: updateParasiteMonitoringSchema,
        response: {
          200: z.object({
            message: z.string(),
            record: parasiteMonitoringSchema,
          }),
        },
      },
    },
    parasitologyController.update,
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Parasite Monitoring"],
        summary: "Delete parasite monitoring record",
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: {
          204: z.any(),
        },
      },
    },
    parasitologyController.delete,
  );
}
