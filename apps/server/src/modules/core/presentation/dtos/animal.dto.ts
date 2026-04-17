import { z } from "zod";

const animalStatusEnum = z.enum(["Active", "Sold", "Deceased", "Quarantine"]);
const animalSexEnum = z.enum(["Male", "Female"]);

export const createAnimalSchema = z.object({
	tag: z.string().min(1),
	species: z.string().min(1),
	breed: z.string().optional(),
	sex: animalSexEnum,
	birthDate: z.coerce.date(),
	origin: z.string().optional(),
	status: animalStatusEnum.default("Active"),
});

export type CreateAnimalDTO = z.infer<typeof createAnimalSchema>;

export const updateAnimalSchema = z.object({
	tag: z.string().min(1).optional(),
	species: z.string().min(1).optional(),
	breed: z.string().optional(),
	sex: animalSexEnum.optional(),
	birthDate: z.coerce.date().optional(),
	origin: z.string().optional(),
	status: animalStatusEnum.optional(),
});

export type UpdateAnimalDTO = z.infer<typeof updateAnimalSchema>;

export const listAnimalsQuerySchema = z.object({
	status: animalStatusEnum.optional(),
	species: z.string().optional(),
	sex: animalSexEnum.optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListAnimalsQueryDTO = z.infer<typeof listAnimalsQuerySchema>;

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
