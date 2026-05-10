import { Species } from "@generated/prisma/client";
import { z } from "zod";

export const createBreedSchema = z.object({
  name: z.string().min(1, "Breed name is required"),
  species: z.nativeEnum(Species),
});
export type CreateBreedDTO = z.infer<typeof createBreedSchema>;

export const updateBreedSchema = z.object({
  name: z.string().min(1).optional(),
  species: z.nativeEnum(Species).optional(),
});
export type UpdateBreedDTO = z.infer<typeof updateBreedSchema>;

export const listBreedsQuerySchema = z.object({
  species: z.nativeEnum(Species).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListBreedsQuery = z.infer<typeof listBreedsQuerySchema>;

export interface BreedRecord {
  id: string;
  name: string;
  species: string;
  organizationId: string;
}
