import type { Bot } from 'grammy';
import { shopPrisma } from '@ronda/shop-db';
import { t } from '@ronda/shop-core';
import type { BotContext } from '../session';
import { deliverProduct } from '../services/delivery';
import { placeSmmOrder } from '../services/smmOrder';
import { recordAffiliateEarning } from '../services/affiliate';

export function registerPayments(bot: Bot<BotContext>): void {
  bot.on('pre_checkout_query', async (ctx) => {
    const payload = ctx.preCheckoutQuery.invoice_payload;
    const order = await shopPrisma.order.findUnique({ where: { id: payload } });

    if (!order || order.status !== 'PENDING_PAYMENT' || order.totalStars !== ctx.preCheckoutQuery.total_amount) {
      await ctx.answerPreCheckoutQuery(false, 'This order is no longer available.');
      return;
    }
    await ctx.answerPreCheckoutQuery(true);
  });

  bot.on('message:successful_payment', async (ctx) => {
    const payment = ctx.message.successful_payment;
    const lang = ctx.session.lang;
    const order = await shopPrisma.order.findUnique({ where: { id: payment.invoice_payload } });
    if (!order) return;

    await ctx.reply(t(lang, 'payment_processing'));

    const paidOrder = await shopPrisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID', telegramPaymentChargeId: payment.telegram_payment_charge_id, paidAt: new Date() },
    });

    await ctx.reply(t(lang, 'payment_confirmed'));

    if (paidOrder.couponId) {
      const coupon = await shopPrisma.coupon.findUnique({ where: { id: paidOrder.couponId } });
      if (coupon) {
        await shopPrisma.$transaction([
          shopPrisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } }),
          shopPrisma.couponRedemption.create({
            data: {
              couponId: coupon.id,
              telegramUserId: order.telegramUserId,
              orderId: order.id,
              discountStars: order.discountStars,
            },
          }),
        ]);
        await recordAffiliateEarning(bot, coupon, paidOrder);
      }
    }

    await ctx.reply(t(lang, 'order_preparing'));

    try {
      if (paidOrder.type === 'PRODUCT' && paidOrder.productId) {
        const product = await shopPrisma.product.findUnique({ where: { id: paidOrder.productId } });
        if (!product) throw new Error('Product not found');
        const delivery = await deliverProduct(ctx, product, paidOrder);
        if (!delivery) throw new Error('No stock available to deliver');
        await shopPrisma.order.update({
          where: { id: paidOrder.id },
          data: {
            status: 'DELIVERED',
            deliveredAt: new Date(),
            deliveredContent: delivery.content,
            deliveredFileUrl: delivery.fileUrl,
          },
        });
      } else if (paidOrder.type === 'SMM' && paidOrder.smmServiceId && paidOrder.smmLink) {
        const service = await shopPrisma.smmService.findUnique({ where: { id: paidOrder.smmServiceId } });
        if (!service) throw new Error('SMM service not found');
        const providerOrderId = await placeSmmOrder(service, paidOrder.smmLink, paidOrder.quantity);
        await shopPrisma.order.update({
          where: { id: paidOrder.id },
          data: { status: 'PROCESSING', providerOrderId },
        });
        await ctx.reply(t(lang, 'smm_order_placed', { providerOrderId }));
      }
    } catch (err) {
      await shopPrisma.order.update({
        where: { id: paidOrder.id },
        data: { status: 'FAILED', failureReason: err instanceof Error ? err.message : String(err) },
      });
      await ctx.reply(t(lang, 'order_failed'));
    }
  });
}
