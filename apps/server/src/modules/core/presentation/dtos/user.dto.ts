import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(3),
  role: z.enum(['VET', 'MANAGER', 'OPERATOR']).optional(),
  organizationId: z.string().uuid(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  role: z.enum(['VET', 'MANAGER', 'OPERATOR']).optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListUsersQueryDTO = z.infer<typeof listUsersQuerySchema>;

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  organizationId: z.string(),
});

export type UserResponseDTO = z.infer<typeof userResponseSchema>;
