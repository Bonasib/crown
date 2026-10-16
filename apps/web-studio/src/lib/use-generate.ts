'use client';

import { useCallback } from 'react';
import { actions, type LibraryItem } from './store';
import type { GenerationRequest, Job } from './providers/types';

const POLL_MS = 2500;
const TIMEOUT_MS = 15 * 60 * 1000;

async function poll(item: LibraryItem) {
  const started = Date.now();
  while (Date.now() - started < TIMEOUT_MS) {
    await new Promise((r) => setTimeout(r, POLL_MS));
    const res = await fetch(`/api/jobs/${encodeURIComponent(item.jobId)}`, { cache: 'no-store' });
    const job = (await res.json()) as Job & { error?: string };
    if (!res.ok) {
      actions.update(item.id, { status: 'failed', error: job.error ?? 'Polling failed' });
      actions.refund(item.credits);
      return;
    }
    actions.update(item.id, { status: job.status, outputs: job.outputs, error: job.error });
    if (job.status === 'failed') actions.refund(item.credits);
    if (job.status === 'succeeded' || job.status === 'failed') return;
  }
  actions.update(item.id, { status: 'failed', error: 'Timed out' });
  actions.refund(item.credits);
}

export interface GenerateMeta {
  credits: number;
  presetSlug?: string;
  appSlug?: string;
}

export function useGenerate() {
  return useCallback(async (req: GenerationRequest, meta: GenerateMeta): Promise<string | null> => {
    if (!actions.spend(meta.credits)) return 'Not enough credits — top up on the pricing page.';
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    const job = (await res.json()) as Job & { error?: string };
    if (!res.ok) {
      actions.refund(meta.credits);
      return job.error ?? 'Generation failed';
    }
    const item: LibraryItem = {
      id: crypto.randomUUID(),
      jobId: job.id,
      kind: req.kind,
      modelId: req.modelId,
      prompt: req.prompt,
      aspectRatio: req.aspectRatio,
      presetSlug: meta.presetSlug,
      appSlug: meta.appSlug,
      status: job.status,
      outputs: job.outputs,
      credits: meta.credits,
      createdAt: Date.now(),
    };
    actions.add(item);
    void poll(item);
    return null;
  }, []);
}

/** Resume polling for jobs left in flight when the page was closed. */
export function resumePending(items: LibraryItem[]) {
  for (const item of items) {
    if (item.status === 'queued' || item.status === 'running') void poll(item);
  }
}
