'use client';

import { useState } from 'react';
import { Studio } from '@/components/studio/studio';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LipsyncPage() {
  const [mode, setMode] = useState<'avatar' | 'dub'>('avatar');
  return (
    <>
      <div className="container pt-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <TabsList>
            <TabsTrigger value="avatar">Talking photo</TabsTrigger>
            <TabsTrigger value="dub">Dub a video</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {mode === 'avatar' ? (
        <Studio
          key="avatar"
          title="Lip Sync Studio"
          subtitle="One portrait + a voice track = a presenter that talks, blinks and gestures. Need a voice? Make one in Audio."
          kind="video"
          tasks={['avatar']}
          inputs={['image', 'audio']}
          required={['image', 'audio']}
          inputLabels={{ image: 'Portrait photo', audio: 'Voice track' }}
        />
      ) : (
        <Studio
          key="dub"
          title="Lip Sync Studio"
          subtitle="Re-sync any clip to new speech — translations, re-takes or memes."
          kind="video"
          tasks={['lipsync']}
          inputs={['video', 'audio']}
          required={['video', 'audio']}
          inputLabels={{ video: 'Video with a face', audio: 'New speech' }}
        />
      )}
    </>
  );
}
