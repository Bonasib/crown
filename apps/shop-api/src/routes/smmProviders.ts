import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { shopPrisma } from '@ronda/shop-db';
import { requireAdmin } from '../plugins/authenticate';

const providerSchema = z.object({
  name: z.string().min(1),
  baseUrl: z.string().url(),
  apiKey: z.string().min(1),
  isActive: z.boolean().optional(),
});

export async function smmProviderRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', requireAdmin);

  app.get('/smm-providers', async () => {
    return shopPrisma.smmProvider.findMany({ orderBy: { createdAt: 'desc' } });
  });

  app.post('/smm-providers', async (req, reply) => {
    const body = providerSchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    return shopPrisma.smmProvider.create({ data: body.data });
  });

  app.put('/smm-providers/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = providerSchema.partial().safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    return shopPrisma.smmProvider.update({ where: { id }, data: body.data });
  });

  app.delete('/smm-providers/:id', async (req) => {
    const { id } = req.params as { id: string };
    await shopPrisma.smmProvider.delete({ where: { id } });
    return { ok: true };
  });
}
