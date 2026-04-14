import swagger from '@fastify/swagger';
import fastifyScalar from '@scalar/fastify-api-reference';
import type { FastifyInstance } from 'fastify';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    transform: jsonSchemaTransform,
    openapi: {
      info: {
        title: 'Animal Management API',
        description: 'API for managing animals',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:3333' }],
    },
  });
}

export async function registerSwaggerUI(app: FastifyInstance) {
  await app.register(fastifyScalar, {
    routePrefix: '/docs',
    configuration: {
      title: 'Animal Management API Docs',
    },
  });
}
