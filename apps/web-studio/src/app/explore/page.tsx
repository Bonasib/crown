import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Play } from 'lucide-react';
import { COMMUNITY } from '@/lib/catalog/community';
import { getModel } from '@/lib/catalog/models';
import { getPreset } from '@/lib/catalog/presets';
import { getApp } from '@/lib/catalog/apps';
import { PageHeader } from '@/components/layout/page-header';
import { Poster } from '@/components/media/poster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Explore' };

const RATIO = { portrait: 'aspect-[3/4]', landscape: 'aspect-video', square: 'aspect-square' };

export default function ExplorePage() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Trending on Wilo"
        description="See what creators are making this week, then remix it with the same preset or app."
      />
      <div className="container py-10">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
          {COMMUNITY.map((post) => {
            const preset = post.presetSlug ? getPreset(post.presetSlug) : undefined;
            const app = post.appSlug ? getApp(post.appSlug) : undefined;
            const href = app ? `/apps/${app.slug}` : preset ? `/presets/${preset.slug}` : '/video';
            return (
              <Link key={post.id} href={href} className="group mb-4 block break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="relative">
                  <Poster seed={post.id + post.title} motion={preset?.motion ?? 'zoom-in'} className={cn(RATIO[post.ratio])} />
                  {post.kind === 'video' && (
                    <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-black/60">
                      <Play className="size-3 fill-white" />
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black opacity-0 transition-opacity group-hover:opacity-100">
                    Remix {app?.name ?? preset?.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3">
                  <span className="grid size-7 place-items-center rounded-full bg-brand text-[11px] font-bold uppercase">{post.author[0]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{post.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      @{post.author} · {getModel(post.modelId)?.name}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="size-3.5" /> {post.likes.toLocaleString('en-US')}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
