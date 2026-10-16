'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, Coins, Library, Menu, X } from 'lucide-react';
import { NAV } from '@/lib/catalog/site';
import { useStore } from '@/lib/store';
import { cn, formatCredits } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { NavIcon } from './icons';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const credits = useStore((s) => s.credits);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/75 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpen(null)}>
          {NAV.map((group) => (
            <div key={group.label} className="relative" onMouseEnter={() => setOpen(group.label)}>
              <Link
                href={group.href}
                className={cn(
                  'flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
                  (open === group.label || pathname.startsWith(group.href)) && 'text-foreground',
                )}
                aria-expanded={open === group.label}
                onFocus={() => setOpen(group.label)}
              >
                {group.label}
                <ChevronDown className="size-3.5 opacity-60" />
              </Link>
              {open === group.label && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="grid w-[460px] grid-cols-1 gap-1 rounded-2xl border border-border bg-surface p-2 shadow-2xl animate-in fade-in-0 slide-in-from-top-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.href + item.label}
                        href={item.href}
                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-elevated"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-elevated text-primary transition-colors group-hover:bg-brand group-hover:text-white">
                          <NavIcon name={item.icon} className="size-4" />
                        </span>
                        <span>
                          <span className="flex items-center gap-2 text-sm font-medium">
                            {item.label}
                            {item.badge && <Badge variant={item.badge}>{item.badge}</Badge>}
                          </span>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link href="/pricing" className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/pricing"
            className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium sm:flex"
            title="Credit balance"
          >
            <Coins className="size-3.5 text-amber-300" />
            {formatCredits(credits)}
          </Link>
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Library">
            <Link href="/library">
              <Library />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="brand" size="sm">
            <Link href="/pricing">Upgrade</Link>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobile((m) => !m)} aria-label="Menu">
            {mobile ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobile && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-background lg:hidden">
          <div className="container space-y-6 py-6">
            {NAV.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map((item) => (
                    <Link key={item.href + item.label} href={item.href} className="flex items-center gap-2 rounded-xl bg-surface p-3 text-sm">
                      <NavIcon name={item.icon} className="size-4 text-primary" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 text-sm">
              <Link href="/pricing" className="rounded-xl bg-surface p-3 text-center">Pricing</Link>
              <Link href="/library" className="rounded-xl bg-surface p-3 text-center">Library</Link>
              <Link href="/login" className="rounded-xl bg-surface p-3 text-center">Sign in</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
