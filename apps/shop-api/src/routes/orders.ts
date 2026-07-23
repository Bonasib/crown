import type { FastifyInstance } from 'fastify';
import { shopPrisma } from '@ronda/shop-db';
import { requireAdmin } from '../plugins/authenticate';

export async function orderRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', requireAdmin);

  app.get('/orders', async (req) => {
    const { status, page = '1', pageSize = '25' } = req.query as { status?: string; page?: string; pageSize?: string };
    const take = Math.min(100, parseInt(pageSize, 10) || 25);
    const skip = (Math.max(1, parseInt(page, 10) || 1) - 1) * take;

    const where = status ? { status: status as never } : undefined;
    const [items, total] = await Promise.all([
      shopPrisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: { product: true, smmService: true, coupon: true },
      }),
      shopPrisma.order.count({ where }),
    ]);

    return { items, total, page: Math.max(1, parseInt(page, 10) || 1), pageSize: take };
  });

  app.get('/orders/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const order = await shopPrisma.order.findUnique({
      where: { id },
      include: { product: true, smmService: true, coupon: true, couponRedemption: true, affiliateEarning: true },
    });
    if (!order) return reply.code(404).send({ code: 'NOT_FOUND', message: 'Order not found' });
    return order;
  });
}
