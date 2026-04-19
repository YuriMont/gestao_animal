import { AnimalSex, AnimalStatus } from "generated/prisma";
import { z } from "zod";

export const createAnimalSchema = z.object({
  tag: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().optional(),
  sex: z.enum(AnimalSex),
  birthDate: z.coerce.date(),
  origin: z.string().optional(),
  status: z.enum(AnimalStatus).default(AnimalStatus.ACTIVE),
});

export type CreateAnimalDTO = z.infer<typeof createAnimalSchema>;

export const updateAnimalSchema = z.object({
  tag: z.string().min(1).optional(),
  species: z.string().min(1).optional(),
  breed: z.string().optional(),
  sex: z.enum(AnimalSex).optional(),
  birthDate: z.coerce.date().optional(),
  origin: z.string().optional(),
  status: z.enum(AnimalStatus).optional(),
});

export type UpdateAnimalDTO = z.infer<typeof updateAnimalSchema>;

export const listAnimalsQuerySchema = z.object({
  status: z.enum(AnimalStatus).optional(),
  species: z.string().optional(),
  sex: z.enum(AnimalSex).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListAnimalsQueryDTO = z.infer<typeof listAnimalsQuerySchema>;

export const animalResponseSchema = z.object({
  id: z.string(),
  tag: z.string(),
  species: z.string(),
  breed: z.string().optional(),
  sex: z.enum(AnimalSex),
  birthDate: z.date(),
  origin: z.string().optional(),
  status: z.enum(AnimalStatus),
  organizationId: z.string(),
});

export type AnimalResponseDTO = z.infer<typeof animalResponseSchema>;
