'use client';

import { useMemo, useState } from 'react';
import { Coins, Dices, Loader2, Sparkles } from 'lucide-react';
import type { AppInput } from '@/lib/catalog/apps';
import { estimateCredits, getModel, MODELS, type ModelTask } from '@/lib/catalog/models';
import { getPreset, type Preset } from '@/lib/catalog/presets';
import type { GenerationRequest, MediaKind } from '@/lib/providers/types';
import type { LibraryItem } from '@/lib/store';
import { useGenerate } from '@/lib/use-generate';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ModelPicker } from './model-picker';
import { PresetPicker } from './preset-picker';
import { Results } from './results';
import { Upload } from './upload';

export interface StudioProps {
  title: string;
  subtitle?: string;
  kind: MediaKind;
  tasks: ModelTask[];
  inputs?: AppInput[];
  defaultModel?: string;
  /** Prompt template; {prompt} is replaced with the user's text. */
  template?: string;
  presets?: boolean;
  initialPreset?: string;
  appSlug?: string;
  placeholder?: string;
  /** Extra direction appended to every prompt (e.g. Cinema Studio camera settings). */
  promptSuffix?: string;
  /** Extra controls rendered above the generate button. */
  children?: React.ReactNode;
  inputLabels?: Partial<Record<AppInput, string>>;
  /** Inputs that must be filled before generating. */
  required?: AppInput[];
  initialPrompt?: string;
  /** Fixed reference image (e.g. a Persona) sent when no image is uploaded. */
  referenceImage?: string;
}

function Chips<T extends string | number>({
  label,
  options,
  value,
  onChange,
  format = String,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  format?: (v: T) => string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={String(o)}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              'rounded-lg border px-2.5 py-1.5 text-xs transition-colors',
              o === value ? 'border-primary bg-primary/15 text-foreground' : 'border-input bg-surface text-muted-foreground hover:text-foreground',
            )}
          >
            {format(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

const SURPRISE = [
  'a lone astronaut walking through a field of glowing jellyfish at dusk',
  'a vintage red convertible drifting on a rain-soaked neon street in Tokyo',
  'macro shot of a hummingbird drinking from a crystal flower',
  'a fashion model in a silver trench coat on a windy rooftop, golden hour',
  'an ancient library inside a hollow tree, shafts of light, floating dust',
  'a perfume bottle on black sand as a wave crashes in slow motion',
];

export function Studio({
  title,
  subtitle,
  kind,
  tasks,
  inputs = ['prompt', 'image'],
  defaultModel,
  template,
  presets = false,
  initialPreset,
  appSlug,
  placeholder = 'Describe what you want to create…',
  promptSuffix,
  children,
  inputLabels = {},
  required = [],
  initialPrompt = '',
  referenceImage,
}: StudioProps) {
  const models = useMemo(() => MODELS.filter((m) => m.tasks.some((t) => tasks.includes(t))), [tasks]);
  const [modelId, setModelId] = useState(defaultModel && getModel(defaultModel) ? defaultModel : models[0]!.id);
  const model = getModel(modelId) ?? models[0]!;

  const [prompt, setPrompt] = useState(initialPrompt);
  const [negative, setNegative] = useState('');
  const [showNegative, setShowNegative] = useState(false);
  const [image, setImage] = useState<string>();
  const [image2, setImage2] = useState<string>();
  const [video, setVideo] = useState<string>();
  const [audio, setAudio] = useState<string>();
  const [preset, setPreset] = useState<Preset | undefined>(initialPreset ? getPreset(initialPreset) : undefined);
  const [ratio, setRatio] = useState(model.aspectRatios?.[0]);
  const [duration, setDuration] = useState(model.durations?.[0]);
  const [resolution, setResolution] = useState(model.resolutions?.[0]);
  const [count, setCount] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const generate = useGenerate();

  const selectModel = (id: string) => {
    const m = getModel(id);
    if (!m) return;
    setModelId(id);
    if (!ratio || !m.aspectRatios?.includes(ratio)) setRatio(m.aspectRatios?.[0]);
    if (!duration || !m.durations?.includes(duration)) setDuration(m.durations?.[0]);
    if (!resolution || !m.resolutions?.includes(resolution)) setResolution(m.resolutions?.[0]);
    setCount((c) => Math.min(c, m.maxCount ?? 1));
  };

  const cost = estimateCredits(model, { duration, count });
  const needs = (i: AppInput) => inputs.includes(i);
  const values: Record<AppInput, string | undefined> = { prompt: prompt.trim() || undefined, image, image2, video, audio };
  const missing = required.some((r) => !values[r]);
  const canSubmit = !busy && !missing;

  const finalPrompt = () => {
    const base = template ? template.replace('{prompt}', prompt.trim()) : prompt.trim();
    return [base, preset?.prompt, promptSuffix].filter(Boolean).join(', ').replace(/\s+,/g, ',').trim();
  };

  const submit = async () => {
    setError(undefined);
    setBusy(true);
    const req: GenerationRequest = {
      kind: model.kind,
      modelId: model.id,
      prompt: finalPrompt(),
      negativePrompt: negative || undefined,
      image: image ?? referenceImage,
      references: image2 ? [image2] : undefined,
      video,
      audio,
      aspectRatio: ratio,
      duration,
      resolution,
      count: count > 1 ? count : undefined,
      presetId: preset?.slug,
    };
    const err = await generate(req, { credits: cost, presetSlug: preset?.slug, appSlug });
    setBusy(false);
    if (err) setError(err);
  };

  const filter = (i: LibraryItem) => (appSlug ? i.appSlug === appSlug : !i.appSlug && models.some((m) => m.id === i.modelId));

  return (
    <div className="container grid gap-6 py-6 lg:grid-cols-[380px_1fr]">
      <aside className="space-y-5 rounded-2xl border border-border bg-surface/60 p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <div>
          <h1 className="font-display text-xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {models.length > 1 && <ModelPicker models={models} value={model} onChange={selectModel} />}

        {(needs('image') || needs('image2')) && (
          <div className={cn('grid gap-2', needs('image') && needs('image2') && 'grid-cols-2')}>
            {needs('image') && (
              <Upload kind="image" label={inputLabels.image ?? (kind === 'video' ? 'Start frame (optional)' : 'Reference image')} value={image} onChange={setImage} />
            )}
            {needs('image2') && <Upload kind="image" label={inputLabels.image2 ?? 'Second image'} value={image2} onChange={setImage2} />}
          </div>
        )}
        {needs('video') && <Upload kind="video" label={inputLabels.video ?? 'Source video'} value={video} onChange={setVideo} />}
        {needs('audio') && <Upload kind="audio" label={inputLabels.audio ?? 'Voice / audio track'} value={audio} onChange={setAudio} />}

        {needs('prompt') && (
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={inputLabels.prompt ?? placeholder}
                className="min-h-32 pb-9"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) void submit();
                }}
              />
              <button
                type="button"
                onClick={() => setPrompt(SURPRISE[Math.floor(Math.random() * SURPRISE.length)]!)}
                className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-elevated hover:text-foreground"
              >
                <Dices className="size-3.5" /> Surprise me
              </button>
            </div>
            {model.replicate?.params.negativePrompt || model.fal?.params.negativePrompt ? (
              <label className="flex items-center justify-between text-xs text-muted-foreground">
                Negative prompt
                <Switch checked={showNegative} onCheckedChange={setShowNegative} />
              </label>
            ) : null}
            {showNegative && (
              <Textarea value={negative} onChange={(e) => setNegative(e.target.value)} placeholder="What to avoid…" className="min-h-16" />
            )}
          </div>
        )}

        {presets && <PresetPicker value={preset} onChange={setPreset} />}

        {model.aspectRatios && ratio && <Chips label="Aspect ratio" options={model.aspectRatios} value={ratio} onChange={setRatio} format={(r) => (r === 'match_input_image' ? 'Match' : r)} />}
        {model.durations && duration && model.durations.length > 0 && (
          <Chips label="Duration" options={model.durations} value={duration} onChange={setDuration} format={(d) => `${d}s`} />
        )}
        {model.resolutions && resolution && <Chips label="Quality" options={model.resolutions} value={resolution} onChange={setResolution} />}
        {(model.maxCount ?? 1) > 1 && (
          <Chips label="Outputs" options={Array.from({ length: model.maxCount ?? 1 }, (_, i) => i + 1)} value={count} onChange={setCount} />
        )}

        {children}

        <div className="space-y-2 pt-1">
          <Button variant="brand" size="lg" className="w-full" disabled={!canSubmit} onClick={submit}>
            {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Generate
            <span className="ml-1 flex items-center gap-1 rounded-full bg-black/25 px-2 py-0.5 text-xs">
              <Coins className="size-3" /> {cost}
            </span>
          </Button>
          {missing && (
            <p className="text-center text-xs text-muted-foreground">
              Add {required.filter((r) => !values[r]).map((r) => (r === 'image2' ? 'second image' : r)).join(', ')} to continue
            </p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
          <p className="text-center text-[11px] text-muted-foreground">Ctrl/⌘ + Enter to generate · failed jobs are refunded</p>
        </div>
      </aside>

      <section className="min-w-0">
        <Results filter={filter} emptyHint="Pick a model, describe your shot and press Generate. Everything you make is saved to your Library." />
      </section>
    </div>
  );
}
