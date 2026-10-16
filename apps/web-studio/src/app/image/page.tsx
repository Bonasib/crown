import type { Metadata } from 'next';
import { Studio } from '@/components/studio/studio';

export const metadata: Metadata = { title: 'Create Image' };

export default function ImagePage({ searchParams }: { searchParams: { prompt?: string; model?: string } }) {
  return (
    <Studio
      title="Create Image"
      subtitle="Eight top image models behind one prompt bar. Add a reference to steer style or identity."
      kind="image"
      tasks={['text-to-image']}
      inputs={['prompt', 'image']}
      defaultModel={searchParams.model ?? 'wilo-persona'}
      initialPrompt={searchParams.prompt}
      required={['prompt']}
    />
  );
}
