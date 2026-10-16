import type { GenerationRequest, MediaKind } from '../providers/types';

/** How a request field maps onto one provider's model input. */
export interface ParamMap {
  prompt?: string;
  negativePrompt?: string;
  image?: string;
  /** Send the reference image as a one-item array. */
  imageArray?: boolean;
  endImage?: string;
  audio?: string;
  video?: string;
  aspectRatio?: string;
  duration?: string;
  /** Send the duration as a string ("5") instead of a number. */
  durationAsString?: boolean;
  resolution?: string;
  count?: string;
  seed?: string;
}

export interface ProviderRoute {
  /** Text-only endpoint. */
  t2x?: string;
  /** Endpoint used when a reference image / media is supplied. */
  i2x?: string;
  params: ParamMap;
  defaults?: Record<string, unknown>;
}

export type ModelTask =
  | 'text-to-image'
  | 'image-edit'
  | 'text-to-video'
  | 'image-to-video'
  | 'lipsync'
  | 'avatar'
  | 'speech'
  | 'music'
  | 'upscale'
  | 'remove-bg'
  | 'video-upscale';

export interface Model {
  id: string;
  name: string;
  vendor: string;
  kind: MediaKind;
  tasks: ModelTask[];
  blurb: string;
  badge?: 'new' | 'hot' | 'pro';
  /** Credits per output (per second for video when perSecond is set). */
  credits: number;
  perSecond?: boolean;
  aspectRatios?: string[];
  durations?: number[];
  resolutions?: string[];
  maxCount?: number;
  replicate?: ProviderRoute;
  fal?: ProviderRoute;
}

const STD_IMAGE_RATIOS = ['1:1', '3:4', '4:3', '9:16', '16:9', '2:3', '3:2', '21:9'];
const VIDEO_RATIOS = ['16:9', '9:16', '1:1'];

export const MODELS: Model[] = [
  // ───────────── Image ─────────────
  {
    id: 'wilo-persona',
    name: 'Wilo Persona',
    vendor: 'Wilo',
    kind: 'image',
    tasks: ['text-to-image'],
    blurb: 'Photoreal fashion-grade stills that keep your character consistent.',
    badge: 'hot',
    credits: 2,
    aspectRatios: STD_IMAGE_RATIOS,
    maxCount: 4,
    replicate: {
      t2x: 'black-forest-labs/flux-1.1-pro-ultra',
      params: { prompt: 'prompt', image: 'image_prompt', aspectRatio: 'aspect_ratio', seed: 'seed' },
      defaults: { raw: true, output_format: 'png' },
    },
    fal: {
      t2x: 'fal-ai/flux-pro/v1.1-ultra',
      params: { prompt: 'prompt', image: 'image_url', aspectRatio: 'aspect_ratio', count: 'num_images', seed: 'seed' },
      defaults: { raw: true },
    },
  },
  {
    id: 'flux-1.1-pro',
    name: 'FLUX 1.1 Pro',
    vendor: 'Black Forest Labs',
    kind: 'image',
    tasks: ['text-to-image'],
    blurb: 'Fast, prompt-faithful generation with excellent composition.',
    credits: 2,
    aspectRatios: STD_IMAGE_RATIOS,
    maxCount: 4,
    replicate: {
      t2x: 'black-forest-labs/flux-1.1-pro',
      params: { prompt: 'prompt', image: 'image_prompt', aspectRatio: 'aspect_ratio', seed: 'seed' },
    },
    fal: {
      t2x: 'fal-ai/flux-pro/v1.1',
      params: { prompt: 'prompt', count: 'num_images', seed: 'seed' },
    },
  },
  {
    id: 'flux-kontext',
    name: 'FLUX Kontext',
    vendor: 'Black Forest Labs',
    kind: 'image',
    tasks: ['image-edit', 'text-to-image'],
    blurb: 'Edit any image with plain words: swap outfits, relight, restyle.',
    badge: 'pro',
    credits: 3,
    aspectRatios: ['match_input_image', ...STD_IMAGE_RATIOS],
    replicate: {
      t2x: 'black-forest-labs/flux-kontext-pro',
      params: { prompt: 'prompt', image: 'input_image', aspectRatio: 'aspect_ratio', seed: 'seed' },
    },
    fal: {
      t2x: 'fal-ai/flux-pro/kontext/text-to-image',
      i2x: 'fal-ai/flux-pro/kontext',
      params: { prompt: 'prompt', image: 'image_url', aspectRatio: 'aspect_ratio', seed: 'seed' },
    },
  },
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    vendor: 'Google',
    kind: 'image',
    tasks: ['text-to-image', 'image-edit'],
    blurb: 'Conversational multi-image editing and blending.',
    badge: 'hot',
    credits: 2,
    aspectRatios: ['match_input_image', ...STD_IMAGE_RATIOS],
    maxCount: 4,
    replicate: {
      t2x: 'google/nano-banana',
      params: { prompt: 'prompt', image: 'image_input', imageArray: true, aspectRatio: 'aspect_ratio' },
    },
    fal: {
      t2x: 'fal-ai/nano-banana',
      i2x: 'fal-ai/nano-banana/edit',
      params: { prompt: 'prompt', image: 'image_urls', imageArray: true, count: 'num_images' },
    },
  },
  {
    id: 'seedream-4',
    name: 'Seedream 4',
    vendor: 'ByteDance',
    kind: 'image',
    tasks: ['text-to-image', 'image-edit'],
    blurb: 'Up to 4K renders with strong typography and editing.',
    badge: 'new',
    credits: 2,
    aspectRatios: STD_IMAGE_RATIOS,
    resolutions: ['1K', '2K', '4K'],
    maxCount: 4,
    replicate: {
      t2x: 'bytedance/seedream-4',
      params: { prompt: 'prompt', image: 'image_input', imageArray: true, aspectRatio: 'aspect_ratio', resolution: 'size', count: 'max_images' },
    },
    fal: {
      t2x: 'fal-ai/bytedance/seedream/v4/text-to-image',
      i2x: 'fal-ai/bytedance/seedream/v4/edit',
      params: { prompt: 'prompt', image: 'image_urls', imageArray: true, count: 'num_images', seed: 'seed' },
    },
  },
  {
    id: 'imagen-4',
    name: 'Imagen 4',
    vendor: 'Google',
    kind: 'image',
    tasks: ['text-to-image'],
    blurb: 'Crisp detail and accurate text rendering.',
    credits: 2,
    aspectRatios: ['1:1', '3:4', '4:3', '9:16', '16:9'],
    replicate: { t2x: 'google/imagen-4', params: { prompt: 'prompt', aspectRatio: 'aspect_ratio' } },
    fal: { t2x: 'fal-ai/imagen4/preview', params: { prompt: 'prompt', aspectRatio: 'aspect_ratio', count: 'num_images', seed: 'seed' } },
  },
  {
    id: 'ideogram-3',
    name: 'Ideogram 3',
    vendor: 'Ideogram',
    kind: 'image',
    tasks: ['text-to-image'],
    blurb: 'Posters, logos and layouts with reliable lettering.',
    credits: 2,
    aspectRatios: STD_IMAGE_RATIOS,
    replicate: { t2x: 'ideogram-ai/ideogram-v3-turbo', params: { prompt: 'prompt', aspectRatio: 'aspect_ratio', seed: 'seed' } },
    fal: { t2x: 'fal-ai/ideogram/v3', params: { prompt: 'prompt', count: 'num_images', seed: 'seed' } },
  },
  {
    id: 'recraft-3',
    name: 'Recraft V3',
    vendor: 'Recraft',
    kind: 'image',
    tasks: ['text-to-image'],
    blurb: 'Brand-ready illustration and vector-style art.',
    credits: 2,
    aspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16'],
    replicate: { t2x: 'recraft-ai/recraft-v3', params: { prompt: 'prompt', aspectRatio: 'aspect_ratio' } },
    fal: { t2x: 'fal-ai/recraft-v3', params: { prompt: 'prompt' } },
  },

  // ───────────── Video ─────────────
  {
    id: 'wilo-motion',
    name: 'Wilo Motion',
    vendor: 'Wilo',
    kind: 'video',
    tasks: ['text-to-video', 'image-to-video'],
    blurb: 'Cinematic camera moves tuned for every Wilo motion preset.',
    badge: 'hot',
    credits: 6,
    perSecond: true,
    aspectRatios: VIDEO_RATIOS,
    durations: [5, 10],
    resolutions: ['720p', '1080p'],
    replicate: {
      t2x: 'bytedance/seedance-1-pro',
      params: { prompt: 'prompt', image: 'image', aspectRatio: 'aspect_ratio', duration: 'duration', resolution: 'resolution', seed: 'seed' },
      defaults: { camera_fixed: false },
    },
    fal: {
      t2x: 'fal-ai/bytedance/seedance/v1/pro/text-to-video',
      i2x: 'fal-ai/bytedance/seedance/v1/pro/image-to-video',
      params: { prompt: 'prompt', image: 'image_url', aspectRatio: 'aspect_ratio', duration: 'duration', durationAsString: true, resolution: 'resolution', seed: 'seed' },
    },
  },
  {
    id: 'kling-2.1',
    name: 'Kling 2.1 Master',
    vendor: 'Kuaishou',
    kind: 'video',
    tasks: ['text-to-video', 'image-to-video'],
    blurb: 'Fluid motion and strong physics for human action.',
    badge: 'pro',
    credits: 10,
    perSecond: true,
    aspectRatios: VIDEO_RATIOS,
    durations: [5, 10],
    replicate: {
      t2x: 'kwaivgi/kling-v2.1-master',
      params: { prompt: 'prompt', negativePrompt: 'negative_prompt', image: 'start_image', aspectRatio: 'aspect_ratio', duration: 'duration' },
    },
    fal: {
      t2x: 'fal-ai/kling-video/v2.1/master/text-to-video',
      i2x: 'fal-ai/kling-video/v2.1/master/image-to-video',
      params: { prompt: 'prompt', negativePrompt: 'negative_prompt', image: 'image_url', aspectRatio: 'aspect_ratio', duration: 'duration', durationAsString: true },
    },
  },
  {
    id: 'veo-3',
    name: 'Veo 3',
    vendor: 'Google',
    kind: 'video',
    tasks: ['text-to-video', 'image-to-video'],
    blurb: 'Native audio, dialogue and sound effects in one pass.',
    badge: 'new',
    credits: 25,
    perSecond: true,
    aspectRatios: ['16:9', '9:16'],
    durations: [8],
    resolutions: ['720p', '1080p'],
    replicate: {
      t2x: 'google/veo-3',
      params: { prompt: 'prompt', negativePrompt: 'negative_prompt', image: 'image', aspectRatio: 'aspect_ratio', resolution: 'resolution', seed: 'seed' },
    },
    fal: {
      t2x: 'fal-ai/veo3',
      i2x: 'fal-ai/veo3/image-to-video',
      params: { prompt: 'prompt', negativePrompt: 'negative_prompt', image: 'image_url', aspectRatio: 'aspect_ratio', resolution: 'resolution', seed: 'seed' },
    },
  },
  {
    id: 'sora-2',
    name: 'Sora 2',
    vendor: 'OpenAI',
    kind: 'video',
    tasks: ['text-to-video', 'image-to-video'],
    blurb: 'Long, coherent shots with synchronized sound.',
    badge: 'new',
    credits: 20,
    perSecond: true,
    aspectRatios: ['16:9', '9:16'],
    durations: [4, 8, 12],
    replicate: {
      t2x: 'openai/sora-2',
      params: { prompt: 'prompt', image: 'input_reference', duration: 'seconds' },
    },
    fal: {
      t2x: 'fal-ai/sora-2/text-to-video',
      i2x: 'fal-ai/sora-2/image-to-video',
      params: { prompt: 'prompt', image: 'image_url', aspectRatio: 'aspect_ratio', duration: 'duration' },
    },
  },
  {
    id: 'seedance-1-pro',
    name: 'Seedance 1 Pro',
    vendor: 'ByteDance',
    kind: 'video',
    tasks: ['text-to-video', 'image-to-video'],
    blurb: 'Multi-shot storytelling with stable subjects.',
    credits: 6,
    perSecond: true,
    aspectRatios: ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'],
    durations: [5, 10],
    resolutions: ['480p', '1080p'],
    replicate: {
      t2x: 'bytedance/seedance-1-pro',
      params: { prompt: 'prompt', image: 'image', aspectRatio: 'aspect_ratio', duration: 'duration', resolution: 'resolution', seed: 'seed' },
    },
    fal: {
      t2x: 'fal-ai/bytedance/seedance/v1/pro/text-to-video',
      i2x: 'fal-ai/bytedance/seedance/v1/pro/image-to-video',
      params: { prompt: 'prompt', image: 'image_url', aspectRatio: 'aspect_ratio', duration: 'duration', durationAsString: true, resolution: 'resolution', seed: 'seed' },
    },
  },
  {
    id: 'hailuo-02',
    name: 'Hailuo 02',
    vendor: 'MiniMax',
    kind: 'video',
    tasks: ['text-to-video', 'image-to-video'],
    blurb: 'Great value 1080p with sharp instruction following.',
    credits: 5,
    perSecond: true,
    durations: [6, 10],
    resolutions: ['768p', '1080p'],
    replicate: {
      t2x: 'minimax/hailuo-02',
      params: { prompt: 'prompt', image: 'first_frame_image', duration: 'duration', resolution: 'resolution' },
    },
    fal: {
      t2x: 'fal-ai/minimax/hailuo-02/standard/text-to-video',
      i2x: 'fal-ai/minimax/hailuo-02/standard/image-to-video',
      params: { prompt: 'prompt', image: 'image_url', duration: 'duration', durationAsString: true },
    },
  },
  {
    id: 'wan-2.2',
    name: 'Wan 2.2',
    vendor: 'Alibaba',
    kind: 'video',
    tasks: ['text-to-video', 'image-to-video'],
    blurb: 'Open-weights speed king for quick drafts.',
    credits: 3,
    perSecond: true,
    aspectRatios: ['16:9', '9:16'],
    durations: [5],
    resolutions: ['480p', '720p'],
    replicate: {
      t2x: 'wan-video/wan-2.2-t2v-fast',
      i2x: 'wan-video/wan-2.2-i2v-fast',
      params: { prompt: 'prompt', image: 'image', aspectRatio: 'aspect_ratio', resolution: 'resolution', seed: 'seed' },
    },
    fal: {
      t2x: 'fal-ai/wan/v2.2-a14b/text-to-video',
      i2x: 'fal-ai/wan/v2.2-a14b/image-to-video',
      params: { prompt: 'prompt', negativePrompt: 'negative_prompt', image: 'image_url', aspectRatio: 'aspect_ratio', resolution: 'resolution', seed: 'seed' },
    },
  },
  {
    id: 'ray-2',
    name: 'Ray 2',
    vendor: 'Luma',
    kind: 'video',
    tasks: ['text-to-video', 'image-to-video'],
    blurb: 'Natural camera work and lifelike lighting.',
    credits: 8,
    perSecond: true,
    aspectRatios: ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'],
    durations: [5, 9],
    replicate: {
      t2x: 'luma/ray-2-720p',
      params: { prompt: 'prompt', image: 'start_image', endImage: 'end_image', aspectRatio: 'aspect_ratio', duration: 'duration' },
    },
    fal: {
      t2x: 'fal-ai/luma-dream-machine/ray-2',
      i2x: 'fal-ai/luma-dream-machine/ray-2/image-to-video',
      params: { prompt: 'prompt', image: 'image_url', endImage: 'end_image_url', aspectRatio: 'aspect_ratio', duration: 'duration', durationAsString: true },
    },
  },

  // ───────────── Audio / avatars / utility ─────────────
  {
    id: 'lipsync-2',
    name: 'Lipsync 2',
    vendor: 'Sync Labs',
    kind: 'video',
    tasks: ['lipsync'],
    blurb: 'Dub any video to new speech with natural mouth shapes.',
    credits: 4,
    perSecond: true,
    replicate: { t2x: 'sync/lipsync-2', params: { video: 'video', audio: 'audio' } },
    fal: { t2x: 'fal-ai/sync-lipsync/v2', params: { video: 'video_url', audio: 'audio_url' } },
  },
  {
    id: 'omnihuman',
    name: 'OmniHuman',
    vendor: 'ByteDance',
    kind: 'video',
    tasks: ['avatar'],
    blurb: 'Turn one photo and a voice track into a talking presenter.',
    badge: 'new',
    credits: 8,
    perSecond: true,
    replicate: { t2x: 'bytedance/omni-human', params: { image: 'image', audio: 'audio' } },
    fal: { t2x: 'fal-ai/bytedance/omnihuman', params: { image: 'image_url', audio: 'audio_url' } },
  },
  {
    id: 'speech-02-hd',
    name: 'Speech 02 HD',
    vendor: 'MiniMax',
    kind: 'audio',
    tasks: ['speech'],
    blurb: 'Expressive multilingual voiceover from text.',
    credits: 1,
    replicate: { t2x: 'minimax/speech-02-hd', params: { prompt: 'text' }, defaults: { voice_id: 'Wise_Woman', emotion: 'auto' } },
    fal: { t2x: 'fal-ai/minimax/speech-02-hd', params: { prompt: 'text' } },
  },
  {
    id: 'music-1.5',
    name: 'Music 1.5',
    vendor: 'MiniMax',
    kind: 'audio',
    tasks: ['music'],
    blurb: 'Full songs with vocals from a style prompt and lyrics.',
    credits: 4,
    replicate: { t2x: 'minimax/music-1.5', params: { prompt: 'prompt' } },
    fal: { t2x: 'fal-ai/minimax-music/v1.5', params: { prompt: 'prompt' } },
  },
  {
    id: 'crisp-upscale',
    name: 'Crisp Upscale',
    vendor: 'Recraft',
    kind: 'image',
    tasks: ['upscale'],
    blurb: 'Sharpen and enlarge images without plastic artifacts.',
    credits: 1,
    replicate: { t2x: 'recraft-ai/recraft-crisp-upscale', params: { image: 'image' } },
    fal: { t2x: 'fal-ai/recraft/upscale/crisp', params: { image: 'image_url' } },
  },
  {
    id: 'remove-bg',
    name: 'Background Remover',
    vendor: 'Bria',
    kind: 'image',
    tasks: ['remove-bg'],
    blurb: 'Clean cut-outs with soft hair edges.',
    credits: 1,
    replicate: { t2x: 'bria/remove-background', params: { image: 'image' } },
    fal: { t2x: 'fal-ai/bria/background/remove', params: { image: 'image_url' } },
  },
  {
    id: 'video-upscale',
    name: 'Video Upscale',
    vendor: 'Topaz',
    kind: 'video',
    tasks: ['video-upscale'],
    blurb: 'Upscale clips to 4K and smooth to 60 fps.',
    credits: 3,
    perSecond: true,
    replicate: { t2x: 'topazlabs/video-upscale', params: { video: 'video' } },
    fal: { t2x: 'fal-ai/topaz/upscale/video', params: { video: 'video_url' } },
  },
];

export function getModel(id: string) {
  return MODELS.find((m) => m.id === id);
}

export function modelsFor(task: ModelTask) {
  return MODELS.filter((m) => m.tasks.includes(task));
}

/** Translate a generic request into the provider-specific endpoint + input payload. */
export function buildProviderCall(model: Model, provider: 'replicate' | 'fal', req: GenerationRequest) {
  const route = model[provider];
  if (!route) throw new Error(`${model.name} is not available on ${provider}`);
  const hasMedia = Boolean(req.image || req.video);
  const endpoint = (hasMedia && route.i2x) || route.t2x;
  if (!endpoint) throw new Error(`${model.name} has no ${provider} endpoint`);

  const p = route.params;
  const input: Record<string, unknown> = { ...route.defaults };
  const set = (key: string | undefined, value: unknown) => {
    if (key && value !== undefined && value !== '' && value !== null) input[key] = value;
  };
  set(p.prompt, req.prompt);
  set(p.negativePrompt, req.negativePrompt);
  if (req.image) set(p.image, p.imageArray ? [req.image, ...(req.references ?? [])] : req.image);
  // Single-image models get the second reference as their end frame when they support one.
  set(p.endImage, req.endImage ?? (p.imageArray ? undefined : req.references?.[0]));
  set(p.audio, req.audio);
  set(p.video, req.video);
  set(p.aspectRatio, req.aspectRatio);
  if (req.duration !== undefined) set(p.duration, p.durationAsString ? String(req.duration) : req.duration);
  set(p.resolution, req.resolution);
  if (req.count && req.count > 1) set(p.count, req.count);
  set(p.seed, req.seed);
  return { endpoint, input };
}

export function estimateCredits(model: Model, req: Pick<GenerationRequest, 'duration' | 'count'>) {
  const units = model.perSecond ? (req.duration ?? model.durations?.[0] ?? 5) : 1;
  return model.credits * units * Math.max(1, req.count ?? 1);
}
