import type { Metadata } from 'next';
import Link from 'next/link';
import { APPS } from '@/lib/catalog/apps';
import { Poster } from '@/components/media/poster';
import { Studio } from '@/components/studio/studio';

export const metadata: Metadata = { title: 'Edit Image' };

const QUICK = ['outfit-swap', 'relight', 'upscale', 'remove-background', 'face-swap', 'skin-retouch', 'sketch-to-real', 'multi-angle'];

export default function EditPage() {
  const tools = QUICK.map((s) => APPS.find((a) => a.slug === s)!).filter(Boolean);
  return (
    <>
      <div className="container pt-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {tools.map((t) => (
            <Link key={t.slug} href={`/apps/${t.slug}`} className="group flex w-40 shrink-0 items-center gap-2 rounded-xl border border-border bg-surface p-2 text-sm hover:bg-elevated">
              <Poster seed={t.slug} className="size-9 shrink-0 rounded-lg" />
              <span className="truncate">{t.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <Studio
        title="Edit Image"
        subtitle="Upload a photo and say what to change: “make it night”, “add a red scarf”, “remove the people”."
        kind="image"
        tasks={['image-edit']}
        inputs={['image', 'prompt']}
        defaultModel="flux-kontext"
        placeholder="Describe the edit…"
        required={['image', 'prompt']}
        inputLabels={{ image: 'Image to edit' }}
      />
    </>
  );
}
