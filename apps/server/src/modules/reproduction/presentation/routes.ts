import { paginationMetaSchema } from "@src/common/dtos/pagination.dto";
import { reproductionController } from "@src/modules/reproduction/presentation/controllers/reproduction.controller";
import type { FastifyInstance } from "fastify";
import z from "zod";
import {
  birthResponseSchema,
  createBirthSchema,
  createEstrusSchema,
  createInseminationSchema,
  createPregnancySchema,
  estrusResponseSchema,
  inseminationResponseSchema,
  pregnancyResponseSchema,
} from "./dtos/reproduction.dto";

export default async function reproductionRoutes(app: FastifyInstance) {
  app.post(
    "/reproduction/estrus",
    {
      schema: {
        tags: ["Reproduction"],
        summary: "Create estrus record",
        description:
          "Create an estrus record for an animal. Used to track breeding cycles and identify animals in estrus. This endpoint provides programmatic access to reproduction records.",
        body: createEstrusSchema,
        response: {
          201: z.object({ message: z.string(), estrus: estrusResponseSchema }),
        },
      },
    },
    reproductionController.createEstrus,
  );

  app.post(
    "/reproduction/pregnancies",
    {
      schema: {
        summary: "Create pregnancy record",
        tags: ["Reproduction"],
        description:
          "Create a pregnancy record for an animal. Used to document the start of a pregnancy cycle and track gestational information. This endpoint provides programmatic access to reproduction records.",
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
        summary: "Create birth record",
        tags: ["Reproduction"],
        description:
          "Create a birth record for an animal. Used to document the actual birth of a calf or offspring. This endpoint provides programmatic access to birth records.",
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
        description:
          "Register an insemination event for a female animal. Supports natural mating, artificial insemination, and embryo transfer. Links optionally to a male animal and tracks semen batch and outcome.",
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
        description:
          "Retrieve a paginated list of insemination records for the organization. Returns all registered insemination events sorted by date descending.",
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
        description:
          "Retrieve a list of pregnancy records for an animal. Returns all pregnancy records associated with the specified animal. Useful for accessing all historical pregnancy information.",
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
        description:
          "Get the complete history of reproduction records for a specific animal. Returns all estrus, pregnancy, and birth records linked to the animal. Useful for accessing full reproduction timeline.",
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
