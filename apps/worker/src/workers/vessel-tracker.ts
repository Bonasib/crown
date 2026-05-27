import { Worker, Job } from 'bullmq';
import { prisma } from '@ronda/db';
import { connection } from '../queues';

export interface VesselTrackJobData {
  shipmentId: string;
  blNumber?: string;
  vesselName?: string;
}

async function processVesselTrackJob(job: Job<VesselTrackJobData>): Promise<void> {
  const { shipmentId, blNumber } = job.data;

  console.log(`[vessel-tracker] Checking vessel position for shipment ${shipmentId} (BL: ${blNumber})`);

  // TODO: Call carrier API (Maersk, MSC, etc.)
  // For now, simulate a tracking update
  const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
  if (!shipment) {
    console.warn(`[vessel-tracker] Shipment ${shipmentId} not found`);
    return;
  }

  // Simulated: in production this would call the carrier API
  console.log(`[vessel-tracker] Shipment ${shipmentId} status: ${shipment.status}`);
}

export function createVesselTrackerWorker() {
  const worker = new Worker<VesselTrackJobData>(
    'vessel-tracker',
    processVesselTrackJob,
    { connection, concurrency: 3 },
  );

  worker.on('failed', (job, err) => {
    console.error(`[vessel-tracker] Job ${job?.id} failed:`, err);
  });

  return worker;
}
