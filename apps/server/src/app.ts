import { tenantContextHook } from "@src/common/middleware/tenant-context";
import alertRoutes from "@src/modules/alerts/presentation/routes";
import animalRoutes from "@src/modules/core/presentation/routes";
import financialRoutes from "@src/modules/financial/presentation/routes";
import healthRoutes from "@src/modules/health/presentation/routes";
import productionRoutes from "@src/modules/production/presentation/routes";
import reproductionRoutes from "@src/modules/reproduction/presentation/routes";
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

  // 1. Register Swagger CORE first
  await registerSwagger(app);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Global Plugins
  await app.register(corsPlugin);
  await app.register(errorHandlerPlugin);

  // Security & Context
  // We add tenantContextHook as a preHandler to ensure tenantId is always available
  app.addHook("preHandler", async (request, reply) => {
    if (request.url.startsWith("/docs")) {
      return;
    }
    return tenantContextHook(request, reply);
  });

  // Note: Auth plugin is usually applied to specific routes or groups
  // But we can register the logic here if needed globally
  // await app.register(authPlugin);

  // API Versioning
  app.register(
    async (v1) => {
      // Domain Modules for v1
      await v1.register(animalRoutes);
      await v1.register(healthRoutes);
      await v1.register(reproductionRoutes);
      await v1.register(productionRoutes);
      await v1.register(financialRoutes);
      await v1.register(alertRoutes);
    },
    { prefix: "/v1" },
  );

  // Health check
  app.get(
    "/",
    {
      schema: {
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async () => {
      return { message: "Server is running!" };
    },
  );

  // Register Swagger UI after all routes have been defined
  await registerSwaggerUI(app);

  return app;
}
