import z from 'zod';

export const createAnimalSchema = z.object({
  tag: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().optional(),
  sex: z.string(),
  birthDate: z.coerce.date(),
  origin: z.string().optional(),
  status: z.string(),
});

export type CreateAnimalDTO = z.infer<typeof createAnimalSchema>;

export const animalResponseSchema = z.object({
  id: z.string(),
  tag: z.string(),
  species: z.string(),
  breed: z.string().optional(),
  sex: z.string(),
  birthDate: z.date(),
  origin: z.string().optional(),
  status: z.string(),
  organizationId: z.string(),
});

export type AnimalResponseDTO = z.infer<typeof animalResponseSchema>;
