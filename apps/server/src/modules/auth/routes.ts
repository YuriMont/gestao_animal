import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { authController } from "./auth.module";
import { loginSchema, registerSchema } from "./auth.types";

const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  organizationId: z.string(),
});

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Authenticate user",
        body: loginSchema,
        response: {
          200: z.object({
            token: z.string(),
            user: userResponseSchema,
          }),
        },
      },
    },
    authController.login,
  );

  app.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Register a new user",
        body: registerSchema,
        response: {
          201: z.object({ message: z.string(), user: userResponseSchema }),
        },
      },
    },
    authController.register,
  );
}
