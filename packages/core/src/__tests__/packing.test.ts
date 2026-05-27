import { calculateTotalCbm, calculateTotalWeight, recommendContainer } from '../packing';
import type { CargoItemInput } from '@ronda/types';

const sampleItems: CargoItemInput[] = [
  {
    id: 'item-1',
    lengthCm: 140,
    widthCm: 90,
    heightCm: 20,
    weightKg: 25,
    qty: 100,
    value: { amount: 30000, currency: 'USD' },
    goodsType: 'ELECTRONICS',
  },
  {
    id: 'item-2',
    lengthCm: 30,
    widthCm: 20,
    heightCm: 15,
    weightKg: 1.2,
    qty: 500,
    value: { amount: 4000, currency: 'USD' },
    goodsType: 'ELECTRONICS',
  },
];

describe('calculateTotalCbm', () => {
  it('calculates volume correctly', () => {
    const cbm = calculateTotalCbm(sampleItems);
    // item-1: 1.4 * 0.9 * 0.2 * 100 = 25.2
    // item-2: 0.3 * 0.2 * 0.15 * 500 = 4.5
    // total: 29.7
    expect(cbm).toBeCloseTo(29.7, 1);
  });
});

describe('calculateTotalWeight', () => {
  it('calculates weight correctly', () => {
    const weight = calculateTotalWeight(sampleItems);
    // item-1: 25 * 100 = 2500
    // item-2: 1.2 * 500 = 600
    // total: 3100
    expect(weight).toBe(3100);
  });
});

describe('recommendContainer', () => {
  it('recommends containers for the cargo', () => {
    const recommendations = recommendContainer(sampleItems);
    expect(recommendations.length).toBeGreaterThan(0);
    // Total CBM ~29.7, should recommend a 40FT
    const recommended = recommendations.filter((r) => r.recommended);
    expect(recommended.length).toBeGreaterThan(0);
  });

  it('recommends LCL for small cargo', () => {
    const smallItems: CargoItemInput[] = [
      {
        id: 'small-1',
        lengthCm: 50,
        widthCm: 40,
        heightCm: 30,
        weightKg: 5,
        qty: 10,
        value: { amount: 10000, currency: 'USD' },
        goodsType: 'GENERAL',
      },
    ];
    const recommendations = recommendContainer(smallItems);
    const lclRec = recommendations.find((r) => r.type === 'LCL');
    expect(lclRec?.recommended).toBe(true);
  });
});
