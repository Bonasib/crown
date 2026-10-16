import { demo } from './demo';
import { fal } from './fal';
import { replicate } from './replicate';
import type { Provider } from './types';

export type { GenerationRequest, Job, MediaKind } from './types';

export function activeProvider(): Provider {
  const preferred = process.env.WILO_PROVIDER === 'fal' ? 'fal' : 'replicate';
  if (preferred === 'fal' && process.env.FAL_KEY) return fal;
  if (preferred === 'replicate' && process.env.REPLICATE_API_TOKEN) return replicate;
  if (process.env.FAL_KEY) return fal;
  if (process.env.REPLICATE_API_TOKEN) return replicate;
  return demo;
}

/** Resolve a job id ("replicate:…", "fal:…", "demo:…") back to the provider that created it. */
export function providerForJob(jobId: string): { provider: Provider; id: string } {
  const idx = jobId.indexOf(':');
  const prefix = jobId.slice(0, idx);
  const id = jobId.slice(idx + 1);
  if (prefix === 'replicate') return { provider: replicate, id };
  if (prefix === 'fal') return { provider: fal, id };
  if (prefix === 'demo') return { provider: demo, id };
  throw new Error('Unknown job provider');
}
