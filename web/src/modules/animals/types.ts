import { z } from "zod";

export const createAnimalSchema = z.object({
	tag: z.string().min(1, "Tag is required"),
	species: z.string().min(1, "Species is required"),
	breed: z.string().optional(),
	sex: z.string().min(1, "Sex is required"),
	birthDate: z.coerce.date(),
	origin: z.string().optional(),
	status: z.string().min(1, "Status is required"),
});

export type CreateAnimalInput = z.infer<typeof createAnimalSchema>;

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

export type Animal = z.infer<typeof animalResponseSchema>;
