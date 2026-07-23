import { shopPrisma } from '@ronda/shop-db';
import { validateAndPriceCoupon, t, localized } from '@ronda/shop-core';
import type { BotContext } from '../session';
import { priceProductStars, priceSmmStars } from '../services/pricing';

/**
 * Reads the in-progress purchase from `ctx.session.draft`, prices it (product
 * or SMM service, with any coupon applied), persists a PENDING_PAYMENT Order,
 * and sends the Telegram Stars (XTR) invoice.
 */
export async function finalizeAndInvoice(ctx: BotContext): Promise<void> {
  const draft = ctx.session.draft;
  if (!draft || !ctx.from) return;
  const lang = ctx.session.lang;
  const telegramUserId = String(ctx.from.id);

  let title: string;
  let description: string;
  let subtotalStars: number;
  let costMinor: number;
  let productId: string | undefined;
  let smmServiceId: string | undefined;
  const quantity = draft.quantity ?? 1;

  if (draft.kind === 'PRODUCT' && draft.productId) {
    const product = await shopPrisma.product.findUnique({ where: { id: draft.productId } });
    if (!product || !product.isActive) {
      await ctx.reply(t(lang, 'out_of_stock'));
      ctx.session.draft = undefined;
      return;
    }
    if (product.deliveryType === 'KEYS') {
      const available = await shopPrisma.productKey.count({ where: { productId: product.id, isUsed: false } });
      if (available < 1) {
        await ctx.reply(t(lang, 'out_of_stock'));
        ctx.session.draft = undefined;
        return;
      }
    }
    subtotalStars = await priceProductStars(product.costMinor, product.profitPercent);
    title = localized(lang, product.nameAr, product.nameEn);
    description = localized(lang, product.descriptionAr ?? title, product.descriptionEn ?? title);
    costMinor = product.costMinor;
    productId = product.id;
  } else if (draft.kind === 'SMM' && draft.smmServiceId) {
    const service = await shopPrisma.smmService.findUnique({ where: { id: draft.smmServiceId } });
    if (!service || !service.isActive) {
      await ctx.reply(t(lang, 'out_of_stock'));
      ctx.session.draft = undefined;
      return;
    }
    subtotalStars = await priceSmmStars(service.costPer1000Minor, service.profitPercent, quantity);
    costMinor = Math.round((service.costPer1000Minor * quantity) / 1000);
    title = `${localized(lang, service.nameAr, service.nameEn)} x${quantity}`;
    description = title;
    smmServiceId = service.id;
  } else {
    ctx.session.draft = undefined;
    return;
  }

  let discountStars = 0;
  let couponId: string | undefined;
  if (draft.couponCode) {
    const coupon = await shopPrisma.coupon.findUnique({ where: { code: draft.couponCode } });
    const result = validateAndPriceCoupon(coupon, subtotalStars);
    if (result.ok) {
      discountStars = result.discountStars ?? 0;
      couponId = coupon?.id;
    }
  }
  const totalStars = Math.max(1, subtotalStars - discountStars);

  const order = await shopPrisma.order.create({
    data: {
      telegramUserId,
      type: draft.kind,
      productId,
      smmServiceId,
      smmLink: draft.smmLink,
      quantity,
      unitPriceStars: subtotalStars,
      subtotalStars,
      discountStars,
      totalStars,
      couponId,
      costMinor,
    },
  });

  ctx.session.draft = undefined;

  if (discountStars > 0) {
    await ctx.reply(t(lang, 'coupon_applied', { amount: discountStars }));
  }

  // Telegram Stars (XTR) invoices: currency "XTR", provider_token omitted,
  // amount is the whole-number Stars price (no decimal subdivision).
  await ctx.replyWithInvoice(title, description, order.id, 'XTR', [{ label: title, amount: totalStars }]);
  await ctx.reply(t(lang, 'confirm_invoice_sent'));
}
