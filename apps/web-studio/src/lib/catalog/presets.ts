import type { Motion } from '@/components/media/poster';

export type PresetCategory = 'camera' | 'action' | 'vfx' | 'style';

export interface Preset {
  slug: string;
  name: string;
  category: PresetCategory;
  /** Appended to the user's prompt when the preset is applied. */
  prompt: string;
  motion: Motion;
  badge?: 'new' | 'hot';
}

export const PRESET_CATEGORIES: { id: PresetCategory; label: string; blurb: string }[] = [
  { id: 'camera', label: 'Camera Moves', blurb: 'Professional cinematography in one tap.' },
  { id: 'action', label: 'Action', blurb: 'Dynamic body motion for your characters.' },
  { id: 'vfx', label: 'VFX', blurb: 'Blockbuster effects without a VFX team.' },
  { id: 'style', label: 'Looks', blurb: 'Lens, film and grading treatments.' },
];

const cam = (name: string, motion: Motion, prompt: string, badge?: Preset['badge']): Preset => ({
  slug: slugify(name),
  name,
  category: 'camera',
  prompt,
  motion,
  badge,
});
const act = (name: string, prompt: string, badge?: Preset['badge']): Preset => ({
  slug: slugify(name),
  name,
  category: 'action',
  prompt,
  motion: 'shake',
  badge,
});
const vfx = (name: string, prompt: string, badge?: Preset['badge']): Preset => ({
  slug: slugify(name),
  name,
  category: 'vfx',
  prompt,
  motion: 'zoom-in',
  badge,
});
const look = (name: string, prompt: string): Preset => ({
  slug: slugify(name),
  name,
  category: 'style',
  prompt,
  motion: 'drift',
});

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const PRESETS: Preset[] = [
  // Camera — standard cinematography vocabulary.
  cam('Dolly In', 'zoom-in', 'camera dollies smoothly forward toward the subject'),
  cam('Dolly Out', 'zoom-out', 'camera dollies smoothly backward revealing the scene'),
  cam('Dolly Left', 'pan-left', 'camera tracks laterally to the left on a dolly'),
  cam('Dolly Right', 'pan-right', 'camera tracks laterally to the right on a dolly'),
  cam('Vertigo Zoom', 'zoom-in', 'dolly zoom, background stretches while subject stays the same size', 'hot'),
  cam('Snap Zoom', 'zoom-in', 'sudden aggressive zoom punch into the subject'),
  cam('Snap Pull', 'zoom-out', 'sudden aggressive zoom pulling out from the subject'),
  cam('Slow Push', 'zoom-in', 'very slow, tense push in'),
  cam('Orbit 360', 'orbit', 'camera orbits a full 360 degrees around the subject', 'hot'),
  cam('Arc Left', 'orbit', 'camera arcs around the subject to the left'),
  cam('Arc Right', 'orbit', 'camera arcs around the subject to the right'),
  cam('Frozen Moment', 'orbit', 'time freezes while the camera sweeps around the subject, bullet-time style', 'hot'),
  cam('Crane Up', 'tilt-up', 'camera rises on a crane revealing the environment'),
  cam('Crane Down', 'tilt-down', 'camera descends on a crane toward the subject'),
  cam('Overhead Sweep', 'tilt-down', 'camera sweeps overhead looking straight down'),
  cam('Tilt Up', 'tilt-up', 'camera tilts upward'),
  cam('Tilt Down', 'tilt-down', 'camera tilts downward'),
  cam('Truck Left', 'pan-left', 'camera trucks left parallel to the action'),
  cam('Truck Right', 'pan-right', 'camera trucks right parallel to the action'),
  cam('Whip Pan', 'pan-right', 'fast whip pan with motion blur'),
  cam('Handheld', 'shake', 'documentary handheld camera with natural shake'),
  cam('Dutch Tilt', 'spin', 'canted dutch angle with slow roll'),
  cam('Barrel Roll', 'spin', 'camera rolls 360 degrees on its axis', 'new'),
  cam('Drone Dive', 'tilt-down', 'FPV drone dives fast through the scene', 'new'),
  cam('Drone Reveal', 'zoom-out', 'aerial drone pulls back and up revealing a vast landscape'),
  cam('Skyward Pull', 'zoom-out', 'camera rockets upward from the subject to orbit-height view'),
  cam('Chase Cam', 'pan-right', 'low camera races alongside a fast-moving vehicle'),
  cam('Wheel Mount', 'shake', 'camera rigidly mounted to the side of a speeding car'),
  cam('Body Rig', 'shake', 'camera strapped to the actor, face locked in frame while the world moves'),
  cam('Head Follow', 'pan-right', 'camera tracks closely behind the subject’s head'),
  cam('Hero Low Angle', 'tilt-up', 'heroic low angle slowly rising'),
  cam('Through the Glass', 'zoom-in', 'camera pushes through a window into the scene'),
  cam('Keyhole Pass', 'zoom-in', 'camera passes through a small opening in the foreground'),
  cam('Eye Dive', 'zoom-in', 'extreme push into the subject’s eye'),
  cam('Robotic Arm', 'orbit', 'precise motion-control robotic arm move'),
  cam('Turntable', 'spin', 'subject rotates on a turntable while camera is static'),
  cam('Rack Focus', 'none', 'focus racks from foreground to background'),
  cam('Fisheye', 'zoom-in', 'ultra-wide fisheye lens with barrel distortion'),
  cam('Time-lapse City', 'drift', 'time-lapse of clouds and city lights'),
  cam('Time-lapse Crowd', 'drift', 'time-lapse of people flowing around a still subject'),
  cam('Locked Off', 'none', 'static tripod shot, no camera movement'),
  cam('Bounce Zoom', 'zoom-in', 'zoom in and out rhythmically like a yo-yo'),
  cam('Spiral Rise', 'spin', 'camera spirals upward around the subject'),

  // Action
  act('Sprint', 'subject sprints toward camera with powerful strides'),
  act('Flying Kick', 'subject launches a spinning flying kick'),
  act('Slam Dunk', 'subject leaps and slams a basketball dunk'),
  act('Shadow Box', 'subject throws a fast boxing combination'),
  act('Impact Punch', 'subject takes a slow-motion punch to the face'),
  act('Swagger', 'subject strikes confident rap-video poses'),
  act('Backflip', 'subject performs a clean backflip', 'new'),
  act('Dance Loop', 'subject dances a catchy looping routine', 'hot'),
  act('Hair Flip', 'subject flips hair in slow motion'),
  act('Mic Drop', 'subject drops a microphone and walks away'),

  // VFX — original names.
  vfx('Ignite', 'subject bursts into roaring flames without harm', 'hot'),
  vfx('Dust to Dust', 'subject disintegrates into drifting particles'),
  vfx('Shatter', 'scene cracks and shatters like glass'),
  vfx('Neon Glitch', 'digital glitch and RGB split distortion'),
  vfx('Bloom', 'flowers rapidly grow and blossom around the subject'),
  vfx('Lift Off', 'subject levitates and floats upward'),
  vfx('Storm Caller', 'lightning crackles from the subject’s hands', 'hot'),
  vfx('Liquid Chrome', 'subject turns into flowing liquid chrome'),
  vfx('Meltdown', 'subject melts like wax'),
  vfx('Stone Form', 'subject turns to stone from the feet up'),
  vfx('Clone Burst', 'subject splits into many clones that explode outward'),
  vfx('Color Powder', 'colored powder explodes around the subject'),
  vfx('Plasma Blast', 'energy plasma explosion radiates from the center', 'new'),
  vfx('Blast Wave', 'massive explosion behind the subject, they walk away calmly'),
  vfx('Paparazzi Flash', 'swarm of camera flashes, early-2000s red carpet'),
  vfx('Planet Pull', 'zoom out from the subject all the way to outer space', 'hot'),
  vfx('Floodgate', 'water floods the room in seconds'),
  vfx('Wings', 'feathered wings unfold from the subject’s back'),
  vfx('Invisible', 'subject fades into transparency'),
  vfx('Portal', 'a glowing portal opens and the subject steps through', 'new'),
  vfx('Kaiju', 'giant monster rises behind the city skyline'),
  vfx('Painted', 'scene transforms into an impressionist oil painting'),

  // Looks
  look('35mm Film', 'shot on 35mm film, natural grain, halation'),
  look('VHS', 'VHS tape, scan lines, washed colors'),
  look('Anamorphic', 'anamorphic lens, oval bokeh, horizontal flares'),
  look('Noir', 'black and white film noir, hard shadows'),
  look('Golden Hour', 'warm golden-hour sunlight'),
  look('Cyber Neon', 'cyberpunk neon lighting, wet streets'),
  look('Dreamy Haze', 'soft diffusion filter, pastel haze'),
  look('Tilt Shift', 'tilt-shift miniature effect'),
];

export function getPreset(slug: string) {
  return PRESETS.find((p) => p.slug === slug);
}
