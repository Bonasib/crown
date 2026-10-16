'use client';

import { useEffect } from 'react';
import { AlertCircle, Download, Heart, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { getModel } from '@/lib/catalog/models';
import { actions, getLibrary, useStore, type LibraryItem } from '@/lib/store';
import { resumePending } from '@/lib/use-generate';
import { cn } from '@/lib/utils';
import { MediaOutput } from '@/components/media/media-output';

let resumed = false;

function ratioClass(ratio?: string) {
  switch (ratio) {
    case '9:16':
      return 'aspect-[9/16]';
    case '3:4':
    case '2:3':
      return 'aspect-[3/4]';
    case '1:1':
      return 'aspect-square';
    case '4:3':
    case '3:2':
      return 'aspect-[4/3]';
    case '21:9':
      return 'aspect-[21/9]';
    default:
      return 'aspect-video';
  }
}

export function ResultCard({ item }: { item: LibraryItem }) {
  const model = getModel(item.modelId);
  const pending = item.status === 'queued' || item.status === 'running';
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-surface">
      <div className={cn('relative overflow-hidden bg-elevated', item.kind === 'audio' ? 'aspect-[3/1]' : ratioClass(item.aspectRatio))}>
        {pending && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[linear-gradient(110deg,transparent_30%,hsl(var(--primary)/0.15)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs capitalize text-muted-foreground">{item.status}…</span>
          </div>
        )}
        {item.status === 'failed' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <AlertCircle className="size-6 text-destructive" />
            <span className="line-clamp-3 text-xs text-muted-foreground">{item.error ?? 'Generation failed'} · credits refunded</span>
          </div>
        )}
        {item.status === 'succeeded' && item.outputs[0] && <MediaOutput url={item.outputs[0]} kind={item.kind} />}
        {item.status === 'succeeded' && item.outputs.length > 1 && (
          <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px]">+{item.outputs.length - 1}</span>
        )}
      </div>
      <div className="flex items-start gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-xs">{item.prompt || 'Untitled'}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {model?.name ?? item.modelId} · {item.credits} credits
          </p>
        </div>
        <div className="flex shrink-0 gap-0.5 opacity-70 transition-opacity group-hover:opacity-100">
          <button type="button" onClick={() => actions.toggleFavorite(item.id)} className="rounded-full p-1.5 hover:bg-elevated" aria-label="Favorite">
            <Heart className={cn('size-3.5', item.favorite && 'fill-accent text-accent')} />
          </button>
          {item.outputs[0] && (
            <a href={item.outputs[0]} download target="_blank" rel="noreferrer" className="rounded-full p-1.5 hover:bg-elevated" aria-label="Download">
              <Download className="size-3.5" />
            </a>
          )}
          <button type="button" onClick={() => actions.remove(item.id)} className="rounded-full p-1.5 hover:bg-elevated" aria-label="Delete">
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Results({ filter, emptyHint }: { filter: (i: LibraryItem) => boolean; emptyHint: string }) {
  const library = useStore((s) => s.library);
  useEffect(() => {
    if (!resumed) {
      resumed = true;
      resumePending(getLibrary());
    }
  }, []);
  const items = library.filter(filter);

  if (!items.length) {
    return (
      <div className="flex h-full min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-brand">
          <Sparkles className="size-5 text-white" />
        </span>
        <p className="font-display text-lg font-semibold">Your creations appear here</p>
        <p className="max-w-sm text-sm text-muted-foreground">{emptyHint}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ResultCard key={item.id} item={item} />
      ))}
    </div>
  );
}
