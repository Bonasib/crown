import { Worker, Job } from 'bullmq';
import { prisma } from '@ronda/db';
import { connection } from '../queues';

export interface FxRateSyncJobData {
  baseCurrency?: string;
}

// Hardcoded fallback rates for development
const FALLBACK_RATES: Record<string, number> = {
  'USD_SAR': 3.75,
  'USD_AED': 3.67,
  'USD_EGP': 30.9,
  'USD_CNY': 7.24,
  'USD_EUR': 0.92,
  'USD_GBP': 0.79,
  'SAR_USD': 0.267,
  'AED_USD': 0.272,
};

async function processFxRateSyncJob(_job: Job<FxRateSyncJobData>): Promise<void> {
  console.log('[fx-rate-sync] Syncing FX rates...');

  // TODO: Integrate with a real FX provider (Fixer, ExchangeRatesAPI, etc.)
  const rates = Object.entries(FALLBACK_RATES).map(([pair, rate]) => {
    const [from, to] = pair.split('_');
    return { fromCurrency: from!, toCurrency: to!, rate, source: 'FALLBACK' };
  });

  await prisma.fxRate.createMany({ data: rates });
  console.log(`[fx-rate-sync] Stored ${rates.length} FX rates`);
}

export function createFxRateSyncWorker() {
  const worker = new Worker<FxRateSyncJobData>(
    'fx-rate-sync',
    processFxRateSyncJob,
    { connection, concurrency: 1 },
  );

  worker.on('failed', (job, err) => {
    console.error(`[fx-rate-sync] Job ${job?.id} failed:`, err);
  });

  return worker;
}
