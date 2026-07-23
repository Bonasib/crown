import type { Context, SessionFlavor } from 'grammy';
import type { Lang } from '@ronda/shop-core';

export type PendingOrderDraft = {
  kind: 'PRODUCT' | 'SMM';
  productId?: string;
  smmServiceId?: string;
  smmLink?: string;
  quantity?: number;
  couponCode?: string;
  discountStars?: number;
  awaiting?: 'coupon' | 'smm_link' | 'smm_quantity';
};

export interface SessionData {
  lang: Lang;
  draft?: PendingOrderDraft;
}

export type BotContext = Context & SessionFlavor<SessionData>;

export function initialSession(): SessionData {
  return { lang: 'ar' };
}
