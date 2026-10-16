export interface NavItem {
  label: string;
  href: string;
  description: string;
  icon: string;
  badge?: 'new' | 'hot';
}

export interface NavGroup {
  label: string;
  href: string;
  items: NavItem[];
}

/** Top navigation. Icon names resolve through components/layout/icons.tsx. */
export const NAV: NavGroup[] = [
  {
    label: 'Image',
    href: '/image',
    items: [
      { label: 'Create Image', href: '/image', description: 'Text and reference to image with 8 models', icon: 'image' },
      { label: 'Persona', href: '/character', description: 'Train a consistent character from your photos', icon: 'user-round', badge: 'hot' },
      { label: 'Edit Image', href: '/edit', description: 'Edit with words, inpaint, relight, outfit swap', icon: 'wand' },
      { label: 'Storyboard', href: '/apps/storyboard', description: '8 consistent frames from one idea', icon: 'layout' },
      { label: 'Upscale', href: '/apps/upscale', description: 'Sharpen and enlarge up to 4x', icon: 'maximize' },
    ],
  },
  {
    label: 'Video',
    href: '/video',
    items: [
      { label: 'Create Video', href: '/video', description: 'Text and image to video with 9 models', icon: 'clapperboard' },
      { label: 'Motion Presets', href: '/presets', description: '80+ camera moves, actions and VFX', icon: 'move', badge: 'hot' },
      { label: 'Cinema Studio', href: '/cinema', description: 'Lens, camera body, motion and grade', icon: 'film', badge: 'new' },
      { label: 'Lip Sync Studio', href: '/lipsync', description: 'Talking avatars and video dubbing', icon: 'mic' },
      { label: 'Video Upscale', href: '/apps/video-upscale', description: 'Upscale clips to 4K', icon: 'maximize' },
    ],
  },
  {
    label: 'Studios',
    href: '/ads',
    items: [
      { label: 'Ad Studio', href: '/ads', description: 'Product to UGC and TV-style video ads', icon: 'megaphone', badge: 'new' },
      { label: 'Audio', href: '/audio', description: 'Voiceover and music generation', icon: 'audio' },
      { label: 'Apps', href: '/apps', description: '40+ one-click creative apps', icon: 'grid' },
      { label: 'Models', href: '/models', description: 'Every model and what it costs', icon: 'cpu' },
    ],
  },
  {
    label: 'Explore',
    href: '/explore',
    items: [
      { label: 'Community', href: '/explore', description: 'Trending creations from Wilo creators', icon: 'compass' },
      { label: 'Roadmap', href: '/roadmap', description: 'What shipped and what is next', icon: 'map' },
      { label: 'Developers', href: '/developers', description: 'REST API for every model', icon: 'code' },
      { label: 'About', href: '/about', description: 'The team and mission', icon: 'info' },
    ],
  },
];

export interface Plan {
  id: string;
  name: string;
  monthly: number;
  annual: number;
  credits: number;
  blurb: string;
  features: string[];
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0,
    annual: 0,
    credits: 30,
    blurb: 'Try Wilo with daily credits.',
    features: ['30 credits every month', '3 image models', '1 job at a time', 'Watermarked downloads', 'Personal use only'],
  },
  {
    id: 'creator',
    name: 'Creator',
    monthly: 15,
    annual: 12,
    credits: 300,
    blurb: 'For hobbyists posting weekly.',
    features: ['300 credits / month', 'All image models', 'Video up to 720p', '2 concurrent jobs', 'Commercial license', 'No watermark'],
  },
  {
    id: 'studio',
    name: 'Studio',
    monthly: 49,
    annual: 39,
    credits: 1500,
    blurb: 'For creators and freelancers.',
    highlight: true,
    features: [
      '1,500 credits / month',
      'Every model incl. Veo 3 & Sora 2',
      '1080p video, 4K images',
      '3 Personas',
      '4 concurrent jobs',
      'Priority queue',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    monthly: 119,
    annual: 95,
    credits: 4000,
    blurb: 'For agencies shipping daily.',
    features: [
      '4,000 credits / month',
      'Unlimited Wilo Persona images',
      '10 Personas',
      '8 concurrent jobs',
      'API access',
      'Early access to new models',
    ],
  },
];

export const CREDIT_PACKS = [
  { credits: 100, price: 6 },
  { credits: 500, price: 25 },
  { credits: 2000, price: 90 },
];

export type RoadmapStatus = 'shipped' | 'in-progress' | 'planned';

export interface RoadmapItem {
  title: string;
  description: string;
  status: RoadmapStatus;
  quarter: string;
  tag: 'Image' | 'Video' | 'Audio' | 'Platform' | 'Apps';
}

export const ROADMAP: RoadmapItem[] = [
  { title: 'Create Image & Create Video', description: 'Multi-model generation with shared prompt bar and history.', status: 'shipped', quarter: 'Q3 2026', tag: 'Platform' },
  { title: 'Motion Presets library', description: '80+ camera, action and VFX presets with hover previews.', status: 'shipped', quarter: 'Q3 2026', tag: 'Video' },
  { title: 'Apps catalog', description: '40+ one-click apps across ads, identity, enhance and fun.', status: 'shipped', quarter: 'Q3 2026', tag: 'Apps' },
  { title: 'Lip Sync Studio', description: 'Talking photos and video dubbing.', status: 'shipped', quarter: 'Q3 2026', tag: 'Audio' },
  { title: 'Persona training', description: 'Upload 20+ photos to train a reusable, private character identity.', status: 'in-progress', quarter: 'Q4 2026', tag: 'Image' },
  { title: 'Cinema Studio', description: 'Virtual camera bodies, lenses, focal lengths and color grades.', status: 'in-progress', quarter: 'Q4 2026', tag: 'Video' },
  { title: 'Ad Studio', description: 'Product link or photos to UGC, packshot and TV-spot ads.', status: 'in-progress', quarter: 'Q4 2026', tag: 'Apps' },
  { title: 'Accounts, teams & billing', description: 'Sign-in, workspaces, Stripe subscriptions and credit ledger.', status: 'planned', quarter: 'Q4 2026', tag: 'Platform' },
  { title: 'Canvas', description: 'Node-based board to chain models into reusable workflows.', status: 'planned', quarter: 'Q1 2027', tag: 'Platform' },
  { title: 'Wilo Assistant', description: 'Chat agent that plans shots, writes prompts and runs apps for you.', status: 'planned', quarter: 'Q1 2027', tag: 'Platform' },
  { title: 'App builder', description: 'Publish your own no-code apps to the catalog.', status: 'planned', quarter: 'Q1 2027', tag: 'Apps' },
  { title: 'Video translate', description: 'Translate speech into 18 languages with automatic lip sync.', status: 'planned', quarter: 'Q1 2027', tag: 'Audio' },
  { title: 'Editor plugins & MCP', description: 'Photoshop, Premiere and an MCP server for agents.', status: 'planned', quarter: 'Q2 2027', tag: 'Platform' },
  { title: 'Mobile app', description: 'Prompt-first iOS and Android app.', status: 'planned', quarter: 'Q2 2027', tag: 'Platform' },
];

export const FOOTER = [
  {
    title: 'Create',
    links: [
      { label: 'Create Image', href: '/image' },
      { label: 'Create Video', href: '/video' },
      { label: 'Edit Image', href: '/edit' },
      { label: 'Lip Sync', href: '/lipsync' },
      { label: 'Audio', href: '/audio' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Motion Presets', href: '/presets' },
      { label: 'Apps', href: '/apps' },
      { label: 'Models', href: '/models' },
      { label: 'Community', href: '/explore' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Developers', href: '/developers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Acceptable use', href: '/terms#acceptable-use' },
    ],
  },
];
