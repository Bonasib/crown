import {
  AudioLines,
  Clapperboard,
  Code2,
  Compass,
  Cpu,
  Film,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  LayoutPanelLeft,
  Map,
  Maximize2,
  Megaphone,
  Mic,
  Move3d,
  Sparkles,
  UserRound,
  Wand2,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  image: ImageIcon,
  'user-round': UserRound,
  wand: Wand2,
  layout: LayoutPanelLeft,
  maximize: Maximize2,
  clapperboard: Clapperboard,
  move: Move3d,
  film: Film,
  mic: Mic,
  megaphone: Megaphone,
  audio: AudioLines,
  grid: LayoutGrid,
  cpu: Cpu,
  compass: Compass,
  map: Map,
  code: Code2,
  info: Info,
};

export function NavIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} />;
}
