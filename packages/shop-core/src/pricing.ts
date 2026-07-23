export const MAX_PRODUCTS = 200;
export const MAX_SMM_SERVICES = 200;

export interface StarsPriceInput {
  /** Cost basis in minor currency units (e.g. USD cents) */
  costMinor: number;
  /** Per-item profit percent override; falls back to the global setting when absent */
  profitPercent: number | null | undefined;
  globalProfitPercent: number;
  starsPerUsd: number;
}

/**
 * Telegram Stars (XTR) has no fixed real-world exchange rate — it's set by
 * Telegram/region and changes over time. `starsPerUsd` is an admin-configurable
 * approximation used only to translate a USD-denominated cost + margin into an
 * integer Stars price (Stars invoices must be whole numbers, minimum 1).
 */
export function computeStarsPrice({
  costMinor,
  profitPercent,
  globalProfitPercent,
  starsPerUsd,
}: StarsPriceInput): number {
  const pct = profitPercent ?? globalProfitPercent;
  const sellMinor = costMinor * (1 + pct / 100);
  const usd = sellMinor / 100;
  const stars = Math.ceil(usd * starsPerUsd);
  return Math.max(1, stars);
}

export function computeProfitMinor(costMinor: number, totalStars: number, starsPerUsd: number): number {
  const revenueMinor = Math.round((totalStars / starsPerUsd) * 100);
  return revenueMinor - costMinor;
}

export interface CouponLike {
  type: 'PERCENT' | 'FIXED';
  value: number;
  minOrderStars?: number | null;
  expiresAt?: Date | null;
  isActive: boolean;
  usageLimit?: number | null;
  usedCount: number;
}

export interface CouponValidationResult {
  ok: boolean;
  reason?: string;
  discountStars?: number;
}

export function validateAndPriceCoupon(coupon: CouponLike | null, subtotalStars: number): CouponValidationResult {
  if (!coupon) return { ok: false, reason: 'NOT_FOUND' };
  if (!coupon.isActive) return { ok: false, reason: 'INACTIVE' };
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) return { ok: false, reason: 'EXPIRED' };
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, reason: 'LIMIT_REACHED' };
  }
  if (coupon.minOrderStars != null && subtotalStars < coupon.minOrderStars) {
    return { ok: false, reason: 'MIN_ORDER_NOT_MET' };
  }

  const discount =
    coupon.type === 'PERCENT'
      ? Math.floor((subtotalStars * coupon.value) / 100)
      : Math.min(Math.round(coupon.value), subtotalStars);

  return { ok: true, discountStars: Math.max(0, Math.min(discount, subtotalStars - 1)) };
}
