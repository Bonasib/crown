import type { Bot } from 'grammy';
import { t } from '@ronda/shop-core';
import { shopPrisma } from '@ronda/shop-db';
import type { BotContext } from '../session';
import { mainMenuKeyboard, languageKeyboard } from '../keyboards/menu';
import { showCategories as showProductCategories } from './products';
import { showSmmCategories } from './smm';
import { showOrders } from './orders';
import { getSupportUsername } from '../settings';

export function registerMenu(bot: Bot<BotContext>): void {
  bot.callbackQuery('menu:products', async (ctx) => {
    await ctx.answerCallbackQuery();
    await showProductCategories(ctx);
  });

  bot.callbackQuery('menu:smm', async (ctx) => {
    await ctx.answerCallbackQuery();
    await showSmmCategories(ctx);
  });

  bot.callbackQuery('menu:orders', async (ctx) => {
    await ctx.answerCallbackQuery();
    await showOrders(ctx);
  });

  bot.callbackQuery('menu:language', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(t(ctx.session.lang, 'choose_language'), { reply_markup: languageKeyboard() });
  });

  bot.callbackQuery('menu:help', async (ctx) => {
    await ctx.answerCallbackQuery();
    const support = await getSupportUsername();
    await ctx.editMessageText(t(ctx.session.lang, 'help_text', { support }), {
      reply_markup: mainMenuKeyboard(ctx.session.lang),
    });
  });

  bot.callbackQuery('back:menu', async (ctx) => {
    await ctx.answerCallbackQuery();
    ctx.session.draft = undefined;
    await ctx.editMessageText(t(ctx.session.lang, 'welcome'), { reply_markup: mainMenuKeyboard(ctx.session.lang) });
  });

  bot.callbackQuery('lang:ar', async (ctx) => setLanguage(ctx, 'ar'));
  bot.callbackQuery('lang:en', async (ctx) => setLanguage(ctx, 'en'));
}

async function setLanguage(ctx: BotContext, lang: 'ar' | 'en'): Promise<void> {
  await ctx.answerCallbackQuery();
  if (ctx.from) {
    await shopPrisma.shopUser.update({ where: { telegramId: String(ctx.from.id) }, data: { languageCode: lang } });
  }
  ctx.session.lang = lang;
  await ctx.editMessageText(t(lang, 'language_set'), { reply_markup: mainMenuKeyboard(lang) });
}
