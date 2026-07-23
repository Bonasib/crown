import type { AdminJwtPayload } from './auth';

declare module 'fastify' {
  interface FastifyRequest {
    admin?: AdminJwtPayload;
  }
}
