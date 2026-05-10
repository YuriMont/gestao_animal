import { z } from "zod";

export const createWeightSchema = z.object({
  animalId: z.string(),
  weight: z.number().positive(),
  date: z.coerce.date().optional(),
});
export type CreateWeightDTO = z.infer<typeof createWeightSchema>;

export const createMilkSchema = z.object({
  animalId: z.string(),
  quantity: z.number().nonnegative(),
  unit: z.string(),
  date: z.coerce.date().optional(),
});
export type CreateMilkDTO = z.infer<typeof createMilkSchema>;

export interface WeightRecord {
  id: string;
  animalId: string;
  weight: number;
  date: Date;
  organizationId: string;
}

export interface MilkProductionRecord {
  id: string;
  animalId: string;
  quantity: number;
  unit: string;
  date: Date;
  organizationId: string;
}

export interface AnimalMetrics {
  animalId: string;
  averageWeight: number;
  totalMilk: number;
  lastWeight?: number;
  lastMilk?: number;
}
