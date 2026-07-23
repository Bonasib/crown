import type { Bot } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { shopPrisma } from '@ronda/shop-db';
import { t, localized } from '@ronda/shop-core';
import type { BotContext } from '../session';
import { priceProductStars } from '../services/pricing';

export async function showCategories(ctx: BotContext): Promise<void> {
  const lang = ctx.session.lang;
  const categories = await shopPrisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  if (categories.length === 0) {
    await showProductList(ctx, undefined);
    return;
  }

  const kb = new InlineKeyboard();
  for (const cat of categories) {
    kb.text(localized(lang, cat.nameAr, cat.nameEn), `pcat:${cat.id}`).row();
  }
  kb.text(t(lang, 'back'), 'back:menu');

  await ctx.editMessageText(t(lang, 'menu_products'), { reply_markup: kb }).catch(() =>
    ctx.reply(t(lang, 'menu_products'), { reply_markup: kb })
  );
}

async function showProductList(ctx: BotContext, categoryId: string | undefined): Promise<void> {
  const lang = ctx.session.lang;
  const products = await shopPrisma.product.findMany({
    where: { isActive: true, ...(categoryId ? { categoryId } : {}) },
    orderBy: { sortOrder: 'asc' },
    take: 200,
  });

  const kb = new InlineKeyboard();
  if (products.length === 0) {
    await ctx.editMessageText(t(lang, 'no_products'), { reply_markup: new InlineKeyboard().text(t(lang, 'back'), 'menu:products') }).catch(() =>
      ctx.reply(t(lang, 'no_products'))
    );
    return;
  }

  for (const p of products) {
    kb.text(localized(lang, p.nameAr, p.nameEn), `prod:${p.id}`).row();
  }
  kb.text(t(lang, 'back'), 'menu:products');

  await ctx.editMessageText(t(lang, 'menu_products'), { reply_markup: kb }).catch(() =>
    ctx.reply(t(lang, 'menu_products'), { reply_markup: kb })
  );
}

export function registerProducts(bot: Bot<BotContext>): void {
  bot.callbackQuery(/^pcat:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    await showProductList(ctx, ctx.match[1]);
  });

  bot.callbackQuery(/^prod:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = ctx.session.lang;
    const product = await shopPrisma.product.findUnique({ where: { id: ctx.match[1] } });
    if (!product || !product.isActive) {
      await ctx.reply(t(lang, 'out_of_stock'));
      return;
    }
    const price = await priceProductStars(product.costMinor, product.profitPercent);
    const name = localized(lang, product.nameAr, product.nameEn);
    const desc = localized(lang, product.descriptionAr ?? '', product.descriptionEn ?? '');

    const kb = new InlineKeyboard().text(t(lang, 'buy_button'), `buy:${product.id}`).row().text(t(lang, 'back'), 'menu:products');
    await ctx.editMessageText(`*${name}*\n${desc}\n\n${t(lang, 'product_price', { price })}`, {
      reply_markup: kb,
      parse_mode: 'Markdown',
    }).catch(() =>
      ctx.reply(`${name}\n${desc}\n\n${t(lang, 'product_price', { price })}`, { reply_markup: kb })
    );
  });

  bot.callbackQuery(/^buy:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = ctx.session.lang;
    ctx.session.draft = { kind: 'PRODUCT', productId: ctx.match[1], awaiting: 'coupon' };
    const kb = new InlineKeyboard().text(t(lang, 'skip'), 'coupon:skip');
    await ctx.reply(t(lang, 'enter_coupon'), { reply_markup: kb });
  });
}
