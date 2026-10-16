import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getPreset, PRESET_CATEGORIES, PRESETS } from '@/lib/catalog/presets';
import { Poster } from '@/components/media/poster';
import { PresetCard } from '@/components/studio/preset-picker';
import { Studio } from '@/components/studio/studio';

export function generateStaticParams() {
  return PRESETS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return { title: `${getPreset(params.slug)?.name ?? 'Preset'} preset` };
}

export default function PresetPage({ params }: { params: { slug: string } }) {
  const preset = getPreset(params.slug);
  if (!preset) notFound();
  const related = PRESETS.filter((p) => p.category === preset.category && p.slug !== preset.slug).slice(0, 6);
  return (
    <>
      <div className="container pt-6">
        <Link href="/presets" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All presets
        </Link>
        <div className="mt-4 grid items-center gap-6 rounded-3xl border border-border bg-surface/60 p-4 md:grid-cols-[320px_1fr] md:p-6">
          <Poster seed={preset.slug} motion={preset.motion === 'none' ? 'drift' : preset.motion} className="group aspect-video rounded-2xl" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {PRESET_CATEGORIES.find((c) => c.id === preset.category)?.label}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold uppercase">{preset.name}</h1>
            <p className="mt-2 text-muted-foreground">Direction added to your prompt: “{preset.prompt}”.</p>
          </div>
        </div>
      </div>
      <Studio
        title={`Create with ${preset.name}`}
        subtitle="Upload a start frame for the best result, or describe the scene."
        kind="video"
        tasks={['text-to-video', 'image-to-video']}
        inputs={['image', 'prompt']}
        defaultModel="wilo-motion"
        presets
        initialPreset={preset.slug}
        required={[]}
      />
      <div className="container pb-12">
        <h2 className="mb-4 font-display text-xl font-bold">More like this</h2>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {related.map((p) => (
            <Link key={p.slug} href={`/presets/${p.slug}`}>
              <PresetCard preset={p} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
