'use client';

import { useRef, useState } from 'react';
import { FileAudio, FileVideo, ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_BYTES = 9 * 1024 * 1024;

export type UploadKind = 'image' | 'video' | 'audio';

const ACCEPT: Record<UploadKind, string> = {
  image: 'image/png,image/jpeg,image/webp',
  video: 'video/mp4,video/webm,video/quicktime',
  audio: 'audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/webm',
};

export function Upload({
  kind,
  label,
  value,
  onChange,
  className,
}: {
  kind: UploadKind;
  label: string;
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const [drag, setDrag] = useState(false);

  const read = (file?: File) => {
    if (!file) return;
    if (file.size > MAX_BYTES) return setError('Max file size is 9 MB');
    if (!file.type.startsWith(kind)) return setError(`Please choose a ${kind} file`);
    setError(undefined);
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  const Icon = kind === 'image' ? ImagePlus : kind === 'video' ? FileVideo : FileAudio;

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => ref.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && ref.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          read(e.dataTransfer.files[0]);
        }}
        className={cn(
          'group relative flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-dashed border-input bg-surface text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          drag && 'border-primary bg-primary/10',
        )}
      >
        {value ? (
          <>
            {kind === 'image' && <img src={value} alt="" className="absolute inset-0 size-full object-cover" />}
            {kind === 'video' && <video src={value} className="absolute inset-0 size-full object-cover" muted />}
            {kind === 'audio' && (
              <span className="flex items-center gap-2 text-foreground">
                <FileAudio className="size-4 text-primary" /> Audio attached
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white hover:bg-black"
              aria-label={`Remove ${label}`}
            >
              <X className="size-3.5" />
            </button>
          </>
        ) : (
          <>
            <Icon className="size-5" />
            <span className="font-medium">{label}</span>
            <span className="opacity-70">Drop or click · max 9 MB</span>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept={ACCEPT[kind]} className="hidden" onChange={(e) => read(e.target.files?.[0])} />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
