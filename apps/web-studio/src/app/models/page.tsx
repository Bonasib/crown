import type { Metadata } from 'next';
import Link from 'next/link';
import { Coins } from 'lucide-react';
import { MODELS, type Model } from '@/lib/catalog/models';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Models' };

const GROUPS: { title: string; filter: (m: Model) => boolean; href: string }[] = [
  { title: 'Image', filter: (m) => m.tasks.some((t) => t === 'text-to-image' || t === 'image-edit'), href: '/image' },
  { title: 'Video', filter: (m) => m.tasks.some((t) => t === 'text-to-video' || t === 'image-to-video'), href: '/video' },
  { title: 'Avatars & lip sync', filter: (m) => m.tasks.some((t) => t === 'lipsync' || t === 'avatar'), href: '/lipsync' },
  { title: 'Audio', filter: (m) => m.kind === 'audio', href: '/audio' },
  { title: 'Utilities', filter: (m) => m.tasks.some((t) => t === 'upscale' || t === 'remove-bg' || t === 'video-upscale'), href: '/apps' },
];

export default function ModelsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Models"
        title="Every frontier model. One credit balance."
        description="Wilo routes each request to the best provider. Prices are shown in credits per output, or per second of video."
      />
      <div className="container space-y-12 py-12">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <h2 className="mb-4 font-display text-2xl font-bold">{g.title}</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Model</th>
                    <th className="hidden px-4 py-3 md:table-cell">Best for</th>
                    <th className="hidden px-4 py-3 sm:table-cell">Options</th>
                    <th className="px-4 py-3 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {MODELS.filter(g.filter).map((m) => (
                    <tr key={m.id} className="border-t border-border hover:bg-surface/60">
                      <td className="px-4 py-3">
                        <Link href={`${g.href}?model=${m.id}`} className="flex items-center gap-2 font-medium hover:text-primary">
                          {m.name}
                          {m.badge && <Badge variant={m.badge}>{m.badge}</Badge>}
                        </Link>
                        <span className="text-xs text-muted-foreground">{m.vendor}</span>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{m.blurb}</td>
                      <td className="hidden px-4 py-3 text-xs text-muted-foreground sm:table-cell">
                        {[m.durations && `${m.durations.join('/')}s`, m.resolutions?.join('/'), m.maxCount && `×${m.maxCount}`]
                          .filter(Boolean)
                          .join(' · ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1">
                          <Coins className="size-3.5 text-amber-300" />
                          {m.credits}
                          <span className="text-xs text-muted-foreground">{m.perSecond ? '/s' : ''}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
