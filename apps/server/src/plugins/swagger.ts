import swagger from "@fastify/swagger";
import fastifyScalar from "@scalar/fastify-api-reference";
import type { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    transform: jsonSchemaTransform,
    openapi: {
      info: {
        title: "Animal Management API",
        description:
          "REST API for managing livestock — animals, health records, reproduction, production, and financials.",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:3333" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description:
              "Obtain a token via POST /auth/login and send it as: Authorization: Bearer <token>",
          },
        },
      },
      tags: [
        { name: "Auth", description: "Authentication — login and register" },
        { name: "Animals", description: "Animal management" },
        { name: "Organizations", description: "Organization management" },
        { name: "Users", description: "User management" },
        {
          name: "Health",
          description: "Health records, vaccines and treatments",
        },
        { name: "Reproduction", description: "Estrus, pregnancies and births" },
        {
          name: "Production",
          description: "Weight and milk production records",
        },
        { name: "Financial", description: "Financial records and summary" },
        { name: "Alerts", description: "Alert rules and notifications" },
        { name: "System", description: "Server health check" },
      ],
    },
  });
}

export async function registerSwaggerUI(app: FastifyInstance) {
  await app.register(fastifyScalar, {
    routePrefix: "/docs",
    configuration: {
      title: "Animal Management API Docs",
    },
  });
}
