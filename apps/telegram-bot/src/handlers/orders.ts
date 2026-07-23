import type { Bot } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { shopPrisma } from '@ronda/shop-db';
import { t } from '@ronda/shop-core';
import type { BotContext } from '../session';
import { fetchSmmOrderStatus } from '../services/smmOrder';

export async function showOrders(ctx: BotContext): Promise<void> {
  const lang = ctx.session.lang;
  if (!ctx.from) return;

  const orders = await shopPrisma.order.findMany({
    where: { telegramUserId: String(ctx.from.id) },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  if (orders.length === 0) {
    await ctx.editMessageText(t(lang, 'no_orders'), { reply_markup: new InlineKeyboard().text(t(lang, 'back'), 'back:menu') }).catch(() =>
      ctx.reply(t(lang, 'no_orders'))
    );
    return;
  }

  const kb = new InlineKeyboard();
  const lines = orders.map((o) => t(lang, 'order_line', { id: o.id.slice(-6), status: o.status, total: o.totalStars }));
  for (const o of orders) {
    if (o.type === 'SMM' && o.providerOrderId && (o.status === 'PROCESSING' || o.status === 'PAID')) {
      kb.text(`🔄 #${o.id.slice(-6)}`, `orderstatus:${o.id}`).row();
    }
  }
  kb.text(t(lang, 'back'), 'back:menu');

  await ctx.editMessageText(lines.join('\n'), { reply_markup: kb }).catch(() => ctx.reply(lines.join('\n'), { reply_markup: kb }));
}

export function registerOrders(bot: Bot<BotContext>): void {
  bot.command('myorders', async (ctx) => showOrders(ctx));

  bot.callbackQuery(/^orderstatus:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const lang = ctx.session.lang;
    const order = await shopPrisma.order.findUnique({ where: { id: ctx.match[1] } });
    if (!order?.smmServiceId || !order.providerOrderId) return;
    const service = await shopPrisma.smmService.findUnique({ where: { id: order.smmServiceId } });
    if (!service) return;
    try {
      const status = await fetchSmmOrderStatus(service.providerId, order.providerOrderId);
      await ctx.reply(t(lang, 'smm_order_status', { status }));
    } catch {
      await ctx.reply(t(lang, 'smm_order_status', { status: 'UNKNOWN' }));
    }
  });
}
