import type { NextFunction } from 'grammy';
import { shopPrisma } from '@ronda/shop-db';
import type { BotContext } from '../session';
import { getDefaultLanguage } from '../settings';

export async function ensureUser(ctx: BotContext, next: NextFunction): Promise<void> {
  const from = ctx.from;
  if (!from) return next();

  const telegramId = String(from.id);
  let user = await shopPrisma.shopUser.findUnique({ where: { telegramId } });

  if (!user) {
    let referredBy: string | undefined;
    const startPayload = ctx.message?.text?.match(/^\/start\s+(\S+)/)?.[1];
    if (startPayload) {
      const coupon = await shopPrisma.coupon.findUnique({ where: { code: startPayload } });
      if (coupon && coupon.kind === 'AFFILIATE' && coupon.ownerTelegramId !== telegramId) {
        referredBy = coupon.code;
      }
    }

    user = await shopPrisma.shopUser.create({
      data: {
        telegramId,
        username: from.username,
        firstName: from.first_name,
        languageCode: await getDefaultLanguage(),
        referredBy,
      },
    });
  }

  ctx.session.lang = user.languageCode;
  await next();
}
