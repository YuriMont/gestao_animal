import {
  BirthStatus,
  InseminationType,
  PregnancyStatus,
} from "@generated/prisma/client";
import { z } from "zod";

export const createEstrusSchema = z.object({
  animalId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  observation: z.string().optional(),
});
export type CreateEstrusDTO = z.infer<typeof createEstrusSchema>;

export const createPregnancySchema = z.object({
  animalId: z.string(),
  detectedDate: z.coerce.date(),
  expectedDate: z.coerce.date().optional(),
  status: z.nativeEnum(PregnancyStatus),
});
export type CreatePregnancyDTO = z.infer<typeof createPregnancySchema>;

export const createBirthSchema = z.object({
  motherId: z.string(),
  fatherId: z.string().optional(),
  birthDate: z.coerce.date(),
  offspringTag: z.string().optional(),
  status: z.nativeEnum(BirthStatus),
});
export type CreateBirthDTO = z.infer<typeof createBirthSchema>;

export const createInseminationSchema = z.object({
  animalId: z.string(),
  type: z.nativeEnum(InseminationType),
  date: z.coerce.date().optional(),
  fatherId: z.string().optional(),
  semenBatch: z.string().optional(),
  success: z.boolean().optional(),
});
export type CreateInseminationDTO = z.infer<typeof createInseminationSchema>;

export interface EstrusRecord {
  id: string;
  animalId: string;
  startDate: Date;
  endDate?: Date | null;
  observation?: string | null;
  organizationId: string;
}

export interface PregnancyRecord {
  id: string;
  animalId: string;
  detectedDate: Date;
  expectedDate?: Date | null;
  status: string;
  organizationId: string;
}

export interface BirthRecord {
  id: string;
  motherId: string;
  fatherId?: string | null;
  birthDate: Date;
  offspringTag?: string | null;
  status: string;
  organizationId: string;
}

export interface InseminationRecord {
  id: string;
  animalId: string;
  type: string;
  date: Date;
  fatherId?: string | null;
  semenBatch?: string | null;
  success?: boolean | null;
  organizationId: string;
}
