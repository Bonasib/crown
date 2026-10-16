'use client';

import { useState } from 'react';
import { Studio } from '@/components/studio/studio';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AudioPage() {
  const [mode, setMode] = useState<'speech' | 'music'>('speech');
  return (
    <>
      <div className="container pt-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <TabsList>
            <TabsTrigger value="speech">Voiceover</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {mode === 'speech' ? (
        <Studio
          key="speech"
          title="Voiceover"
          subtitle="Expressive, multilingual text-to-speech for ads, explainers and avatars."
          kind="audio"
          tasks={['speech']}
          inputs={['prompt']}
          required={['prompt']}
          placeholder="Type the script to be spoken…"
        />
      ) : (
        <Studio
          key="music"
          title="Music"
          subtitle="Describe a genre, mood and instruments to get a full track."
          kind="audio"
          tasks={['music']}
          inputs={['prompt']}
          required={['prompt']}
          placeholder="Upbeat synthwave, driving bass, 110 bpm, female vocals about city lights…"
        />
      )}
    </>
  );
}
