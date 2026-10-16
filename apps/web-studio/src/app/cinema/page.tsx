'use client';

import { useState } from 'react';
import { Aperture, Camera, Palette, ScanLine } from 'lucide-react';
import { Studio } from '@/components/studio/studio';
import { cn } from '@/lib/utils';

const BODIES = ['Digital cinema camera', '16mm film camera', '35mm film camera', 'IMAX large format', 'Vintage camcorder', 'Smartphone'];
const LENSES = ['Spherical prime', 'Anamorphic', 'Vintage soft-focus', 'Macro', 'Fisheye', 'Tilt-shift'];
const FOCALS = [14, 24, 35, 50, 85, 135];
const APERTURES = ['f/1.4', 'f/2.8', 'f/5.6', 'f/11'];
const GRADES = ['Natural', 'Teal & orange', 'Bleach bypass', 'Kodak warm', 'Moody low-key', 'Pastel', 'Black & white'];

function Group({ icon: Icon, label, children }: { icon: typeof Camera; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Opt({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg border px-2.5 py-1.5 text-xs transition-colors',
        active ? 'border-primary bg-primary/15' : 'border-input bg-surface text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

export default function CinemaPage() {
  const [body, setBody] = useState(BODIES[0]!);
  const [lens, setLens] = useState(LENSES[0]!);
  const [focal, setFocal] = useState(35);
  const [aperture, setAperture] = useState(APERTURES[1]!);
  const [grade, setGrade] = useState(GRADES[0]!);

  const suffix = `shot on a ${body} with a ${focal}mm ${lens.toLowerCase()} lens at ${aperture}, ${grade.toLowerCase()} color grade, cinematic`;

  return (
    <Studio
      title="Cinema Studio"
      subtitle="Choose a virtual camera, lens and grade like a cinematographer. Stack a camera move on top."
      kind="video"
      tasks={['text-to-video', 'image-to-video']}
      inputs={['prompt', 'image']}
      defaultModel="kling-2.1"
      presets
      promptSuffix={suffix}
      required={['prompt']}
      placeholder="A detective lights a cigarette under a flickering streetlamp…"
    >
      <div className="space-y-4 rounded-xl border border-border bg-background/40 p-3">
        <Group icon={Camera} label="Camera body">
          {BODIES.map((b) => (
            <Opt key={b} active={b === body} onClick={() => setBody(b)}>
              {b}
            </Opt>
          ))}
        </Group>
        <Group icon={ScanLine} label="Lens">
          {LENSES.map((l) => (
            <Opt key={l} active={l === lens} onClick={() => setLens(l)}>
              {l}
            </Opt>
          ))}
        </Group>
        <Group icon={Aperture} label="Focal length & aperture">
          {FOCALS.map((f) => (
            <Opt key={f} active={f === focal} onClick={() => setFocal(f)}>
              {f}mm
            </Opt>
          ))}
          {APERTURES.map((a) => (
            <Opt key={a} active={a === aperture} onClick={() => setAperture(a)}>
              {a}
            </Opt>
          ))}
        </Group>
        <Group icon={Palette} label="Color grade">
          {GRADES.map((g) => (
            <Opt key={g} active={g === grade} onClick={() => setGrade(g)}>
              {g}
            </Opt>
          ))}
        </Group>
        <p className="text-[11px] text-muted-foreground">Adds: “{suffix}”</p>
      </div>
    </Studio>
  );
}
