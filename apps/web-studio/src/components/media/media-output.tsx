import type { MediaKind } from '@/lib/providers/types';
import { cn } from '@/lib/utils';

function detect(url: string, kind: MediaKind): 'image' | 'video' | 'audio' {
  if (url.startsWith('/api/demo-art')) return 'image';
  const ext = url.split('?')[0]!.split('.').pop()?.toLowerCase();
  if (ext && ['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (ext && ['mp3', 'wav', 'm4a', 'flac', 'ogg'].includes(ext)) return 'audio';
  if (ext && ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) return 'image';
  return kind;
}

export function MediaOutput({ url, kind, className }: { url: string; kind: MediaKind; className?: string }) {
  const type = detect(url, kind);
  if (type === 'video') {
    return (
      <video
        src={url}
        className={cn('size-full object-cover', className)}
        muted
        loop
        playsInline
        autoPlay
        controls
      />
    );
  }
  if (type === 'audio') {
    return (
      <div className={cn('flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 p-4', className)}>
        <audio src={url} controls className="w-full" />
      </div>
    );
  }
  return <img src={url} alt="Generated output" className={cn('size-full object-cover', className)} loading="lazy" />;
}
