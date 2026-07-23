import type { Bot } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { shopPrisma } from '@ronda/shop-db';
import { t, localized } from '@ronda/shop-core';
import type { BotContext } from '../session';
import { priceSmmStars } from '../services/pricing';

export async function showSmmCategories(ctx: BotContext): Promise<void> {
  const lang = ctx.session.lang;
  const categories = await shopPrisma.smmCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  if (categories.length === 0) {
    await showServiceList(ctx, undefined);
    return;
  }

  const kb = new InlineKeyboard();
  for (const cat of categories) {
    kb.text(localized(lang, cat.nameAr, cat.nameEn), `scat:${cat.id}`).row();
  }
  kb.text(t(lang, 'back'), 'back:menu');

  await ctx.editMessageText(t(lang, 'menu_smm'), { reply_markup: kb }).catch(() =>
    ctx.reply(t(lang, 'menu_smm'), { reply_markup: kb })
  );
}

async function showServiceList(ctx: BotContext, categoryId: string | undefined): Promise<void> {
  const lang = ctx.session.lang;
  const services = await shopPrisma.smmService.findMany({
    where: { isActive: true, ...(categoryId ? { categoryId } : {}) },
    orderBy: { sortOrder: 'asc' },
    take: 200,
  });

  if (services.length === 0) {
    await ctx.editMessageText(t(lang, 'no_services'), { reply_markup: new InlineKeyboard().text(t(lang, 'back'), 'menu:smm') }).catch(() =>
      ctx.reply(t(lang, 'no_services'))
    );
    return;
  }

  const kb = new InlineKeyboard();
  for (const s of services) {
    kb.text(`${localized(lang, s.nameAr, s.nameEn)} (${s.platform})`, `svc:${s.id}`).row();
  }
  kb.text(t(lang, 'back'), 'menu:smm');

  await ctx.editMessageText(t(lang, 'menu_smm'), { reply_markup: kb }).catch(() =>
    ctx.reply(t(lang, 'menu_smm'), { reply_markup: kb })
  );
}

export function registerSmm(bot: Bot<BotContext>): void {
  bot.callbackQuery(/^scat:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await showServiceList(ctx, ctx.match[1]);
  });

  bot.callbackQuery(/^svc:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = ctx.session.lang;
    const service = await shopPrisma.smmService.findUnique({ where: { id: ctx.match[1] } });
    if (!service || !service.isActive) {
      await ctx.reply(t(lang, 'out_of_stock'));
      return;
    }
    const samplePrice = await priceSmmStars(service.costPer1000Minor, service.profitPercent, 1000);
    const name = localized(lang, service.nameAr, service.nameEn);
    const kb = new InlineKeyboard().text(t(lang, 'buy_button'), `svcbuy:${service.id}`).row().text(t(lang, 'back'), 'menu:smm');

    await ctx.editMessageText(
      `*${name}*\n${service.platform} / ${service.type}\n\n${t(lang, 'product_price', { price: samplePrice })} / 1000\nMin: ${service.minQuantity} · Max: ${service.maxQuantity}`,
      { reply_markup: kb, parse_mode: 'Markdown' }
    ).catch(() => ctx.reply(name, { reply_markup: kb }));
  });

  bot.callbackQuery(/^svcbuy:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = ctx.session.lang;
    const service = await shopPrisma.smmService.findUnique({ where: { id: ctx.match[1] } });
    if (!service || !service.isActive) {
      await ctx.reply(t(lang, 'out_of_stock'));
      return;
    }
    ctx.session.draft = { kind: 'SMM', smmServiceId: service.id, awaiting: 'smm_link' };
    await ctx.reply(t(lang, 'smm_ask_link'));
  });
}
