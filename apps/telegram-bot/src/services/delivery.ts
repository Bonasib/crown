import { InputFile } from 'grammy';
import { shopPrisma, type Order, type Product } from '@ronda/shop-db';
import type { BotContext } from '../session';
import { t } from '@ronda/shop-core';

export interface DeliveryResult {
  content: string;
  fileUrl?: string;
}

/**
 * Atomically claims the next unused key for a KEYS-type product so concurrent
 * buyers never receive the same key twice.
 */
async function claimProductKey(productId: string, orderId: string): Promise<string | null> {
  const candidate = await shopPrisma.productKey.findFirst({
    where: { productId, isUsed: false },
    orderBy: { createdAt: 'asc' },
  });
  if (!candidate) return null;

  const claimed = await shopPrisma.productKey.updateMany({
    where: { id: candidate.id, isUsed: false },
    data: { isUsed: true, usedInOrderId: orderId, usedAt: new Date() },
  });
  if (claimed.count === 0) return claimProductKey(productId, orderId); // lost the race, try next
  return candidate.value;
}

export async function deliverProduct(ctx: BotContext, product: Product, order: Order): Promise<DeliveryResult | null> {
  const lang = ctx.session.lang;

  if (product.deliveryType === 'KEYS') {
    const key = await claimProductKey(product.id, order.id);
    if (!key) return null;
    await ctx.reply(`${t(lang, 'order_delivered_text')}\n\n${key}`);
    await ctx.replyWithDocument(new InputFile(Buffer.from(key, 'utf-8'), `order-${order.id}.txt`), {
      caption: t(lang, 'order_delivered_file_caption'),
    });
    return { content: key };
  }

  if (product.deliveryType === 'FILE' && product.fileUrl) {
    await ctx.reply(t(lang, 'order_delivered_text'));
    await ctx.replyWithDocument(product.fileUrl, { caption: t(lang, 'order_delivered_file_caption') });
    return { content: product.fileUrl, fileUrl: product.fileUrl };
  }

  const content = product.deliveryContent ?? '';
  await ctx.reply(`${t(lang, 'order_delivered_text')}\n\n${content}`);
  await ctx.replyWithDocument(new InputFile(Buffer.from(content, 'utf-8'), `order-${order.id}.txt`), {
    caption: t(lang, 'order_delivered_file_caption'),
  });
  return { content };
}
