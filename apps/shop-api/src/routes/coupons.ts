import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { shopPrisma } from '@ronda/shop-db';
import { requireAdmin } from '../plugins/authenticate';

const couponSchema = z.object({
  code: z.string().min(3),
  kind: z.enum(['REGULAR', 'AFFILIATE']).optional(),
  type: z.enum(['PERCENT', 'FIXED']),
  value: z.number().positive(),
  ownerTelegramId: z.string().nullable().optional(),
  affiliateCommissionPercent: z.number().min(0).max(100).nullable().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  perUserLimit: z.number().int().positive().nullable().optional(),
  minOrderStars: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().optional(),
});

function toDate(value: string | null | undefined): Date | null | undefined {
  if (value == null) return value;
  return new Date(value);
}

export async function couponRoutes(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', requireAdmin);

  app.get('/coupons', async (req) => {
    const { kind } = req.query as { kind?: 'REGULAR' | 'AFFILIATE' };
    return shopPrisma.coupon.findMany({
      where: kind ? { kind } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { redemptions: true } } },
    });
  });

  app.post('/coupons', async (req, reply) => {
    const body = couponSchema.safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    if (body.data.kind === 'AFFILIATE' && (!body.data.ownerTelegramId || body.data.affiliateCommissionPercent == null)) {
      return reply.code(400).send({ code: 'BAD_REQUEST', message: 'Affiliate coupons require ownerTelegramId and affiliateCommissionPercent' });
    }
    return shopPrisma.coupon.create({ data: { ...body.data, expiresAt: toDate(body.data.expiresAt) } });
  });

  app.put('/coupons/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const body = couponSchema.partial().safeParse(req.body);
    if (!body.success) return reply.code(400).send({ code: 'BAD_REQUEST', message: body.error.message });
    return shopPrisma.coupon.update({ where: { id }, data: { ...body.data, expiresAt: toDate(body.data.expiresAt) } });
  });

  app.delete('/coupons/:id', async (req) => {
    const { id } = req.params as { id: string };
    await shopPrisma.coupon.delete({ where: { id } });
    return { ok: true };
  });

  app.get('/affiliates', async () => {
    const earnings = await shopPrisma.affiliateEarning.groupBy({
      by: ['affiliateTelegramId'],
      _sum: { amountStars: true },
      _count: { _all: true },
    });
    return earnings.map((e) => ({
      affiliateTelegramId: e.affiliateTelegramId,
      totalEarnedStars: e._sum.amountStars ?? 0,
      orderCount: e._count._all,
    }));
  });

  app.get('/affiliates/:telegramId/earnings', async (req) => {
    const { telegramId } = req.params as { telegramId: string };
    return shopPrisma.affiliateEarning.findMany({
      where: { affiliateTelegramId: telegramId },
      orderBy: { createdAt: 'desc' },
    });
  });
}
