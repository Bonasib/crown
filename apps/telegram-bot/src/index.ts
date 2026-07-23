import { createBot } from './bot';

const token = process.env['TELEGRAM_BOT_TOKEN'];
if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not set.');
  process.exit(1);
}

const bot = createBot(token);

bot.start({
  onStart: (info) => {
    console.log(`\n🤖 Telegram shop bot running as @${info.username}\n`);
  },
});

process.on('SIGTERM', () => bot.stop());
process.on('SIGINT', () => bot.stop());
