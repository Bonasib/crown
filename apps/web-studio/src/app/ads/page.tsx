'use client';

import { useState } from 'react';
import { Studio } from '@/components/studio/studio';
import { Poster } from '@/components/media/poster';
import { cn } from '@/lib/utils';

const FORMATS = [
  {
    id: 'ugc',
    name: 'UGC creator',
    blurb: 'Selfie-style review by a relatable creator',
    model: 'veo-3',
    ratio: '9:16',
    template: 'vertical selfie-style UGC video, a friendly creator holds and enthusiastically reviews this product, natural home lighting, they say: "{prompt}"',
  },
  {
    id: 'tv',
    name: 'TV spot',
    blurb: 'Polished broadcast commercial',
    model: 'veo-3',
    ratio: '16:9',
    template: 'premium broadcast TV commercial for this product, dramatic studio lighting, sweeping camera, tagline: {prompt}',
  },
  {
    id: 'packshot',
    name: 'Packshot motion',
    blurb: 'Hero product rotating on seamless',
    model: 'wilo-motion',
    ratio: '1:1',
    template: 'hero packshot, product slowly rotates on a seamless studio background, soft reflections, {prompt}',
  },
  {
    id: 'asmr',
    name: 'ASMR',
    blurb: 'Satisfying close-ups with crisp sound',
    model: 'veo-3',
    ratio: '9:16',
    template: 'satisfying ASMR macro shots of the product being unboxed and used, crisp tactile sound, {prompt}',
  },
  {
    id: 'giant',
    name: 'Giant product',
    blurb: 'Your product as a city-sized landmark',
    model: 'wilo-motion',
    ratio: '16:9',
    template: 'the product as a colossal landmark in a busy city, drone shot circling it, crowds for scale, {prompt}',
  },
  {
    id: 'splash',
    name: 'Splash',
    blurb: 'High-speed liquid and particles',
    model: 'kling-2.1',
    ratio: '9:16',
    template: 'high-speed liquid splash and particles burst around the product, slow motion, {prompt}',
  },
] as const;

export default function AdsPage() {
  const [fmt, setFmt] = useState<(typeof FORMATS)[number]>(FORMATS[0]);
  return (
    <>
      <div className="container pt-6">
        <h1 className="sr-only">Ad Studio</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFmt(f)}
              className={cn(
                'group overflow-hidden rounded-xl border text-left transition-colors',
                f.id === fmt.id ? 'border-primary' : 'border-border hover:border-muted-foreground/40',
              )}
            >
              <Poster seed={`ad-${f.id}`} motion="zoom-in" className="aspect-video" />
              <div className="p-2.5">
                <p className="text-sm font-medium">{f.name}</p>
                <p className="text-[11px] text-muted-foreground">{f.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <Studio
        key={fmt.id}
        title={`Ad Studio · ${fmt.name}`}
        subtitle="Upload a clean product photo, add your hook or tagline, and get a ready-to-post ad."
        kind="video"
        tasks={['image-to-video']}
        inputs={['image', 'prompt']}
        defaultModel={fmt.model}
        template={fmt.template}
        appSlug={`ads:${fmt.id}`}
        required={['image']}
        inputLabels={{ image: 'Product photo', prompt: 'Hook, tagline or script (optional)' }}
      />
    </>
  );
}
