import type { Job, Provider } from './types';

const QUEUE = 'https://queue.fal.run/';

interface QueueRef {
  status_url: string;
  response_url: string;
}

function key() {
  const k = process.env.FAL_KEY;
  if (!k) throw new Error('FAL_KEY is not set');
  return k;
}

function encode(ref: QueueRef) {
  return Buffer.from(JSON.stringify(ref)).toString('base64url');
}

function decode(id: string): QueueRef {
  const ref = JSON.parse(Buffer.from(id, 'base64url').toString('utf8')) as QueueRef;
  // Only ever call back into fal's queue host, never an arbitrary URL from the client.
  if (!ref.status_url?.startsWith(QUEUE) || !ref.response_url?.startsWith(QUEUE)) {
    throw new Error('Invalid fal job reference');
  }
  return ref;
}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Key ${key()}`, 'Content-Type': 'application/json', ...init?.headers },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`fal ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as T;
}

/** Pull every media URL out of fal's model-specific response shapes. */
function collectUrls(data: unknown): string[] {
  const out: string[] = [];
  const visit = (v: unknown) => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) return v.forEach(visit);
    const o = v as Record<string, unknown>;
    if (typeof o.url === 'string' && o.url.startsWith('http')) out.push(o.url);
    for (const k of ['images', 'image', 'video', 'videos', 'audio', 'audio_file']) visit(o[k]);
  };
  visit(data);
  return [...new Set(out)];
}

export const fal: Provider = {
  name: 'fal',
  async submit(_req, input, endpoint) {
    const ref = await call<QueueRef & { request_id: string }>(`${QUEUE}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return { id: `fal:${encode(ref)}`, status: 'queued', outputs: [], provider: 'fal' };
  },
  async poll(id) {
    const ref = decode(id);
    const s = await call<{ status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED'; error?: string }>(ref.status_url);
    if (s.status !== 'COMPLETED') {
      return { id: `fal:${id}`, status: s.status === 'IN_QUEUE' ? 'queued' : 'running', outputs: [], provider: 'fal' };
    }
    try {
      const data = await call<unknown>(ref.response_url);
      return { id: `fal:${id}`, status: 'succeeded', outputs: collectUrls(data), provider: 'fal' };
    } catch (e) {
      return { id: `fal:${id}`, status: 'failed', outputs: [], error: (e as Error).message, provider: 'fal' };
    }
  },
};
