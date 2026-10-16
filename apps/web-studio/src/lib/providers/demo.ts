import type { Job, Provider } from './types';

/** Simulated provider used when no API key is configured. Jobs finish ~4s after submission. */
const DURATION_MS = 4000;

export const demo: Provider = {
  name: 'demo',
  async submit(req) {
    const count = Math.min(Math.max(req.count ?? 1, 1), 4);
    const seed = Math.floor(Math.random() * 1e9);
    const payload = Buffer.from(
      JSON.stringify({ k: req.kind, c: count, s: seed, t: Date.now(), r: req.aspectRatio ?? '16:9' }),
    ).toString('base64url');
    return { id: `demo:${payload}`, status: 'queued', outputs: [], provider: 'demo' };
  },
  async poll(id) {
    const { k, c, s, t, r } = JSON.parse(Buffer.from(id, 'base64url').toString('utf8')) as {
      k: string;
      c: number;
      s: number;
      t: number;
      r: string;
    };
    const elapsed = Date.now() - t;
    if (elapsed < DURATION_MS) {
      return { id: `demo:${id}`, status: elapsed < 1000 ? 'queued' : 'running', outputs: [], provider: 'demo' };
    }
    const outputs = Array.from(
      { length: c },
      (_, i) => `/api/demo-art?seed=${s + i}&kind=${encodeURIComponent(k)}&ratio=${encodeURIComponent(r)}`,
    );
    return { id: `demo:${id}`, status: 'succeeded', outputs, provider: 'demo' };
  },
};
