import { computeStarsPrice } from '@ronda/shop-core';
import { getGlobalProfitPercent, getStarsPerUsd } from '../settings';

export async function priceProductStars(costMinor: number, profitPercent: number | null): Promise<number> {
  const [globalProfitPercent, starsPerUsd] = await Promise.all([getGlobalProfitPercent(), getStarsPerUsd()]);
  return computeStarsPrice({ costMinor, profitPercent, globalProfitPercent, starsPerUsd });
}

export async function priceSmmStars(costPer1000Minor: number, profitPercent: number | null, quantity: number): Promise<number> {
  const costMinor = (costPer1000Minor * quantity) / 1000;
  return priceProductStars(costMinor, profitPercent);
}
