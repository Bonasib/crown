import type { Job, JobStatus, Provider } from './types';

const API = 'https://api.replicate.com/v1';

interface Prediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: unknown;
  error?: string | null;
}

function token() {
  const t = process.env.REPLICATE_API_TOKEN;
  if (!t) throw new Error('REPLICATE_API_TOKEN is not set');
  return t;
}

function mapStatus(s: Prediction['status']): JobStatus {
  if (s === 'starting') return 'queued';
  if (s === 'processing') return 'running';
  if (s === 'succeeded') return 'succeeded';
  return 'failed';
}

function toOutputs(output: unknown): string[] {
  if (!output) return [];
  if (typeof output === 'string') return [output];
  if (Array.isArray(output)) return output.filter((o): o is string => typeof o === 'string');
  return [];
}

function toJob(p: Prediction): Job {
  return {
    id: `replicate:${p.id}`,
    status: mapStatus(p.status),
    outputs: toOutputs(p.output),
    error: p.error ?? (p.status === 'canceled' ? 'Canceled' : undefined),
    provider: 'replicate',
  };
}

async function call(path: string, init?: RequestInit): Promise<Prediction> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json', ...init?.headers },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Replicate ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as Prediction;
}

export const replicate: Provider = {
  name: 'replicate',
  async submit(_req, input, endpoint) {
    // endpoint is "owner/model" — uses the model's latest official version.
    const p = await call(`/models/${endpoint}/predictions`, {
      method: 'POST',
      body: JSON.stringify({ input }),
    });
    return toJob(p);
  },
  async poll(id) {
    if (!/^[a-z0-9]+$/i.test(id)) throw new Error('Invalid prediction id');
    return toJob(await call(`/predictions/${id}`));
  },
};
