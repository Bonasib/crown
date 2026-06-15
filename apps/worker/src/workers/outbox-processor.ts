import { prisma } from '@ronda/db';

const POLL_INTERVAL_MS = 5_000;
const BATCH_SIZE = 50;
const MAX_ATTEMPTS = 5;

type OutboxPayload = Record<string, unknown>;

async function processEvent(id: string, topic: string, payload: OutboxPayload): Promise<void> {
  switch (topic) {
    case 'notification.otp':
      console.info(`[outbox] OTP → ${payload['channel']} → ${payload['phone']} code=${payload['code']}`);
      // TODO: call WhatsApp Business API / Unifonic SMS
      break;

    case 'notification.whatsapp': {
      const template = payload['template'] as string;
      const phone = payload['recipientPhone'] as string | undefined;
      console.info(`[outbox] WhatsApp template=${template} phone=${phone ?? 'org-resolved'}`);
      // TODO: call WhatsApp Business API
      break;
    }

    case 'ai.product_description':
      console.info(`[outbox] AI description fill → productId=${payload['productId']}`);
      // TODO: call Claude API vision + text, then update product.aiDescription
      // After admin approval: update product.description
      break;

    case 'ai.hs_code_suggestion':
      console.info(`[outbox] AI HS Code suggestion → productId=${payload['productId']}`);
      // TODO: call Claude API, update product.aiHsCode, enqueue admin review
      break;

    default:
      console.warn(`[outbox] Unknown topic: ${topic}`);
  }
}

export async function startOutboxProcessor(): Promise<void> {
  console.info('[outbox] Processor started');

  async function tick() {
    const pending = await prisma.outboxEvent.findMany({
      where: { status: 'PENDING', attempts: { lt: MAX_ATTEMPTS } },
      orderBy: { createdAt: 'asc' },
      take: BATCH_SIZE,
    });

    if (pending.length === 0) return;

    // Mark batch as PROCESSING atomically
    await prisma.outboxEvent.updateMany({
      where: { id: { in: pending.map((e) => e.id) } },
      data: { status: 'PROCESSING' },
    });

    await Promise.allSettled(
      pending.map(async (event) => {
        try {
          await processEvent(event.id, event.topic, event.payload as OutboxPayload);
          await prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'PROCESSED', processedAt: new Date() },
          });
        } catch (err) {
          const lastError = err instanceof Error ? err.message : String(err);
          const newAttempts = event.attempts + 1;
          await prisma.outboxEvent.update({
            where: { id: event.id },
            data: {
              status: newAttempts >= MAX_ATTEMPTS ? 'FAILED' : 'PENDING',
              attempts: newAttempts,
              lastError,
            },
          });
          console.error(`[outbox] Failed to process ${event.id} (${event.topic}): ${lastError}`);
        }
      }),
    );
  }

  // Poll loop
  const poll = async () => {
    try {
      await tick();
    } catch (err) {
      console.error('[outbox] Poll error:', err);
    }
    setTimeout(poll, POLL_INTERVAL_MS);
  };

  setTimeout(poll, POLL_INTERVAL_MS);
}
