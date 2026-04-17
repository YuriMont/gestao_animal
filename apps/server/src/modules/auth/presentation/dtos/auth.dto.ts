import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
	token: z.string(),
	user: z.object({
		id: z.string(),
		email: z.string(),
		name: z.string(),
		role: z.string(),
		organizationId: z.string(),
	}),
});

export const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, "Password must be at least 8 characters"),
	name: z.string().min(3),
	role: z.enum(["VET", "MANAGER", "OPERATOR"]).optional(),
	organizationId: z.string().uuid(),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
