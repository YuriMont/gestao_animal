import { AppError } from '@src/common/errors/app-error';
import type { FastifyInstance } from 'fastify';

export default async function errorHandlerPlugin(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.code ?? 'Error',
        message: error.message,
      });
    }

    if (error && typeof error === 'object' && 'validation' in error) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: (error as any).validation,
      });
    }

    app.log.error(error);

    const err = error as any;
    const statusCode = err.statusCode ?? 500;
    return reply.status(statusCode).send({
      error: statusCode === 500 ? 'Internal Server Error' : err.message,
      message: statusCode === 500 ? 'An unexpected error occurred' : err.message,
    });
  });
}
