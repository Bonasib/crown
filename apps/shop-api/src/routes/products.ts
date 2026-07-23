import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { shopPrisma } from '@ronda/shop-db';
import { MAX_PRODUCTS } from '@ronda/shop-core';
import { requireAdmin } from '../plugins/authenticate';

const productSchema = z.object({
  categoryId: z.string().nullable().optional(),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionAr: z.string().nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  sourceType: z.enum(['MANUAL', 'G2A']).optional(),
  externalRef: z.string().nullable().optional(),
  costMinor: z.number().int().nonnegative(),
  currency: z.string().optional(),
  profitPercent: z.number().nullable().optional(),
  deliveryType: z.enum(['TEXT', 'FILE', 'KEYS']).optional(),
  deliveryContent: z.string().nullable().optional(),
  fileUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function productRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', requireAdmin);

  app.get('/products', async (req) => {
    const { categoryId } = req.query as { categoryId?: string };
    return shopPrisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { _count: { select: { keys: { where: { isUsed: false } } } } },
      orderBy: { sortOrder: 'asc' },
    });
  });

  app.get('/products/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const product = await shopPrisma.product.findUnique({ where: { id }, include: { keys: true } });
    if (!product) return reply.code(404).send({ code: 'NOT_FOUND', message: 'Product not found' });
    return product;
  });

  app.post('/products', async (req, reply) => {
    const body = productSchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });

    const count = await shopPrisma.product.count();
    if (count >= MAX_PRODUCTS) {
      return reply.code(422).send({ code: 'LIMIT_REACHED', message: `Product catalog is capped at ${MAX_PRODUCTS} entries.` });
    }

    return shopPrisma.product.create({ data: body.data });
  });

  app.put('/products/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = productSchema.partial().safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    return shopPrisma.product.update({ where: { id }, data: body.data });
  });

  app.delete('/products/:id', async (req) => {
    const { id } = req.params as { id: string };
    await shopPrisma.product.delete({ where: { id } });
    return { ok: true };
  });

  // Bulk-add keys/credentials to a KEYS-delivery product's stock pool.
  app.post('/products/:id/keys', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = z.object({ values: z.array(z.string().min(1)).min(1) }).safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });

    const result = await shopPrisma.productKey.createMany({
      data: body.data.values.map((value) => ({ productId: id, value })),
    });
    return { added: result.count };
  });

  app.delete('/products/:id/keys/:keyId', async (req) => {
    const { keyId } = req.params as { id: string; keyId: string };
    await shopPrisma.productKey.delete({ where: { id: keyId } });
    return { ok: true };
  });
}
