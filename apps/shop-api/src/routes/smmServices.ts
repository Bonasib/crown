import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { shopPrisma } from '@ronda/shop-db';
import { MAX_SMM_SERVICES } from '@ronda/shop-core';
import { requireAdmin } from '../plugins/authenticate';

const serviceSchema = z.object({
  providerId: z.string().min(1),
  categoryId: z.string().nullable().optional(),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  platform: z.string().min(1),
  type: z.string().min(1),
  providerServiceId: z.string().min(1),
  costPer1000Minor: z.number().int().nonnegative(),
  currency: z.string().optional(),
  profitPercent: z.number().nullable().optional(),
  minQuantity: z.number().int().positive().optional(),
  maxQuantity: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const smmCategorySchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function smmServiceRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', requireAdmin);

  app.get('/smm-categories', async () => shopPrisma.smmCategory.findMany({ orderBy: { sortOrder: 'asc' } }));

  app.post('/smm-categories', async (req, reply) => {
    const body = smmCategorySchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    return shopPrisma.smmCategory.create({ data: body.data });
  });

  app.put('/smm-categories/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = smmCategorySchema.partial().safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    return shopPrisma.smmCategory.update({ where: { id }, data: body.data });
  });

  app.delete('/smm-categories/:id', async (req) => {
    const { id } = req.params as { id: string };
    await shopPrisma.smmCategory.delete({ where: { id } });
    return { ok: true };
  });

  app.get('/smm-services', async (req) => {
    const { categoryId } = req.query as { categoryId?: string };
    return shopPrisma.smmService.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { sortOrder: 'asc' },
    });
  });

  app.post('/smm-services', async (req, reply) => {
    const body = serviceSchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });

    const count = await shopPrisma.smmService.count();
    if (count >= MAX_SMM_SERVICES) {
      return reply.code(422).send({ code: 'LIMIT_REACHED', message: `SMM service catalog is capped at ${MAX_SMM_SERVICES} entries.` });
    }

    return shopPrisma.smmService.create({ data: body.data });
  });

  app.put('/smm-services/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = serviceSchema.partial().safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    return shopPrisma.smmService.update({ where: { id }, data: body.data });
  });

  app.delete('/smm-services/:id', async (req) => {
    const { id } = req.params as { id: string };
    await shopPrisma.smmService.delete({ where: { id } });
    return { ok: true };
  });
}
