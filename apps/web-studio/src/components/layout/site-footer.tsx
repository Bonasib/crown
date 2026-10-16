import Link from 'next/link';
import { Github, Instagram, Twitter, Youtube } from 'lucide-react';
import { FOOTER } from '@/lib/catalog/site';
import { Logo } from './logo';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            One studio for AI images, video, voice and ads. Pick a model, pick a move, press generate.
          </p>
          <div className="flex gap-2 text-muted-foreground">
            {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
              <span key={i} className="grid size-9 place-items-center rounded-full bg-elevated">
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>
        {FOOTER.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-semibold">{col.title}</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-6">
        <div className="container flex flex-col justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Wilo AI. All rights reserved.</span>
          <span>Models are provided by their respective vendors via Replicate or fal.</span>
        </div>
      </div>
    </footer>
  );
}
