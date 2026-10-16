import { NextResponse } from 'next/server';
import { providerForJob } from '@/lib/providers';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const { provider, id } = providerForJob(decodeURIComponent(params.id));
    return NextResponse.json(await provider.poll(id));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
