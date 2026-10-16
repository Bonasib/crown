import { APPS } from './apps';
import { PRESETS } from './presets';

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  kind: 'image' | 'video';
  ratio: 'portrait' | 'landscape' | 'square';
  likes: number;
  presetSlug?: string;
  appSlug?: string;
  modelId: string;
}

const AUTHORS = ['nova.frames', 'kai_motion', 'luzstudio', 'orbitlab', 'mira.makes', 'dex.vfx', 'tonic', 'saffron.ai', 'pixelmonk', 'reelwave'];
const TITLES = [
  'Night drift in Shibuya',
  'Chrome runner',
  'Desert prophet',
  'Perfume in the storm',
  'Neon koi',
  'Last train home',
  'Ice palace',
  'Skater at dawn',
  'Garden of glass',
  'Rooftop fashion week',
  'Lantern festival',
  'Deep sea cathedral',
  'Sunset convoy',
  'Retro arcade queen',
  'Velvet smoke',
  'Paper city',
  'Cyber monk',
  'Lighthouse keeper',
  'Golden sneakers',
  'Volcano surfer',
  'Midnight bakery',
  'Satellite lovers',
  'Thunder horse',
  'Coffee splash',
];

/** Deterministic seeded feed so the explore page looks alive without a backend. */
export const COMMUNITY: CommunityPost[] = TITLES.map((title, i) => {
  const preset = PRESETS[(i * 7) % PRESETS.length]!;
  const app = i % 4 === 0 ? APPS[(i * 3) % APPS.length] : undefined;
  return {
    id: `post-${i}`,
    author: AUTHORS[i % AUTHORS.length]!,
    title,
    kind: i % 3 === 0 ? 'image' : 'video',
    ratio: (['portrait', 'landscape', 'square'] as const)[i % 3]!,
    likes: 120 + ((i * 7919) % 9800),
    presetSlug: app ? undefined : preset.slug,
    appSlug: app?.slug,
    modelId: i % 3 === 0 ? 'wilo-persona' : ['wilo-motion', 'kling-2.1', 'veo-3', 'sora-2'][i % 4]!,
  };
});
