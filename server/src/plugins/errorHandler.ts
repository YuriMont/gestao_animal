import type { FastifyInstance } from 'fastify';

export default async function errorHandlerPlugin(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    if (error && typeof error === 'object' && 'validation' in error) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: (error as any).validation,
      });
    }
    reply.send(error);
  });
}
