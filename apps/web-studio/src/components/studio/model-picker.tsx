'use client';

import { Check, ChevronDown, Coins } from 'lucide-react';
import type { Model } from '@/lib/catalog/models';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function ModelPicker({ models, value, onChange }: { models: Model[]; value: Model; onChange: (id: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl border border-input bg-surface px-3 py-2.5 text-left text-sm transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-xs font-bold text-white">
          {value.name.slice(0, 2)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{value.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{value.vendor}</span>
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width] min-w-72">
        <DropdownMenuLabel>Model</DropdownMenuLabel>
        {models.map((m) => (
          <DropdownMenuItem key={m.id} onSelect={() => onChange(m.id)} className="items-start">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-elevated text-xs font-bold">{m.name.slice(0, 2)}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 font-medium">
                {m.name}
                {m.badge && <Badge variant={m.badge}>{m.badge}</Badge>}
              </span>
              <span className="block text-xs text-muted-foreground">{m.blurb}</span>
              <span className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Coins className="size-3 text-amber-300" />
                {m.credits}
                {m.perSecond ? ' / sec' : ' / output'} · {m.vendor}
              </span>
            </span>
            {m.id === value.id && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
