'use client';

import { useState } from 'react';
import { Check, ImagePlus, Lock, UserRound, X } from 'lucide-react';
import { Studio } from '@/components/studio/studio';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const MIN = 1;
const IDEAL = 20;

/**
 * Persona: build a reusable character. Until fine-tuning ships (see roadmap),
 * the strongest photo is sent as an identity reference on every generation.
 */
export default function CharacterPage() {
  const [name, setName] = useState('My Persona');
  const [photos, setPhotos] = useState<string[]>([]);
  const [primary, setPrimary] = useState(0);

  const add = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .slice(0, 40 - photos.length)
      .forEach((file) => {
        if (!file.type.startsWith('image/') || file.size > 9 * 1024 * 1024) return;
        const r = new FileReader();
        r.onload = () => setPhotos((p) => [...p, r.result as string]);
        r.readAsDataURL(file);
      });
  };

  const ready = photos.length >= MIN;
  const ref = photos[primary];

  return (
    <>
      <div className="container pt-6">
        <div className="rounded-2xl border border-border bg-surface/60 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand">
              <UserRound className="size-5 text-white" />
            </span>
            <div className="mr-auto">
              <h2 className="font-display text-lg font-semibold">Persona</h2>
              <p className="text-sm text-muted-foreground">
                Upload photos of one person. Varied angles and at least one full-body shot work best ({IDEAL}+ ideal).
              </p>
            </div>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="w-48" aria-label="Persona name" />
            <Badge variant={ready ? 'pro' : 'outline'}>
              {ready ? <Check className="size-3" /> : <Lock className="size-3" />} {photos.length} photos
            </Badge>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <label className="flex size-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-input text-[11px] text-muted-foreground hover:border-primary hover:text-foreground">
              <ImagePlus className="size-4" /> Add
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => add(e.target.files)} />
            </label>
            {photos.map((p, i) => (
              <div key={i} className="relative size-20 shrink-0">
                <button
                  type="button"
                  onClick={() => setPrimary(i)}
                  className={`size-full overflow-hidden rounded-xl border-2 ${i === primary ? 'border-primary' : 'border-transparent'}`}
                  aria-label="Use as primary reference"
                >
                  <img src={p} alt="" className="size-full object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotos((ps) => ps.filter((_, j) => j !== i));
                    setPrimary(0);
                  }}
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5"
                  aria-label="Remove photo"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {ready ? (
        <Studio
          key={ref}
          title={`Shoot with ${name}`}
          subtitle="Your persona is applied to every image. Pick a scene, outfit or vibe."
          kind="image"
          tasks={['text-to-image', 'image-edit']}
          inputs={['prompt']}
          defaultModel="nano-banana"
          template={`the same person from the reference photo, identical face, ${'{prompt}'}`}
          appSlug={`persona:${name}`}
          required={['prompt']}
          referenceImage={ref}
        />
      ) : (
        <div className="container py-16 text-center text-sm text-muted-foreground">Add at least one photo to start shooting.</div>
      )}
    </>
  );
}
