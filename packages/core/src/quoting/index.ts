import type {
  FreightMode,
  GoodsType,
  ContainerType,
  QuoteBreakdown,
  QuoteLineItem,
  Money,
  AccountingCategory,
  CargoItemInput,
} from '@ronda/types';

export interface QuoteInput {
  mode: FreightMode;
  originPortCode: string;
  destPortCode: string;
  goodsType: GoodsType;
  cargoItems: CargoItemInput[];
  currency: string;
  /** Base freight rate in minor units (cents) */
  baseRateMinor: number;
  /** Override surcharges */
  surcharges?: Array<{
    description: string;
    accountingCategory: AccountingCategory;
    amountMinor: number;
    currency: string;
  }>;
}

const CONTAINER_SPECS: Record<ContainerType, { internalCbm: number; maxPayloadKg: number; surchargePct: number }> = {
  '20FT': { internalCbm: 25.4, maxPayloadKg: 21700, surchargePct: 0 },
  '40FT': { internalCbm: 54.0, maxPayloadKg: 26400, surchargePct: 0 },
  '40FT_HC': { internalCbm: 67.5, maxPayloadKg: 26300, surchargePct: 5 },
  REEFER_40FT: { internalCbm: 59.8, maxPayloadKg: 27700, surchargePct: 80 },
  FLAT_RACK_40FT: { internalCbm: 60.0, maxPayloadKg: 40000, surchargePct: 40 },
  OPEN_TOP_20FT: { internalCbm: 24.8, maxPayloadKg: 20000, surchargePct: 20 },
};

const INSURANCE_RATE = 0.0015; // 0.15% of cargo value
const INSPECTION_FEE_MINOR = 25000; // $250
const RONDA_MARGIN_PCT = 0.08; // 8%

function makeMoney(amountMinor: number, currency: string): Money {
  return { amount: amountMinor, currency };
}

function makeLineItem(
  id: string,
  description: string,
  accountingCategory: AccountingCategory,
  amountMinor: number,
  currency: string,
  rate?: number,
  baseMinor?: number,
): QuoteLineItem {
  return {
    id,
    description,
    accountingCategory,
    amount: makeMoney(amountMinor, currency),
    rate,
    base: baseMinor !== undefined ? makeMoney(baseMinor, currency) : undefined,
  };
}

export function calculateQuote(input: QuoteInput): QuoteBreakdown {
  const { mode, goodsType, cargoItems, currency, baseRateMinor } = input;

  // Total cargo value
  const totalCargoValueMinor = cargoItems.reduce(
    (sum, item) => sum + item.value.amount * item.qty,
    0,
  );

  // Base freight
  const baseFreight = makeLineItem('base_freight', 'Base Ocean Freight', 'COGS', baseRateMinor, currency);

  // Origin charges (THC + documentation)
  const thcMinor = mode === 'FCL' ? 18000 : 12000;
  const docFeeMinor = 5000;
  const originCharges: QuoteLineItem[] = [
    makeLineItem('thc_origin', 'Origin Terminal Handling (THC)', 'COGS', thcMinor, currency),
    makeLineItem('doc_fee', 'Bill of Lading / Documentation Fee', 'COGS', docFeeMinor, currency),
  ];

  // Destination handling
  const destHandlingMinor = mode === 'FCL' ? 15000 : 10000;
  const destinationHandling = makeLineItem(
    'dest_thc',
    'Destination THC & Port Handling',
    'COGS',
    destHandlingMinor,
    currency,
  );

  // Cargo insurance
  const insuranceMinor = Math.round(totalCargoValueMinor * INSURANCE_RATE);
  const cargoInsurance = makeLineItem(
    'insurance',
    'Cargo Insurance',
    'OPEX',
    insuranceMinor,
    currency,
    INSURANCE_RATE * 100,
    totalCargoValueMinor,
  );

  // Inspection fee
  const inspectionFee = makeLineItem(
    'inspection',
    'Pre-shipment Inspection',
    'OPEX',
    INSPECTION_FEE_MINOR,
    currency,
  );

  // Surcharges (BAF, PSS, etc.)
  const defaultSurcharges: QuoteLineItem[] = input.surcharges
    ? input.surcharges.map((s, i) =>
        makeLineItem(`surcharge_${i}`, s.description, s.accountingCategory, s.amountMinor, s.currency),
      )
    : [makeLineItem('baf', 'Bunker Adjustment Factor (BAF)', 'COGS', 25000, currency)];

  // Duties & VAT (estimated - not included in total by default, shown separately)
  const dutiesVat: QuoteLineItem[] = [];
  if (goodsType === 'ELECTRONICS') {
    const dutyMinor = Math.round(totalCargoValueMinor * 0.05);
    dutiesVat.push(makeLineItem('duty', 'Import Duty (5%)', 'DUTY_VAT', dutyMinor, currency, 5, totalCargoValueMinor));
  }

  // Subtotal before margin
  const subtotalMinor =
    baseRateMinor +
    originCharges.reduce((s, i) => s + i.amount.amount, 0) +
    destHandlingMinor +
    insuranceMinor +
    INSPECTION_FEE_MINOR +
    defaultSurcharges.reduce((s, i) => s + i.amount.amount, 0);

  // Ronda service fee (margin)
  const serviceFeesMinor = Math.round(subtotalMinor * RONDA_MARGIN_PCT);
  const marginItem = makeLineItem(
    'ronda_fee',
    'Ronda Service Fee',
    'MARGIN',
    serviceFeesMinor,
    currency,
    RONDA_MARGIN_PCT * 100,
    subtotalMinor,
  );

  const totalMinor = subtotalMinor + serviceFeesMinor;

  // Accounting breakdowns
  const allLineItems = [
    baseFreight,
    ...originCharges,
    destinationHandling,
    cargoInsurance,
    inspectionFee,
    ...defaultSurcharges,
    marginItem,
  ];

  const totalCogs = allLineItems
    .filter((i) => i.accountingCategory === 'COGS')
    .reduce((s, i) => s + i.amount.amount, 0);

  const totalOpex = allLineItems
    .filter((i) => i.accountingCategory === 'OPEX')
    .reduce((s, i) => s + i.amount.amount, 0);

  const totalDutyVat = dutiesVat.reduce((s, i) => s + i.amount.amount, 0);

  return {
    baseFreight,
    originCharges,
    destinationHandling: destinationHandling,
    cargoInsurance,
    inspectionFee,
    surcharges: defaultSurcharges,
    dutiesVat,
    total: makeMoney(totalMinor, currency),
    totalCogs: makeMoney(totalCogs, currency),
    totalOpex: makeMoney(totalOpex, currency),
    totalDutyVat: makeMoney(totalDutyVat, currency),
    currency,
  };
}

export function formatMoney(money: Money): string {
  const amount = money.amount / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
