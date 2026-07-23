import type { Bot } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { shopPrisma } from '@ronda/shop-db';
import { t } from '@ronda/shop-core';
import type { BotContext } from '../session';
import { finalizeAndInvoice } from './checkout';

export function registerTextRouter(bot: Bot<BotContext>): void {
  bot.callbackQuery('coupon:skip', async (ctx) => {
    await ctx.answerCallbackQuery();
    if (ctx.session.draft) ctx.session.draft.couponCode = undefined;
    await finalizeAndInvoice(ctx);
  });

  bot.on('message:text', async (ctx, next) => {
    const draft = ctx.session.draft;
    if (!draft?.awaiting) return next();
    const lang = ctx.session.lang;
    const text = ctx.message.text.trim();

    if (draft.awaiting === 'coupon') {
      const coupon = await shopPrisma.coupon.findUnique({ where: { code: text } });
      if (!coupon || !coupon.isActive) {
        await ctx.reply(t(lang, 'coupon_invalid'), { reply_markup: new InlineKeyboard().text(t(lang, 'skip'), 'coupon:skip') });
        return;
      }
      draft.couponCode = coupon.code;
      await finalizeAndInvoice(ctx);
      return;
    }

    if (draft.awaiting === 'smm_link') {
      draft.smmLink = text;
      draft.awaiting = 'smm_quantity';
      const service = await shopPrisma.smmService.findUnique({ where: { id: draft.smmServiceId } });
      await ctx.reply(t(lang, 'smm_ask_quantity', { min: service?.minQuantity ?? 100, max: service?.maxQuantity ?? 10000 }));
      return;
    }

    if (draft.awaiting === 'smm_quantity') {
      const service = await shopPrisma.smmService.findUnique({ where: { id: draft.smmServiceId } });
      const quantity = parseInt(text, 10);
      const min = service?.minQuantity ?? 100;
      const max = service?.maxQuantity ?? 10000;
      if (!Number.isFinite(quantity) || quantity < min || quantity > max) {
        await ctx.reply(t(lang, 'smm_invalid_quantity', { min, max }));
        return;
      }
      draft.quantity = quantity;
      draft.awaiting = 'coupon';
      await ctx.reply(t(lang, 'enter_coupon'), { reply_markup: new InlineKeyboard().text(t(lang, 'skip'), 'coupon:skip') });
      return;
    }

    return next();
  });
}
