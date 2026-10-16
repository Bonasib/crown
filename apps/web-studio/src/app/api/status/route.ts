import { NextResponse } from 'next/server';
import { activeProvider } from '@/lib/providers';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({ provider: activeProvider().name });
}
