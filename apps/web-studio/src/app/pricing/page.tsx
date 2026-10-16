'use client';

import { useState } from 'react';
import { Check, Coins, Sparkles } from 'lucide-react';
import { CREDIT_PACKS, PLANS } from '@/lib/catalog/site';
import { actions, useStore } from '@/lib/store';
import { cn, formatCredits } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const FAQ = [
  { q: 'What is a credit?', a: 'Credits are Wilo’s single currency. An image costs 1–3 credits; video costs credits per second depending on the model.' },
  { q: 'Do unused credits roll over?', a: 'Monthly plan credits reset each billing cycle. Credit packs never expire.' },
  { q: 'Can I use generations commercially?', a: 'Yes, on any paid plan. Free generations are for personal use and carry a watermark.' },
  { q: 'What happens if a generation fails?', a: 'Credits are refunded automatically when a model returns an error or times out.' },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const plan = useStore((s) => s.plan);
  const credits = useStore((s) => s.credits);
  const [toast, setToast] = useState<string>();

  const choose = (id: string, amount: number) => {
    // Checkout is on the roadmap; this applies the plan locally so every feature can be tried.
    actions.setPlan(id, amount);
    setToast(`Switched to ${PLANS.find((p) => p.id === id)?.name} — ${formatCredits(amount)} credits added (demo checkout).`);
  };

  return (
    <div className="container py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Pricing</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Create more. Pay less per shot.</h1>
        <p className="mt-3 text-muted-foreground">
          You have <span className="font-semibold text-foreground">{formatCredits(credits)}</span> credits on the{' '}
          <span className="capitalize">{plan}</span> plan.
        </p>
        <label className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 text-sm">
          Monthly <Switch checked={annual} onCheckedChange={setAnnual} /> Annual <Badge variant="new">save 20%</Badge>
        </label>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={cn(
              'relative flex flex-col rounded-3xl border bg-surface p-6',
              p.highlight ? 'border-primary shadow-[0_0_60px_-20px_hsl(var(--primary))]' : 'border-border',
            )}
          >
            {p.highlight && <Badge variant="new" className="absolute right-5 top-5">Most popular</Badge>}
            <p className="font-display text-xl font-bold">{p.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">${annual ? p.annual : p.monthly}</span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm">
              <Coins className="size-4 text-amber-300" /> {formatCredits(p.credits)} credits
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              variant={p.highlight ? 'brand' : 'secondary'}
              disabled={plan === p.id}
              onClick={() => choose(p.id, p.credits)}
            >
              {plan === p.id ? 'Current plan' : p.monthly === 0 ? 'Start free' : `Get ${p.name}`}
            </Button>
          </div>
        ))}
      </div>

      {toast && (
        <p className="mx-auto mt-6 max-w-xl rounded-xl border border-primary/40 bg-primary/10 p-3 text-center text-sm">{toast}</p>
      )}

      <div className="mt-16 rounded-3xl border border-border bg-surface/60 p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
              <Sparkles className="size-5 text-primary" /> Credit packs
            </h2>
            <p className="text-sm text-muted-foreground">Top up anytime. Packs never expire.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {CREDIT_PACKS.map((c) => (
              <Button key={c.credits} variant="outline" onClick={() => { actions.addCredits(c.credits); setToast(`${formatCredits(c.credits)} credits added (demo checkout).`); }}>
                {formatCredits(c.credits)} credits · ${c.price}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="mb-6 text-center font-display text-2xl font-bold">Questions</h2>
        <div className="divide-y divide-border rounded-2xl border border-border">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="cursor-pointer list-none font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
