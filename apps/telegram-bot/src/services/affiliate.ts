import type { Bot } from 'grammy';
import { shopPrisma, type Coupon, type Order } from '@ronda/shop-db';
import { t, type Lang } from '@ronda/shop-core';
import type { BotContext } from '../session';

export async function recordAffiliateEarning(bot: Bot<BotContext>, coupon: Coupon, order: Order): Promise<void> {
  if (coupon.kind !== 'AFFILIATE' || !coupon.ownerTelegramId || !coupon.affiliateCommissionPercent) return;

  const amountStars = Math.floor((order.totalStars * coupon.affiliateCommissionPercent) / 100);
  if (amountStars <= 0) return;

  await shopPrisma.affiliateEarning.create({
    data: {
      affiliateTelegramId: coupon.ownerTelegramId,
      orderId: order.id,
      couponId: coupon.id,
      amountStars,
    },
  });

  const affiliateUser = await shopPrisma.shopUser.findUnique({ where: { telegramId: coupon.ownerTelegramId } });
  const lang: Lang = affiliateUser?.languageCode ?? 'ar';
  try {
    await bot.api.sendMessage(
      coupon.ownerTelegramId,
      t(lang, 'affiliate_new_earning', { amount: amountStars, code: coupon.code })
    );
  } catch {
    // Affiliate may have blocked the bot or never started a chat; earning is still recorded.
  }
}
