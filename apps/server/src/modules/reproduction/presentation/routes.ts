import { reproductionController } from "@src/modules/reproduction/presentation/controllers/reproduction.controller";
import type { FastifyInstance } from "fastify";
import z from "zod";
import {
  createBirthSchema,
  createEstrusSchema,
  createPregnancySchema,
  birthResponseSchema,
  estrusResponseSchema,
  pregnancyResponseSchema,
} from "./dtos/reproduction.dto";

export default async function reproductionRoutes(app: FastifyInstance) {
  app.post(
    "/reproduction/estrus",
    {
      schema: {
        body: createEstrusSchema,
        response: { 201: z.object({ message: z.string(), estrus: estrusResponseSchema }) },
      },
    },
    reproductionController.createEstrus,
  );

  app.post(
    "/reproduction/pregnancies",
    {
      schema: {
        body: createPregnancySchema,
        response: { 201: z.object({ message: z.string(), pregnancy: pregnancyResponseSchema }) },
      },
    },
    reproductionController.createPregnancy,
  );

  app.post(
    "/reproduction/birth",
    {
      schema: {
        body: createBirthSchema,
        response: { 201: z.object({ message: z.string(), birth: birthResponseSchema }) },
      },
    },
    reproductionController.createBirth,
  );

  app.get(
    "/reproduction/pregnancies",
    { schema: { response: { 200: z.array(pregnancyResponseSchema) } } },
    reproductionController.getPregnancies,
  );

  app.get(
    "/reproduction/history/:animalId",
    { schema: { response: { 200: z.array(z.any()) } } },
    reproductionController.getAnimalHistory,
  );
}
