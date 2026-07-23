import type { Bot } from 'grammy';
import { t } from '@ronda/shop-core';
import type { BotContext } from '../session';
import { mainMenuKeyboard } from '../keyboards/menu';
import { getSupportUsername } from '../settings';

export function registerStart(bot: Bot<BotContext>): void {
  bot.command('start', async (ctx) => {
    ctx.session.draft = undefined;
    await ctx.reply(t(ctx.session.lang, 'welcome'), { reply_markup: mainMenuKeyboard(ctx.session.lang) });
  });

  bot.command('help', async (ctx) => {
    const support = await getSupportUsername();
    await ctx.reply(t(ctx.session.lang, 'help_text', { support }));
  });
}
