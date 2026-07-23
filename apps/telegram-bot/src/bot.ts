import { Bot, session } from 'grammy';
import type { BotContext } from './session';
import { initialSession } from './session';
import { ensureUser } from './middleware/ensureUser';
import { registerStart } from './handlers/start';
import { registerMenu } from './handlers/menu';
import { registerProducts } from './handlers/products';
import { registerSmm } from './handlers/smm';
import { registerTextRouter } from './handlers/textRouter';
import { registerPayments } from './handlers/payments';
import { registerOrders } from './handlers/orders';

export function createBot(token: string): Bot<BotContext> {
  const bot = new Bot<BotContext>(token);

  bot.use(session({ initial: initialSession }));
  bot.use(ensureUser);

  registerStart(bot);
  registerMenu(bot);
  registerProducts(bot);
  registerSmm(bot);
  registerTextRouter(bot);
  registerPayments(bot);
  registerOrders(bot);

  bot.catch((err) => {
    console.error('Bot error:', err.error);
  });

  return bot;
}
