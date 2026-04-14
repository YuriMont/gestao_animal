import z from 'zod';

export const createWeightSchema = z.object({
  animalId: z.string().uuid(),
  weight: z.number().positive(),
  date: z.coerce.date().optional(),
});

export const weightResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  weight: z.number(),
  date: z.date(),
  organizationId: z.string(),
});

export const createMilkSchema = z.object({
  animalId: z.string().uuid(),
  quantity: z.number().nonnegative(),
  unit: z.string(),
  date: z.coerce.date().optional(),
});

export const milkResponseSchema = z.object({
  id: z.string(),
  animalId: z.string(),
  quantity: z.number(),
  unit: z.string(),
  date: z.date(),
  organizationId: z.string(),
});

export const animalMetricsSchema = z.object({
  animalId: z.string(),
  averageWeight: z.number(),
  totalMilk: z.number(),
  lastWeight: z.number().optional(),
  lastMilk: z.number().optional(),
});

export type CreateWeightDTO = z.infer<typeof createWeightSchema>;
export type WeightResponseDTO = z.infer<typeof weightResponseSchema>;
export type CreateMilkDTO = z.infer<typeof createMilkSchema>;
export type MilkResponseDTO = z.infer<typeof milkResponseSchema>;
export type AnimalMetricsDTO = z.infer<typeof animalMetricsSchema>;
