import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginDTO = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(3),
  role: z.enum(["VET", "MANAGER", "OPERATOR"]).optional(),
  organizationId: z.string(),
});
export type RegisterDTO = z.infer<typeof registerSchema>;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}
