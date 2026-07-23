import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { shopPrisma } from '@ronda/shop-db';
import { requireAdmin } from '../plugins/authenticate';

const categorySchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function categoryRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', requireAdmin);

  app.get('/categories', async () => {
    return shopPrisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  });

  app.post('/categories', async (req, reply) => {
    const body = categorySchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    return shopPrisma.category.create({ data: body.data });
  });

  app.put('/categories/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = categorySchema.partial().safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    return shopPrisma.category.update({ where: { id }, data: body.data });
  });

  app.delete('/categories/:id', async (req) => {
    const { id } = req.params as { id: string };
    await shopPrisma.category.delete({ where: { id } });
    return { ok: true };
  });
}
