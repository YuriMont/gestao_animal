import { enumField } from "@src/common/lib";
import { paginationMetaSchema } from "@src/common/lib/pagination";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { reproductionController } from "./reproduction.module";
import {
  createBirthSchema,
  createEstrusSchema,
  createInseminationSchema,
  createPregnancySchema,
} from "./reproduction.types";

const estrusResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  startDate: z.date(),
  endDate: z.date().nullish(),
  observation: z.string().nullish(),
  organizationId: z.string(),
});

const pregnancyResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  detectedDate: z.date(),
  expectedDate: z.date().nullish(),
  status: enumField,
  organizationId: z.string(),
});

const birthResponseSchema = z.object({
  id: z.string(),
  motherId: z.string(),
  fatherId: z.string().nullish(),
  birthDate: z.date(),
  offspringTag: z.string().nullish(),
  status: enumField,
  organizationId: z.string(),
});

const inseminationResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  type: enumField,
  date: z.date(),
  fatherId: z.string().nullish(),
  semenBatch: z.string().nullish(),
  success: z.boolean().nullish(),
  organizationId: z.string(),
});

export default async function reproductionRoutes(app: FastifyInstance) {
  app.post(
    "/reproduction/estrus",
    {
      schema: {
        tags: ["Reproduction"],
        summary: "Create estrus record",
        security: [{ bearerAuth: [] }],
        body: createEstrusSchema,
        response: {
          201: z.object({
            message: z.string(),
            estrus: estrusResponseSchema,
          }),
        },
      },
    },
    reproductionController.createEstrus,
  );

  app.post(
    "/reproduction/pregnancies",
    {
      schema: {
        tags: ["Reproduction"],
        summary: "Create pregnancy record",
        security: [{ bearerAuth: [] }],
        body: createPregnancySchema,
        response: {
          201: z.object({
            message: z.string(),
            pregnancy: pregnancyResponseSchema,
          }),
        },
      },
    },
    reproductionController.createPregnancy,
  );

  app.post(
    "/reproduction/birth",
    {
      schema: {
        tags: ["Reproduction"],
        summary: "Create birth record",
        security: [{ bearerAuth: [] }],
        body: createBirthSchema,
        response: {
          201: z.object({ message: z.string(), birth: birthResponseSchema }),
        },
      },
    },
    reproductionController.createBirth,
  );

  app.post(
    "/reproduction/inseminations",
    {
      schema: {
        tags: ["Reproduction"],
        summary: "Create insemination record",
        security: [{ bearerAuth: [] }],
        body: createInseminationSchema,
        response: {
          201: z.object({
            message: z.string(),
            insemination: inseminationResponseSchema,
          }),
        },
      },
    },
    reproductionController.createInsemination,
  );

  app.get(
    "/reproduction/inseminations",
    {
      schema: {
        tags: ["Reproduction"],
        summary: "Get insemination records",
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(20),
        }),
        response: {
          200: z.object({
            data: z.array(inseminationResponseSchema),
            meta: paginationMetaSchema,
          }),
        },
      },
    },
    reproductionController.getInseminations,
  );

  app.get(
    "/reproduction/pregnancies",
    {
      schema: {
        tags: ["Reproduction"],
        summary: "Get pregnancy records",
        security: [{ bearerAuth: [] }],
        querystring: z.object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(20),
        }),
        response: {
          200: z.object({
            data: z.array(pregnancyResponseSchema),
            meta: paginationMetaSchema,
          }),
        },
      },
    },
    reproductionController.getPregnancies,
  );

  app.get(
    "/reproduction/history/:animalId",
    {
      schema: {
        tags: ["Reproduction"],
        summary: "Get reproduction history",
        security: [{ bearerAuth: [] }],
        params: z.object({ animalId: z.string() }),
        response: {
          200: z.object({
            estrus: z.array(estrusResponseSchema),
            pregnancies: z.array(pregnancyResponseSchema),
            births: z.array(birthResponseSchema),
            inseminations: z.array(inseminationResponseSchema),
          }),
        },
      },
    },
    reproductionController.getAnimalHistory,
  );
}
