import type { Metadata } from 'next';
import { CheckCircle2, CircleDashed, Loader } from 'lucide-react';
import { ROADMAP, type RoadmapStatus } from '@/lib/catalog/site';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Roadmap' };

const COLUMNS: { id: RoadmapStatus; label: string; icon: typeof CheckCircle2; tone: string }[] = [
  { id: 'shipped', label: 'Shipped', icon: CheckCircle2, tone: 'text-emerald-400' },
  { id: 'in-progress', label: 'In progress', icon: Loader, tone: 'text-amber-300' },
  { id: 'planned', label: 'Planned', icon: CircleDashed, tone: 'text-muted-foreground' },
];

export default function RoadmapPage() {
  return (
    <>
      <PageHeader eyebrow="Roadmap" title="What we’re building" description="Where Wilo is today and where it’s heading next." />
      <div className="container grid gap-6 py-12 lg:grid-cols-3">
        {COLUMNS.map((col) => (
          <section key={col.id} className="rounded-3xl border border-border bg-surface/50 p-4">
            <h2 className="mb-4 flex items-center gap-2 px-2 font-display text-lg font-bold">
              <col.icon className={`size-5 ${col.tone}`} /> {col.label}
              <span className="ml-auto text-sm font-normal text-muted-foreground">{ROADMAP.filter((r) => r.status === col.id).length}</span>
            </h2>
            <div className="space-y-3">
              {ROADMAP.filter((r) => r.status === col.id).map((r) => (
                <article key={r.title} className="rounded-2xl border border-border bg-background/60 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="pro">{r.tag}</Badge>
                    <span className="text-xs text-muted-foreground">{r.quarter}</span>
                  </div>
                  <h3 className="font-medium">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
