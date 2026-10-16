import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_CATEGORIES, APPS } from '@/lib/catalog/apps';
import { PageHeader } from '@/components/layout/page-header';
import { Poster } from '@/components/media/poster';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Apps' };

export default function AppsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Wilo Apps"
        title={
          <>
            {APPS.length} one-click apps. <span className="text-gradient">Zero prompting.</span>
          </>
        }
        description="Each app bundles the right model, prompt and settings for one job. Upload, tap, done."
      >
        <div className="flex flex-wrap gap-2">
          {APP_CATEGORIES.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm hover:bg-elevated">
              {c.label}
            </a>
          ))}
        </div>
      </PageHeader>
      <div className="container space-y-14 py-12">
        {APP_CATEGORIES.map((c) => {
          const apps = APPS.filter((a) => a.category === c.id);
          if (!apps.length) return null;
          return (
            <section key={c.id} id={c.id} className="scroll-mt-24">
              <h2 className="mb-5 font-display text-2xl font-bold">{c.label}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {apps.map((a) => (
                  <Link key={a.slug} href={`/apps/${a.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/50">
                    <div className="relative">
                      <Poster seed={a.slug} motion="zoom-in" className="aspect-[16/10]" />
                      {a.badge && <Badge variant={a.badge} className="absolute left-3 top-3">{a.badge}</Badge>}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold">{a.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{a.blurb}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
