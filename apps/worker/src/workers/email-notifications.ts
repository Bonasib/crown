import { Worker, Job } from 'bullmq';
import { connection } from '../queues';

export interface EmailJobData {
  to: string | string[];
  subject: string;
  template: 'shipment_update' | 'quote_ready' | 'invoice_issued' | 'welcome';
  variables: Record<string, unknown>;
}

async function processEmailJob(job: Job<EmailJobData>): Promise<void> {
  const { to, subject, template, variables } = job.data;
  console.log(`[email-worker] Sending "${subject}" to ${Array.isArray(to) ? to.join(', ') : to}`);
  console.log(`[email-worker] Template: ${template}`, variables);
  // TODO: Integrate with email provider (Resend, SendGrid, etc.)
  await new Promise((resolve) => setTimeout(resolve, 100));
}

export function createEmailWorker() {
  const worker = new Worker<EmailJobData>(
    'email-notifications',
    processEmailJob,
    {
      connection,
      concurrency: 5,
    },
  );

  worker.on('completed', (job) => {
    console.log(`[email-worker] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[email-worker] Job ${job?.id} failed:`, err);
  });

  return worker;
}
