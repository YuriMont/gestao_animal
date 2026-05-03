import { AnimalOrigin, AnimalSex, AnimalStatus, Species } from "@prisma/client";
import { z } from "zod";

export const createAnimalSchema = z.object({
  tag: z.string().min(1),
  species: z.nativeEnum(Species),
  breedId: z.string().optional(),
  sex: z.nativeEnum(AnimalSex),
  birthDate: z.coerce.date(),
  origin: z.nativeEnum(AnimalOrigin).optional(),
  status: z.nativeEnum(AnimalStatus).default(AnimalStatus.ACTIVE),
});

export type CreateAnimalDTO = z.infer<typeof createAnimalSchema>;

export const updateAnimalSchema = z.object({
  tag: z.string().min(1).optional(),
  species: z.nativeEnum(Species).optional(),
  breedId: z.string().optional(),
  sex: z.nativeEnum(AnimalSex).optional(),
  birthDate: z.coerce.date().optional(),
  origin: z.nativeEnum(AnimalOrigin).optional(),
  status: z.nativeEnum(AnimalStatus).optional(),
});

export type UpdateAnimalDTO = z.infer<typeof updateAnimalSchema>;

export const listAnimalsQuerySchema = z.object({
  status: z.nativeEnum(AnimalStatus).optional(),
  species: z.nativeEnum(Species).optional(),
  sex: z.nativeEnum(AnimalSex).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListAnimalsQueryDTO = z.infer<typeof listAnimalsQuerySchema>;

export const animalResponseSchema = z.object({
  id: z.string(),
  tag: z.string(),
  species: z.nativeEnum(Species),
  breedId: z.string().optional(),
  sex: z.nativeEnum(AnimalSex),
  birthDate: z.date(),
  origin: z.nativeEnum(AnimalOrigin).optional(),
  status: z.nativeEnum(AnimalStatus),
  organizationId: z.string(),
});

export type AnimalResponseDTO = z.infer<typeof animalResponseSchema>;
