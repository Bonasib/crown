import type { Metadata } from 'next';
import Link from 'next/link';
import { PRESET_CATEGORIES, PRESETS } from '@/lib/catalog/presets';
import { PageHeader } from '@/components/layout/page-header';
import { Poster } from '@/components/media/poster';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Motion Presets' };

export default function PresetsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Motion presets"
        title={
          <>
            {PRESETS.length} moves your camera crew <span className="text-gradient">wishes</span> it could pull off
          </>
        }
        description="Hover a card to preview the move. Click to open it in Create Video with your own image or prompt."
      >
        <div className="flex flex-wrap gap-2">
          {PRESET_CATEGORIES.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm hover:bg-elevated">
              {c.label}
            </a>
          ))}
        </div>
      </PageHeader>
      <div className="container space-y-14 py-12">
        {PRESET_CATEGORIES.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-24">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">{c.label}</h2>
                <p className="text-sm text-muted-foreground">{c.blurb}</p>
              </div>
              <span className="text-sm text-muted-foreground">{PRESETS.filter((p) => p.category === c.id).length} presets</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {PRESETS.filter((p) => p.category === c.id).map((p) => (
                <Link key={p.slug} href={`/presets/${p.slug}`} className="group relative overflow-hidden rounded-2xl">
                  <Poster seed={p.slug} motion={p.motion} className="aspect-[3/4]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/90 to-transparent p-3">
                    <span className="text-sm font-bold uppercase tracking-wide">{p.name}</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-black opacity-0 transition-opacity group-hover:opacity-100">
                      TRY
                    </span>
                  </div>
                  {p.badge && <Badge variant={p.badge} className="absolute left-2 top-2">{p.badge}</Badge>}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
