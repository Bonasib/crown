import type { ModelTask } from './models';
import { slugify } from './presets';

export type AppCategory =
  | 'pro'
  | 'transitions'
  | 'enhance'
  | 'identity'
  | 'editing'
  | 'ads'
  | 'characters'
  | 'fun';

export const APP_CATEGORIES: { id: AppCategory; label: string }[] = [
  { id: 'pro', label: 'Professional' },
  { id: 'ads', label: 'Ads & Products' },
  { id: 'identity', label: 'Face & Identity' },
  { id: 'enhance', label: 'Enhance & Style' },
  { id: 'editing', label: 'Video Editing' },
  { id: 'transitions', label: 'Transitions' },
  { id: 'characters', label: 'Games & Characters' },
  { id: 'fun', label: 'Just for Fun' },
];

export type AppInput = 'prompt' | 'image' | 'image2' | 'video' | 'audio';

export interface WiloApp {
  slug: string;
  name: string;
  category: AppCategory;
  blurb: string;
  task: ModelTask;
  /** Prompt template; {prompt} is replaced with the user's text. */
  template: string;
  inputs: AppInput[];
  defaultModel: string;
  badge?: 'new' | 'hot' | 'pro';
}

const app = (
  name: string,
  category: AppCategory,
  task: ModelTask,
  defaultModel: string,
  inputs: AppInput[],
  blurb: string,
  template: string,
  badge?: WiloApp['badge'],
): WiloApp => ({ slug: slugify(name), name, category, task, defaultModel, inputs, blurb, template, badge });

export const APPS: WiloApp[] = [
  // Professional
  app('Storyboard', 'pro', 'text-to-image', 'nano-banana', ['prompt', 'image'], 'Turn one idea into an 8-frame consistent storyboard.', 'cinematic storyboard panel, consistent characters and wardrobe, {prompt}', 'hot'),
  app('Multi-Angle', 'pro', 'image-edit', 'nano-banana', ['image', 'prompt'], 'Get new camera angles of the same scene from a single photo.', 'same scene and subject from a new camera angle: {prompt}'),
  app('Shot List', 'pro', 'image-edit', 'seedream-4', ['image', 'prompt'], 'Wide, medium and close-up coverage generated in one go.', 'film coverage of this scene, {prompt}'),
  app('Relight', 'pro', 'image-edit', 'flux-kontext', ['image', 'prompt'], 'Change the lighting of any photo after the fact.', 'relight the scene: {prompt}, keep subject identical'),
  app('Headshot Studio', 'pro', 'image-edit', 'flux-kontext', ['image'], 'Studio-grade professional headshots from a selfie.', 'professional corporate headshot, soft studio lighting, neutral backdrop, same person {prompt}', 'hot'),

  // Ads & products
  app('Link to Ad', 'ads', 'image-to-video', 'veo-3', ['image', 'prompt'], 'Product photo + one line → a ready-to-post video ad.', 'premium commercial for this product, dynamic camera, studio lighting, {prompt}', 'hot'),
  app('Packshot', 'ads', 'image-edit', 'flux-kontext', ['image'], 'E-commerce packshots on clean seamless backgrounds.', 'clean e-commerce packshot on seamless background, soft shadow {prompt}'),
  app('Giant Product', 'ads', 'image-to-video', 'wilo-motion', ['image', 'prompt'], 'Your product towering over a city like a monument.', 'the product as a colossal monument in a city square, people for scale, {prompt}'),
  app('Billboard', 'ads', 'image-edit', 'nano-banana', ['image', 'prompt'], 'Place your creative on a billboard in a real-looking street.', 'this creative displayed on a large city billboard at dusk, {prompt}'),
  app('Splash Shot', 'ads', 'image-to-video', 'kling-2.1', ['image'], 'High-speed liquid splashes around your product.', 'high-speed liquid splash around the product, slow motion {prompt}'),
  app('ASMR Product', 'ads', 'image-to-video', 'veo-3', ['image', 'prompt'], 'Satisfying close-up ASMR product moments with sound.', 'satisfying ASMR close-up of the product with crisp sound, {prompt}'),
  app('UGC Creator', 'ads', 'image-to-video', 'veo-3', ['image', 'prompt'], 'A creator-style selfie video reviewing your product.', 'selfie-style UGC video, creator enthusiastically talks about the product: {prompt}', 'new'),
  app('TV Spot', 'ads', 'text-to-video', 'veo-3', ['prompt'], 'Broadcast-style 8-second TV commercial.', 'broadcast TV commercial, polished, {prompt}'),
  app('Chameleon Product', 'ads', 'image-to-video', 'wilo-motion', ['image'], 'Product shifts colors and materials in a seamless loop.', 'the product continuously changes color and material, seamless loop {prompt}'),
  app('Poster Maker', 'ads', 'text-to-image', 'ideogram-3', ['prompt'], 'Bold, typographic posters with legible text.', 'bold graphic poster with clean typography: {prompt}'),

  // Identity
  app('Recast', 'identity', 'image-edit', 'nano-banana', ['image', 'image2'], 'Put a new character into any scene, keeping the pose.', 'replace the person in the first image with the character from the second image, same pose and lighting {prompt}'),
  app('Face Swap', 'identity', 'image-edit', 'nano-banana', ['image', 'image2'], 'Swap faces between two photos naturally.', 'swap the face of the person in the first image with the face from the second image {prompt}'),
  app('Age Shift', 'identity', 'image-edit', 'flux-kontext', ['image', 'prompt'], 'See yourself younger or older.', 'same person aged to {prompt}'),
  app('Commercial Faces', 'identity', 'text-to-image', 'wilo-persona', ['prompt'], 'Diverse, model-release-free faces for campaigns.', 'commercial casting photo, natural skin, {prompt}'),

  // Enhance & style
  app('Outfit Swap', 'enhance', 'image-edit', 'flux-kontext', ['image', 'prompt'], 'Try any outfit on any photo, pose and background kept.', 'change the outfit to {prompt}, keep face, pose and background', 'hot'),
  app('Virtual Try-On', 'enhance', 'image-edit', 'nano-banana', ['image', 'image2'], 'Dress the person in the garment from a second photo.', 'dress the person in the garment from the second image {prompt}'),
  app('Skin Retouch', 'enhance', 'image-edit', 'flux-kontext', ['image'], 'Natural retouching that keeps real skin texture.', 'natural beauty retouch, keep pores and skin texture {prompt}'),
  app('Sketch to Real', 'enhance', 'image-edit', 'flux-kontext', ['image', 'prompt'], 'Turn a rough sketch into a photoreal image.', 'turn this sketch into a photorealistic image: {prompt}', 'new'),
  app('Plushify', 'enhance', 'image-edit', 'flux-kontext', ['image'], 'Turn anyone into a cute plush toy.', 'turn the subject into a soft plush toy {prompt}'),
  app('Sticker Pack', 'enhance', 'image-edit', 'nano-banana', ['image'], 'Glossy die-cut stickers of your subject.', 'glossy die-cut sticker of the subject with white border {prompt}'),
  app('Upscale', 'enhance', 'upscale', 'crisp-upscale', ['image'], 'Sharpen and enlarge images up to 4x.', '{prompt}'),
  app('Remove Background', 'enhance', 'remove-bg', 'remove-bg', ['image'], 'One-click transparent cut-outs.', '{prompt}'),

  // Editing
  app('Talking Photo', 'editing', 'avatar', 'omnihuman', ['image', 'audio'], 'Make any portrait speak your audio.', '{prompt}', 'hot'),
  app('Lip Sync', 'editing', 'lipsync', 'lipsync-2', ['video', 'audio'], 'Re-dub a video to new speech.', '{prompt}'),
  app('Video Upscale', 'editing', 'video-upscale', 'video-upscale', ['video'], 'Upscale clips to 4K.', '{prompt}'),
  app('Match Cut', 'editing', 'image-to-video', 'ray-2', ['image', 'image2'], 'Seamless match cut between two frames.', 'seamless match cut transition between the two frames {prompt}'),
  app('Breakdown', 'editing', 'image-to-video', 'wilo-motion', ['image'], 'Exploded-view breakdown of an object.', 'object separates into an exploded technical view, then reassembles {prompt}'),

  // Transitions
  app('Morph', 'transitions', 'image-to-video', 'ray-2', ['image', 'image2'], 'Morph smoothly from one image to another.', 'smooth morph from the first frame to the last frame {prompt}', 'new'),
  app('Portal Jump', 'transitions', 'image-to-video', 'wilo-motion', ['image', 'prompt'], 'Jump through a portal into a new world.', 'camera flies through a glowing portal into {prompt}'),
  app('Raining Cut', 'transitions', 'image-to-video', 'kling-2.1', ['image'], 'Liquid wipe transition between shots.', 'liquid wipe transition revealing a new scene {prompt}'),

  // Characters
  app('Game Character', 'characters', 'image-edit', 'nano-banana', ['image', 'prompt'], 'Turn yourself into a stylized game character.', 'turn the subject into a 3D video-game character, {prompt}'),
  app('Action Figure', 'characters', 'image-edit', 'nano-banana', ['image'], 'Boxed collectible action figure of you.', 'collectible action figure of the subject in retail blister packaging {prompt}', 'hot'),
  app('Anime Me', 'characters', 'image-edit', 'flux-kontext', ['image'], 'Restyle any photo as anime.', 'restyle as high-quality anime illustration {prompt}'),

  // Fun
  app('Pet Human', 'fun', 'image-edit', 'flux-kontext', ['image'], 'What your pet would look like as a person.', 'imagine this pet as a human, same personality and colors {prompt}'),
  app('Mini World', 'fun', 'image-edit', 'nano-banana', ['image'], 'Your photo as a tiny diorama.', 'turn this scene into a miniature diorama on a desk {prompt}'),
  app('Short Reel', 'fun', 'text-to-video', 'sora-2', ['prompt'], 'Viral-ready vertical reel from one sentence.', 'vertical social reel, punchy, {prompt}', 'new'),
];

export function getApp(slug: string) {
  return APPS.find((a) => a.slug === slug);
}
