'use client';

import { useState } from 'react';
import { Results } from '@/components/studio/results';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore, type LibraryItem } from '@/lib/store';

type Filter = 'all' | 'image' | 'video' | 'audio' | 'favorites';

const FILTERS: Record<Filter, (i: LibraryItem) => boolean> = {
  all: () => true,
  image: (i) => i.kind === 'image',
  video: (i) => i.kind === 'video',
  audio: (i) => i.kind === 'audio',
  favorites: (i) => Boolean(i.favorite),
};

export default function LibraryPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const count = useStore((s) => s.library.length);
  return (
    <div className="container space-y-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Library</h1>
          <p className="text-sm text-muted-foreground">{count} generations saved in this browser.</p>
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            {(Object.keys(FILTERS) as Filter[]).map((f) => (
              <TabsTrigger key={f} value={f} className="capitalize">
                {f}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <Results filter={FILTERS[filter]} emptyHint="Nothing here yet. Head to Create Image or Create Video to make something." />
    </div>
  );
}
