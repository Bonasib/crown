import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env['REDIS_URL'] ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const queues = {
  emailNotifications: new Queue('email-notifications', { connection }),
  vesselTracker: new Queue('vessel-tracker', { connection }),
  documentGenerator: new Queue('document-generator', { connection }),
  fxRateSync: new Queue('fx-rate-sync', { connection }),
  invoiceReminder: new Queue('invoice-reminder', { connection }),
  complianceCheck: new Queue('compliance-check', { connection }),
  webhookDelivery: new Queue('webhook-delivery', { connection }),
};

export { connection };
export type QueueName = keyof typeof queues;
