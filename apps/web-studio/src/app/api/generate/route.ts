import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildProviderCall, getModel } from '@/lib/catalog/models';
import { activeProvider } from '@/lib/providers';

export const runtime = 'nodejs';

const MAX_MEDIA_CHARS = 12_000_000; // ≈ 9 MB file once base64-decoded

const media = z
  .string()
  .max(MAX_MEDIA_CHARS, 'File is too large (max ~9 MB)')
  .refine((v) => v.startsWith('data:') || v.startsWith('https://'), 'Media must be a data URL or https URL')
  .optional();

const schema = z.object({
  kind: z.enum(['image', 'video', 'audio']),
  modelId: z.string().min(1),
  prompt: z.string().max(4000).default(''),
  negativePrompt: z.string().max(2000).optional(),
  image: media,
  endImage: media,
  references: z.array(media.unwrap()).max(3).optional(),
  audio: media,
  video: media,
  aspectRatio: z.string().max(32).optional(),
  duration: z.number().int().min(1).max(60).optional(),
  resolution: z.string().max(16).optional(),
  count: z.number().int().min(1).max(4).optional(),
  seed: z.number().int().min(0).max(2_147_483_647).optional(),
  presetId: z.string().max(80).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
  }
  const req = parsed.data;
  const model = getModel(req.modelId);
  if (!model) return NextResponse.json({ error: 'Unknown model' }, { status: 400 });

  const provider = activeProvider();
  try {
    if (provider.name === 'demo') {
      return NextResponse.json(await provider.submit(req, {}, ''));
    }
    const { endpoint, input } = buildProviderCall(model, provider.name, req);
    return NextResponse.json(await provider.submit(req, input, endpoint));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
