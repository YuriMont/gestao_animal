import { z } from "zod";

export const createParasiteMonitoringSchema = z.object({
  animalId: z.string(),
  date: z.coerce.date(),
  famacha: z.number().int().min(0).max(5).optional(),
  opg: z.number().int().min(0).optional(),
  nextParasiteCheck: z.coerce.date().optional(),
  observation: z.string().optional(),
});
export type CreateParasiteMonitoringDTO = z.infer<
  typeof createParasiteMonitoringSchema
>;

export const updateParasiteMonitoringSchema =
  createParasiteMonitoringSchema.partial();
export type UpdateParasiteMonitoringDTO = z.infer<
  typeof updateParasiteMonitoringSchema
>;

export const listParasiteMonitoringQuerySchema = z.object({
  animalId: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListParasiteMonitoringQuery = z.infer<
  typeof listParasiteMonitoringQuerySchema
>;

export interface ParasiteMonitoringRecord {
  id: string;
  animalId: string;
  date: Date;
  famacha: number | null;
  opg: number | null;
  nextParasiteCheck: Date | null;
  observation: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const parasiteMonitoringResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  date: z.date(),
  famacha: z.number().nullable(),
  opg: z.number().nullable(),
  nextParasiteCheck: z.date().nullable(),
  observation: z.string().nullable(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ParasiteMonitoringResponseDTO = z.infer<
  typeof parasiteMonitoringResponseSchema
>;
