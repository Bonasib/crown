'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowUp, Clapperboard, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroPrompt() {
  const router = useRouter();
  const [mode, setMode] = useState<'video' | 'image'>('video');
  const [prompt, setPrompt] = useState('');

  const go = () => router.push(`/${mode}?prompt=${encodeURIComponent(prompt.trim())}`);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className="glass mx-auto w-full max-w-2xl rounded-3xl p-2 shadow-[0_20px_80px_-20px_hsl(var(--primary)/0.5)]"
    >
      <div className="flex gap-1 p-1">
        {(['video', 'image'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors',
              mode === m ? 'bg-white text-black' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {m === 'video' ? <Clapperboard className="size-3.5" /> : <ImageIcon className="size-3.5" />}
            {m}
          </button>
        ))}
      </div>
      <div className="flex items-end gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              go();
            }
          }}
          rows={2}
          placeholder={mode === 'video' ? 'A surfer rides a wave of molten gold, drone orbit…' : 'Editorial portrait of a chef in a neon kitchen…'}
          className="min-h-14 flex-1 resize-none bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none"
          aria-label="Prompt"
        />
        <button type="submit" className="mb-1 mr-1 grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white transition hover:brightness-110" aria-label="Create">
          <ArrowUp className="size-5" />
        </button>
      </div>
    </form>
  );
}
