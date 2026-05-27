import type { AccountingCategory, Money } from '@ronda/types';

export interface LedgerLine {
  accountCode: string;
  accountName: string;
  debit?: number;
  credit?: number;
  currency: string;
  description: string;
}

export interface JournalEntry {
  description: string;
  lines: LedgerLine[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
}

export interface ProfitLossSummary {
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMarginPct: number;
  opex: number;
  operatingProfit: number;
  operatingMarginPct: number;
  dutyVat: number;
  netProfit: number;
  netMarginPct: number;
  currency: string;
}

export interface LineItemInput {
  description: string;
  accountingCategory: AccountingCategory;
  amountMinor: number;
  currency: string;
}

export function buildInvoiceJournalEntry(
  invoiceNumber: string,
  lineItems: LineItemInput[],
  currency: string,
): JournalEntry {
  const totalRevenue = lineItems.reduce((s, i) => s + i.amountMinor, 0);

  const lines: LedgerLine[] = [
    // Debit: Accounts Receivable
    {
      accountCode: '1200',
      accountName: 'Accounts Receivable',
      debit: totalRevenue,
      currency,
      description: `Invoice ${invoiceNumber} - A/R`,
    },
    // Credit: Freight Revenue
    {
      accountCode: '4000',
      accountName: 'Freight Revenue',
      credit: totalRevenue,
      currency,
      description: `Invoice ${invoiceNumber} - Revenue`,
    },
  ];

  return {
    description: `Invoice ${invoiceNumber} issued`,
    lines,
    totalDebits: totalRevenue,
    totalCredits: totalRevenue,
    isBalanced: true,
  };
}

export function buildCostJournalEntry(
  reference: string,
  lineItems: LineItemInput[],
  currency: string,
): JournalEntry {
  const totalCost = lineItems.reduce((s, i) => s + i.amountMinor, 0);

  const lines: LedgerLine[] = [
    {
      accountCode: '5000',
      accountName: 'Freight Cost (COGS)',
      debit: totalCost,
      currency,
      description: `${reference} - Cost`,
    },
    {
      accountCode: '2000',
      accountName: 'Accounts Payable',
      credit: totalCost,
      currency,
      description: `${reference} - A/P`,
    },
  ];

  return {
    description: `Cost entry for ${reference}`,
    lines,
    totalDebits: totalCost,
    totalCredits: totalCost,
    isBalanced: true,
  };
}

export function calculateProfitLoss(
  revenueMinor: number,
  lineItems: LineItemInput[],
  currency: string,
): ProfitLossSummary {
  const cogsMinor = lineItems
    .filter((i) => i.accountingCategory === 'COGS')
    .reduce((s, i) => s + i.amountMinor, 0);

  const opexMinor = lineItems
    .filter((i) => i.accountingCategory === 'OPEX')
    .reduce((s, i) => s + i.amountMinor, 0);

  const dutyVatMinor = lineItems
    .filter((i) => i.accountingCategory === 'DUTY_VAT')
    .reduce((s, i) => s + i.amountMinor, 0);

  const grossProfit = revenueMinor - cogsMinor;
  const operatingProfit = grossProfit - opexMinor;
  const netProfit = operatingProfit - dutyVatMinor;

  return {
    revenue: revenueMinor,
    cogs: cogsMinor,
    grossProfit,
    grossMarginPct: revenueMinor > 0 ? (grossProfit / revenueMinor) * 100 : 0,
    opex: opexMinor,
    operatingProfit,
    operatingMarginPct: revenueMinor > 0 ? (operatingProfit / revenueMinor) * 100 : 0,
    dutyVat: dutyVatMinor,
    netProfit,
    netMarginPct: revenueMinor > 0 ? (netProfit / revenueMinor) * 100 : 0,
    currency,
  };
}

export function formatMinorUnits(amountMinor: number, currency = 'USD'): string {
  const amount = amountMinor / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
