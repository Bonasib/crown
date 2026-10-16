import Link from 'next/link';
import { ArrowRight, Clapperboard, Film, Image as ImageIcon, Megaphone, Mic, Move3d, UserRound, Wand2 } from 'lucide-react';
import { APPS } from '@/lib/catalog/apps';
import { COMMUNITY } from '@/lib/catalog/community';
import { MODELS } from '@/lib/catalog/models';
import { PRESETS } from '@/lib/catalog/presets';
import { PLANS } from '@/lib/catalog/site';
import { HeroPrompt } from '@/components/layout/hero-prompt';
import { Poster } from '@/components/media/poster';
import { PresetCard } from '@/components/studio/preset-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TOOLS = [
  { title: 'Create Video', href: '/video', icon: Clapperboard, blurb: 'Kling, Veo, Sora, Seedance & more', badge: 'hot' as const },
  { title: 'Create Image', href: '/image', icon: ImageIcon, blurb: 'Photoreal stills in seconds' },
  { title: 'Motion Presets', href: '/presets', icon: Move3d, blurb: `${PRESETS.length} pro camera moves & VFX` },
  { title: 'Persona', href: '/character', icon: UserRound, blurb: 'Your character, consistent everywhere', badge: 'new' as const },
  { title: 'Edit Image', href: '/edit', icon: Wand2, blurb: 'Change anything with words' },
  { title: 'Lip Sync', href: '/lipsync', icon: Mic, blurb: 'Talking photos & dubbing' },
  { title: 'Cinema Studio', href: '/cinema', icon: Film, blurb: 'Lens, body & grade controls' },
  { title: 'Ad Studio', href: '/ads', icon: Megaphone, blurb: 'Product photo to video ad', badge: 'new' as const },
];

const STEPS = [
  { n: '01', title: 'Describe or upload', body: 'Start from a prompt, a product shot, a selfie or a sketch.' },
  { n: '02', title: 'Pick a move', body: 'Choose a model and stack a camera preset, app or cinema look.' },
  { n: '03', title: 'Generate & remix', body: 'Get results in seconds, then upscale, lip sync or turn them into ads.' },
];

export default function HomePage() {
  const featuredPresets = PRESETS.filter((p) => p.badge).concat(PRESETS.filter((p) => !p.badge)).slice(0, 16);
  const featuredApps = APPS.filter((a) => a.badge === 'hot').slice(0, 8);
  const studio = PLANS.find((p) => p.highlight)!;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 gap-2 opacity-40 md:grid-cols-6">
          {Array.from({ length: 12 }, (_, i) => (
            <Poster key={i} seed={`hero-${i}`} motion="drift" className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="container relative flex flex-col items-center py-24 text-center md:py-36">
          <Badge variant="outline" className="mb-6 bg-background/60 backdrop-blur">
            <span className="size-1.5 rounded-full bg-accent" /> New: Cinema Studio & Ad Studio
          </Badge>
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Direct <span className="text-gradient">blockbuster</span> shots with one sentence
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Wilo puts every top video and image model, {PRESETS.length} motion presets and {APPS.length} one-click apps in one studio.
          </p>
          <div className="mt-10 w-full">
            <HeroPrompt />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            {['Orbit 360', 'Vertigo Zoom', 'Ignite', 'Planet Pull', 'Drone Dive'].map((t) => (
              <Link key={t} href={`/presets/${t.toLowerCase().replace(/ /g, '-')}`} className="rounded-full border border-border bg-surface/80 px-3 py-1 hover:text-foreground">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold">Everything you need to create</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="group relative overflow-hidden rounded-3xl border border-border bg-surface">
              <Poster seed={`tool-${t.href}`} motion="zoom-in" className="aspect-[4/3]" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4">
                <span className="mb-auto grid size-9 place-items-center rounded-xl bg-black/50 backdrop-blur">
                  <t.icon className="size-4" />
                </span>
                <p className="flex items-center gap-2 font-semibold">
                  {t.title} {t.badge && <Badge variant={t.badge}>{t.badge}</Badge>}
                </p>
                <p className="text-xs text-muted-foreground">{t.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Presets marquee */}
      <section className="border-y border-border bg-surface/40 py-16">
        <div className="container mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Motion presets</p>
            <h2 className="mt-1 font-display text-3xl font-bold">Hollywood camera work, one tap</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/presets">
              Browse all {PRESETS.length} <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
            {[...featuredPresets, ...featuredPresets].map((p, i) => (
              <Link key={`${p.slug}-${i}`} href={`/presets/${p.slug}`} className="w-40 shrink-0 md:w-48">
                <PresetCard preset={p} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Models */}
      <section className="container py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Every frontier model, one credit balance</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {MODELS.filter((m) => m.tasks.some((t) => t.startsWith('text-to'))).map((m) => (
            <Link key={m.id} href="/models" className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
              {m.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Apps */}
      <section className="container pb-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Apps</p>
            <h2 className="mt-1 font-display text-3xl font-bold">Viral formats, zero prompting</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/apps">
              All {APPS.length} apps <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featuredApps.map((a) => (
            <Link key={a.slug} href={`/apps/${a.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-surface">
              <Poster seed={a.slug} motion="zoom-in" className="aspect-square" />
              <div className="p-3">
                <p className="text-sm font-semibold">{a.name}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{a.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-surface/40 py-16">
        <div className="container grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-3xl border border-border bg-background/60 p-6">
              <p className="font-display text-4xl font-bold text-gradient">{s.n}</p>
              <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold">Made on Wilo</h2>
          <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground">
            Explore community →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {COMMUNITY.slice(0, 12).map((p) => (
            <Link key={p.id} href="/explore" className="group overflow-hidden rounded-2xl">
              <Poster seed={p.id + p.title} motion="zoom-in" className="aspect-[3/4]" label={p.title} />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-border p-10 text-center md:p-16">
          <Poster seed="cta" motion="drift" className="absolute inset-0 opacity-60" />
          <div className="absolute inset-0 bg-background/60" />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold">Start free. Go Studio when you’re hooked.</h2>
            <p className="mt-3 text-muted-foreground">
              {studio.name} is ${studio.annual}/mo with {studio.credits.toLocaleString('en-US')} credits and every model.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="brand" size="lg">
                <Link href="/video">Create for free</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
