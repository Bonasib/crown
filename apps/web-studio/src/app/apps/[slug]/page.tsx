import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { APP_CATEGORIES, APPS, getApp } from '@/lib/catalog/apps';
import { getModel } from '@/lib/catalog/models';
import { Poster } from '@/components/media/poster';
import { Studio } from '@/components/studio/studio';

export function generateStaticParams() {
  return APPS.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const app = getApp(params.slug);
  return { title: app?.name ?? 'App', description: app?.blurb };
}

export default function AppPage({ params }: { params: { slug: string } }) {
  const app = getApp(params.slug);
  if (!app) notFound();
  const model = getModel(app.defaultModel)!;
  const textOnly = app.task === 'text-to-image' || app.task === 'text-to-video' || app.task === 'speech' || app.task === 'music';
  const related = APPS.filter((a) => a.category === app.category && a.slug !== app.slug).slice(0, 4);

  return (
    <>
      <div className="container pt-6">
        <Link href="/apps" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All apps
        </Link>
      </div>
      <Studio
        title={app.name}
        subtitle={`${app.blurb} · ${APP_CATEGORIES.find((c) => c.id === app.category)?.label} · powered by ${model.name}`}
        kind={model.kind}
        tasks={[app.task]}
        inputs={app.inputs}
        defaultModel={app.defaultModel}
        template={app.template}
        appSlug={app.slug}
        presets={model.kind === 'video' && app.task !== 'lipsync' && app.task !== 'avatar' && app.task !== 'video-upscale'}
        required={textOnly ? ['prompt'] : app.inputs.filter((i) => i !== 'prompt')}
        inputLabels={app.inputs.includes('image2') ? { image: 'First image', image2: 'Second image' } : undefined}
      />
      {related.length > 0 && (
        <div className="container pb-12">
          <h2 className="mb-4 font-display text-xl font-bold">Related apps</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((a) => (
              <Link key={a.slug} href={`/apps/${a.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-surface">
                <Poster seed={a.slug} motion="zoom-in" className="aspect-video" />
                <p className="p-3 text-sm font-medium">{a.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
