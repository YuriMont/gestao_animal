import z from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
  role: z.enum(['VET', 'MANAGER', 'OPERATOR']).optional(),
  organizationId: z.string().uuid(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  organizationId: z.string(),
});

export type UserResponseDTO = z.infer<typeof userResponseSchema>;
