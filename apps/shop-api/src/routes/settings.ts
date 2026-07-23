import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { shopPrisma } from '@ronda/shop-db';
import { requireAdmin } from '../plugins/authenticate';

const SECRET_KEYS = new Set(['g2a_api_key']);

export async function settingsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', requireAdmin);

  app.get('/settings', async () => {
    const rows = await shopPrisma.shopSetting.findMany();
    return rows.map((r) => (SECRET_KEYS.has(r.key) ? { ...r, value: r.value ? '••••••••' : '' } : r));
  });

  app.put('/settings/:key', async (req, reply) => {
    const { key } = req.params as { key: string };
    const body = z.object({ value: z.string() }).safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    return shopPrisma.shopSetting.upsert({
      where: { key },
      update: { value: body.data.value },
      create: { key, value: body.data.value },
    });
  });
}
