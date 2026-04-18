import rateLimit from "@fastify/rate-limit";
import alertRoutes from "@src/modules/alerts/presentation/routes";
import authRoutes from "@src/modules/auth/presentation/routes";
import animalRoutes from "@src/modules/core/presentation/routes";
import financialRoutes from "@src/modules/financial/presentation/routes";
import healthRoutes from "@src/modules/health/presentation/routes";
import productionRoutes from "@src/modules/production/presentation/routes";
import reproductionRoutes from "@src/modules/reproduction/presentation/routes";
import { authPlugin } from "@src/plugins/auth";
import corsPlugin from "@src/plugins/cors";
import errorHandlerPlugin from "@src/plugins/errorHandler";
import { registerSwagger, registerSwaggerUI } from "@src/plugins/swagger";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";

export async function createApp() {
  const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // 1. Global plugins
  await app.register(corsPlugin);
  await app.register(errorHandlerPlugin);

  // 2. Swagger must be registered before routes
  await registerSwagger(app);

  // 3. Rate limiting — 100 req/min per IP globally, stricter on auth
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
    }),
  });

  // 4. Public routes (no auth required)
  app.register(
    async (pub) => {
      await pub.register(authRoutes);
    },
    { prefix: "/auth" },
  );

  // 5. Protected API routes — JWT required on all /v1/* endpoints
  app.register(
    async (v1) => {
      v1.addHook("preHandler", authPlugin);
      await v1.register(animalRoutes);
      await v1.register(healthRoutes);
      await v1.register(reproductionRoutes);
      await v1.register(productionRoutes);
      await v1.register(financialRoutes);
      await v1.register(alertRoutes);
    },
    { prefix: "/v1" },
  );

  // 6. Health check (public)
  app.get(
    "/",
    {
      schema: {
        tags: ["System"],
        summary: "Health check",
        description:
          "Returns server status. Useful for monitoring and load balancer checks.",
        response: {
          200: z.object({ message: z.string(), timestamp: z.string() }),
        },
      },
    },
    async () => ({
      message: "Server is running!",
      timestamp: new Date().toISOString(),
    }),
  );

  // 7. Swagger UI after all routes
  await registerSwaggerUI(app);

  return app;
}
