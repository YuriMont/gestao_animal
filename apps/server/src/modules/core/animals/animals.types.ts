import {
	AnimalOrigin,
	AnimalSex,
	AnimalStatus,
	type Prisma,
	Species,
} from "@generated/prisma/client";
import { enumField } from "@src/common/lib";
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

export const updateAnimalSchema = createAnimalSchema.partial();
export type UpdateAnimalDTO = z.infer<typeof updateAnimalSchema>;

export const listAnimalsQuerySchema = z.object({
	status: z.nativeEnum(AnimalStatus).optional(),
	species: z.nativeEnum(Species).optional(),
	sex: z.nativeEnum(AnimalSex).optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type ListAnimalsQuery = z.infer<typeof listAnimalsQuerySchema>;

export type AnimalPayload = Prisma.AnimalGetPayload<{
	include: {
		breed: true;
		species: true;
	};
}>;

export const animalResponseSchema = z.object({
	id: z.string(),
	tag: z.string(),
	species: enumField,
	breed: z.object({ id: z.string(), name: z.string() }).nullish(),
	sex: enumField,
	birthDate: z.date(),
	origin: enumField.optional(),
	status: enumField,
	organizationId: z.string(),
});

export type AnimalResponseDTO = z.infer<typeof animalResponseSchema>;
