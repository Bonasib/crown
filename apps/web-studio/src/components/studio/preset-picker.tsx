'use client';

import { useState } from 'react';
import { Move3d, X } from 'lucide-react';
import { PRESET_CATEGORIES, PRESETS, type Preset } from '@/lib/catalog/presets';
import { Poster } from '@/components/media/poster';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PresetCard({ preset, onClick }: { preset: Preset; onClick?: () => void }) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="group relative block w-full overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Poster seed={preset.slug} motion={preset.motion} className="aspect-[3/4] w-full" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2.5">
        <p className="text-xs font-bold uppercase tracking-wide">{preset.name}</p>
      </div>
      {preset.badge && <Badge variant={preset.badge} className="absolute left-2 top-2">{preset.badge}</Badge>}
    </Comp>
  );
}

export function PresetPicker({ value, onChange }: { value?: Preset; onChange: (p?: Preset) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <DialogTrigger className="flex flex-1 items-center gap-3 rounded-xl border border-input bg-surface p-2 text-left text-sm transition-colors hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {value ? (
            <Poster seed={value.slug} motion="drift" className="size-10 shrink-0 rounded-lg" />
          ) : (
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-elevated">
              <Move3d className="size-4 text-primary" />
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{value?.name ?? 'Choose a motion preset'}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {value ? PRESET_CATEGORIES.find((c) => c.id === value.category)?.label : 'Camera, action, VFX & looks'}
            </span>
          </span>
        </DialogTrigger>
        {value && (
          <button type="button" onClick={() => onChange(undefined)} className="rounded-full p-2 text-muted-foreground hover:bg-elevated" aria-label="Clear preset">
            <X className="size-4" />
          </button>
        )}
      </div>
      <DialogContent className="max-w-4xl">
        <DialogTitle>Motion presets</DialogTitle>
        <DialogDescription>Hover to preview the move. Presets add their direction to your prompt.</DialogDescription>
        <Tabs defaultValue="camera" className="mt-4">
          <TabsList>
            {PRESET_CATEGORIES.map((c) => (
              <TabsTrigger key={c.id} value={c.id}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {PRESET_CATEGORIES.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {PRESETS.filter((p) => p.category === c.id).map((p) => (
                <PresetCard
                  key={p.slug}
                  preset={p}
                  onClick={() => {
                    onChange(p);
                    setOpen(false);
                  }}
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
