import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

export default async function corsPlugin(app: FastifyInstance) {
  app.register(cors, {
    origin: (_origin, cb) => {
      cb(null, true);
      return { ok: true };
    },
    credentials: true,
  });
}
