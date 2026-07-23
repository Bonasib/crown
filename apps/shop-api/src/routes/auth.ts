import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { shopPrisma } from '@ronda/shop-db';
import { signAdminToken } from '../auth';
import { requireAdmin } from '../plugins/authenticate';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/auth/login', async (req, reply) => {
    const body = loginSchema.safeParse(req.body);
    if (!body.success) {
      return reply.code(400).send({ code: 'BAD_REQUEST', message: 'username and password are required' });
    }

    const admin = await shopPrisma.adminUser.findUnique({ where: { username: body.data.username } });
    if (!admin || !admin.isActive) {
      return reply.code(401).send({ code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' });
    }

    const valid = await bcrypt.compare(body.data.password, admin.passwordHash);
    if (!valid) {
      return reply.code(401).send({ code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' });
    }

    await shopPrisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

    const token = signAdminToken({ sub: admin.id, username: admin.username, role: admin.role });
    return { token, username: admin.username, role: admin.role };
  });

  app.post('/auth/change-password', { preHandler: requireAdmin }, async (req, reply) => {
    const body = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8) }).safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });

    const admin = await shopPrisma.adminUser.findUnique({ where: { id: req.admin!.sub } });
    if (!admin) return reply.code(404).send({ code: 'NOT_FOUND', message: 'Admin not found' });

    const valid = await bcrypt.compare(body.data.currentPassword, admin.passwordHash);
    if (!valid) return reply.code(401).send({ code: 'INVALID_CREDENTIALS', message: 'Current password is incorrect' });

    await shopPrisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: await bcrypt.hash(body.data.newPassword, 10) },
    });
    return { ok: true };
  });
}
