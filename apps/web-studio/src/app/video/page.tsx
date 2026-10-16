import type { Metadata } from 'next';
import { Studio } from '@/components/studio/studio';

export const metadata: Metadata = { title: 'Create Video' };

export default function VideoPage({
  searchParams,
}: {
  searchParams: { prompt?: string; model?: string; preset?: string };
}) {
  return (
    <Studio
      title="Create Video"
      subtitle="Text or image to video. Stack a motion preset for pro camera work."
      kind="video"
      tasks={['text-to-video', 'image-to-video']}
      inputs={['prompt', 'image']}
      defaultModel={searchParams.model ?? 'wilo-motion'}
      initialPrompt={searchParams.prompt}
      initialPreset={searchParams.preset}
      presets
      required={['prompt']}
    />
  );
}
