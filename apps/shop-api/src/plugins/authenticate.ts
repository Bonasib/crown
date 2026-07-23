import type { FastifyReply, FastifyRequest } from 'fastify';
import { verifyAdminToken } from '../auth';

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) {
    await reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Missing bearer token' });
    return;
  }
  try {
    req.admin = verifyAdminToken(token);
  } catch {
    await reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
  }
}
