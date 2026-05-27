import { queues } from './queues';
import { createEmailWorker } from './workers/email-notifications';
import { createVesselTrackerWorker } from './workers/vessel-tracker';
import { createFxRateSyncWorker } from './workers/fx-rate-sync';

async function main() {
  console.log('\n⚙️  Ronda Ship Worker starting...\n');

  // Start workers
  const workers = [
    createEmailWorker(),
    createVesselTrackerWorker(),
    createFxRateSyncWorker(),
  ];

  console.log(`✅ Started ${workers.length} workers`);

  // Schedule recurring jobs
  await queues.fxRateSync.add(
    'sync-fx-rates',
    {},
    {
      repeat: { pattern: '0 * * * *' }, // Every hour
      removeOnComplete: 10,
      removeOnFail: 5,
    },
  );
  console.log('  Scheduled: fx-rate-sync (hourly)');

  await queues.invoiceReminder.add(
    'check-overdue-invoices',
    {},
    {
      repeat: { pattern: '0 9 * * *' }, // Daily at 9am
      removeOnComplete: 5,
      removeOnFail: 5,
    },
  );
  console.log('  Scheduled: invoice-reminder (daily 9am)');

  console.log('\n🚀 Worker process ready. Waiting for jobs...\n');

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('\nShutting down workers...');
    await Promise.all(workers.map((w) => w.close()));
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});
