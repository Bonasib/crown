export type MediaKind = 'image' | 'video' | 'audio';

export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface GenerationRequest {
  kind: MediaKind;
  modelId: string;
  prompt: string;
  negativePrompt?: string;
  /** Data URL or https URL of a reference / start image. */
  image?: string;
  /** Optional end frame. */
  endImage?: string;
  /** Extra reference images (multi-image models, swaps, try-on). */
  references?: string[];
  /** Data URL or https URL of an audio clip (lipsync, avatars). */
  audio?: string;
  /** Data URL or https URL of a source video (lipsync, upscale). */
  video?: string;
  aspectRatio?: string;
  duration?: number;
  resolution?: string;
  count?: number;
  seed?: number;
  presetId?: string;
}

export interface Job {
  id: string;
  status: JobStatus;
  outputs: string[];
  error?: string;
  provider: 'replicate' | 'fal' | 'demo';
}

export interface Provider {
  name: Job['provider'];
  submit(req: GenerationRequest, input: Record<string, unknown>, endpoint: string): Promise<Job>;
  poll(id: string): Promise<Job>;
}
