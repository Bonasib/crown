import type { FastifyInstance } from 'fastify';
import { shopPrisma } from '@ronda/shop-db';
import { computeProfitMinor } from '@ronda/shop-core';
import { requireAdmin } from '../plugins/authenticate';

export async function statsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', requireAdmin);

  app.get('/stats/dashboard', async () => {
    const paidStatuses = ['PAID', 'PROCESSING', 'DELIVERED'] as const;

    const [byStatus, paidOrders, starsPerUsdSetting, productCount, smmCount, activeCouponCount] = await Promise.all([
      shopPrisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
      shopPrisma.order.findMany({ where: { status: { in: [...paidStatuses] } }, select: { totalStars: true, costMinor: true } }),
      shopPrisma.shopSetting.findUnique({ where: { key: 'stars_per_usd' } }),
      shopPrisma.product.count(),
      shopPrisma.smmService.count(),
      shopPrisma.coupon.count({ where: { isActive: true } }),
    ]);

    const starsPerUsd = Number(starsPerUsdSetting?.value) || 50;
    const revenueStars = paidOrders.reduce((sum, o) => sum + o.totalStars, 0);
    const profitMinor = paidOrders.reduce((sum, o) => sum + computeProfitMinor(o.costMinor, o.totalStars, starsPerUsd), 0);

    return {
      ordersByStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
      revenueStars,
      profitMinor,
      productCount,
      smmServiceCount: smmCount,
      activeCouponCount,
    };
  });
}
