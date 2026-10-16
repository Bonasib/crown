import { cn, hash } from '@/lib/utils';

export type Motion =
  | 'none'
  | 'zoom-in'
  | 'zoom-out'
  | 'pan-left'
  | 'pan-right'
  | 'tilt-up'
  | 'tilt-down'
  | 'orbit'
  | 'shake'
  | 'spin'
  | 'drift';

const PALETTES = [
  ['#7c3aed', '#db2777', '#f59e0b'],
  ['#0ea5e9', '#6366f1', '#a855f7'],
  ['#10b981', '#06b6d4', '#3b82f6'],
  ['#f43f5e', '#f97316', '#facc15'],
  ['#8b5cf6', '#ec4899', '#22d3ee'],
  ['#14b8a6', '#84cc16', '#eab308'],
  ['#6366f1', '#0f172a', '#e879f9'],
  ['#ef4444', '#7c2d12', '#fb923c'],
  ['#1d4ed8', '#9333ea', '#f472b6'],
  ['#059669', '#164e63', '#a3e635'],
];

const MOTION_CLASS: Record<Motion, string> = {
  none: '',
  'zoom-in': 'group-hover:scale-125',
  'zoom-out': 'scale-125 group-hover:scale-100',
  'pan-left': 'scale-125 group-hover:-translate-x-[10%]',
  'pan-right': 'scale-125 group-hover:translate-x-[10%]',
  'tilt-up': 'scale-125 group-hover:-translate-y-[10%]',
  'tilt-down': 'scale-125 group-hover:translate-y-[10%]',
  orbit: 'scale-125 group-hover:rotate-6 group-hover:translate-x-[6%]',
  shake: 'group-hover:animate-[wiggle_0.25s_ease-in-out_infinite]',
  spin: 'scale-150 group-hover:rotate-45',
  drift: 'animate-drift',
};

/**
 * Procedural cover art. Every preset, app and feed item gets stable, original
 * artwork derived from its slug, and hovering previews the camera motion.
 */
export function Poster({
  seed,
  motion = 'none',
  className,
  label,
}: {
  seed: string;
  motion?: Motion;
  className?: string;
  label?: string;
}) {
  const h = hash(seed);
  const pal = PALETTES[h % PALETTES.length]!;
  const a = (h >> 4) % 360;
  const x1 = 15 + ((h >> 8) % 70);
  const y1 = 15 + ((h >> 12) % 70);
  const x2 = 15 + ((h >> 16) % 70);
  const y2 = 15 + ((h >> 20) % 70);
  const shape = (h >> 24) % 4;

  return (
    <div className={cn('relative overflow-hidden bg-surface', className)} aria-label={label} role={label ? 'img' : undefined}>
      <div
        className={cn('absolute inset-0 transition-transform [transition-duration:1600ms] ease-out', MOTION_CLASS[motion])}
        style={{
          background: `radial-gradient(circle at ${x1}% ${y1}%, ${pal[0]} 0%, transparent 45%),
            radial-gradient(circle at ${x2}% ${y2}%, ${pal[1]} 0%, transparent 50%),
            linear-gradient(${a}deg, ${pal[2]}55, #0b0b10 75%)`,
        }}
      >
        {shape === 0 && (
          <div
            className="absolute left-1/2 top-[58%] h-[70%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-t-full opacity-70 blur-[1px]"
            style={{ background: `linear-gradient(to bottom, ${pal[1]}, #0b0b10)` }}
          />
        )}
        {shape === 1 && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1/3 opacity-80"
            style={{ background: `linear-gradient(to top, #0b0b10, ${pal[0]}66)`, clipPath: 'polygon(0 60%, 20% 20%, 38% 55%, 60% 5%, 80% 45%, 100% 15%, 100% 100%, 0 100%)' }}
          />
        )}
        {shape === 2 && (
          <div
            className="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
            style={{ background: `radial-gradient(circle at 35% 35%, #fff8, ${pal[0]} 40%, #0b0b10 80%)` }}
          />
        )}
        {shape === 3 && (
          <div
            className="absolute inset-x-[20%] bottom-[10%] top-[30%] rounded-2xl opacity-60"
            style={{ background: `linear-gradient(160deg, ${pal[2]}, ${pal[1]} 60%, transparent)`, transform: 'perspective(400px) rotateX(18deg)' }}
          />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent_55%,rgba(0,0,0,0.55))]" />
    </div>
  );
}
