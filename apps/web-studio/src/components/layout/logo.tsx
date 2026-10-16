import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Wilo mark: a double wave forming a "W", drawn as one continuous stroke. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn('size-7', className)}>
      <defs>
        <linearGradient id="wilo-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="0.55" stopColor="#e879f9" />
          <stop offset="1" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#wilo-g)" />
      <path
        d="M6.5 10.5c1.6 6.5 3 10 4.6 10 1.9 0 2.6-7 4.9-7s3 7 4.9 7c1.6 0 3-3.5 4.6-10"
        stroke="#0b0b10"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 font-display text-lg font-bold tracking-tight', className)}>
      <LogoMark />
      <span>
        Wilo<span className="text-gradient"> AI</span>
      </span>
    </Link>
  );
}
