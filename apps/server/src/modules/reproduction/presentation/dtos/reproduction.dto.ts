import { PregnancyStatus } from "generated/prisma";
import z from "zod";

export const createEstrusSchema = z.object({
  animalId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  observation: z.string().optional(),
});

export const estrusResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  observation: z.string().optional(),
  organizationId: z.string(),
});

export const createPregnancySchema = z.object({
  animalId: z.string().uuid(),
  detectedDate: z.coerce.date(),
  expectedDate: z.coerce.date().optional(),
  status: z.string(),
});

export const pregnancyResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  detectedDate: z.date(),
  expectedDate: z.date().optional(),
  status: z.enum(PregnancyStatus),
  organizationId: z.string(),
});

export const createBirthSchema = z.object({
  motherId: z.string().uuid(),
  fatherId: z.string().uuid().optional(),
  birthDate: z.coerce.date(),
  offspringTag: z.string().optional(),
  status: z.string(),
});

export const birthResponseSchema = z.object({
  id: z.string(),
  motherId: z.string(),
  fatherId: z.string().optional(),
  birthDate: z.date(),
  offspringTag: z.string().optional(),
  status: z.string(),
  organizationId: z.string(),
});

export type CreateEstrusDTO = z.infer<typeof createEstrusSchema>;
export type EstrusResponseDTO = z.infer<typeof estrusResponseSchema>;
export type CreatePregnancyDTO = z.infer<typeof createPregnancySchema>;
export type PregnancyResponseDTO = z.infer<typeof pregnancyResponseSchema>;
export type CreateBirthDTO = z.infer<typeof createBirthSchema>;
export type BirthResponseDTO = z.infer<typeof birthResponseSchema>;
