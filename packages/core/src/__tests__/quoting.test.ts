/**
 * Unit tests for the quoting engine
 * Run with: pnpm --filter @ronda/core test
 */

import { calculateQuote } from '../quoting';

const sampleInput = {
  mode: 'FCL' as const,
  originPortCode: 'CNSHA',
  destPortCode: 'SAJED',
  goodsType: 'ELECTRONICS' as const,
  currency: 'USD',
  baseRateMinor: 180000,
  cargoItems: [
    {
      id: 'item-1',
      sku: 'TV-55',
      lengthCm: 140,
      widthCm: 90,
      heightCm: 20,
      weightKg: 25,
      qty: 100,
      value: { amount: 30000, currency: 'USD' }, // $300 each
      goodsType: 'ELECTRONICS' as const,
    },
  ],
};

describe('calculateQuote', () => {
  it('returns a valid breakdown', () => {
    const result = calculateQuote(sampleInput);

    expect(result.total.currency).toBe('USD');
    expect(result.total.amount).toBeGreaterThan(0);
    expect(result.baseFreight.amount.amount).toBe(180000);
    expect(result.originCharges.length).toBeGreaterThan(0);
  });

  it('calculates correct totals', () => {
    const result = calculateQuote(sampleInput);

    const sumOfAllItems =
      result.baseFreight.amount.amount +
      result.originCharges.reduce((s, i) => s + i.amount.amount, 0) +
      result.destinationHandling.amount.amount +
      result.cargoInsurance.amount.amount +
      result.inspectionFee.amount.amount +
      result.surcharges.reduce((s, i) => s + i.amount.amount, 0);

    // Total should be greater than sum (includes margin)
    expect(result.total.amount).toBeGreaterThan(sumOfAllItems);
  });

  it('includes insurance based on cargo value', () => {
    const result = calculateQuote(sampleInput);
    const cargoValue = 30000 * 100; // $30,000 in minor units
    const expectedInsurance = Math.round(cargoValue * 0.0015);
    expect(result.cargoInsurance.amount.amount).toBe(expectedInsurance);
  });

  it('includes COGS, OPEX, and MARGIN categories', () => {
    const result = calculateQuote(sampleInput);

    expect(result.totalCogs.amount).toBeGreaterThan(0);
    expect(result.totalOpex.amount).toBeGreaterThan(0);

    // baseFreight is COGS
    expect(result.baseFreight.accountingCategory).toBe('COGS');

    // insurance is OPEX
    expect(result.cargoInsurance.accountingCategory).toBe('OPEX');
  });

  it('handles LCL mode', () => {
    const lclInput = { ...sampleInput, mode: 'LCL' as const };
    const result = calculateQuote(lclInput);
    expect(result.total.amount).toBeGreaterThan(0);
  });
});
