import { hash } from '@/lib/utils';

/** Procedural SVG used as demo output when no provider key is configured. */
export function GET(request: Request) {
  const url = new URL(request.url);
  const seed = url.searchParams.get('seed') ?? '0';
  const kind = url.searchParams.get('kind') ?? 'image';
  const [rw, rh] = (url.searchParams.get('ratio') ?? '1:1').split(':').map(Number);
  const w = 1024;
  const h = rw && rh && rw > 0 && rh > 0 ? Math.round((w * rh) / rw) : 1024;
  const n = hash(seed);
  const hue = n % 360;
  const hue2 = (hue + 60 + ((n >> 8) % 120)) % 360;
  const cx = 20 + ((n >> 12) % 60);
  const cy = 20 + ((n >> 16) % 60);
  const anim =
    kind === 'video'
      ? `<animateTransform attributeName="transform" type="scale" values="1;1.15;1" dur="6s" repeatCount="indefinite"/>`
      : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <radialGradient id="a" cx="${cx}%" cy="${cy}%" r="70%"><stop offset="0" stop-color="hsl(${hue} 90% 65%)"/><stop offset="1" stop-color="hsl(${hue} 60% 8%)"/></radialGradient>
    <radialGradient id="b" cx="${100 - cx}%" cy="${100 - cy}%" r="55%"><stop offset="0" stop-color="hsl(${hue2} 90% 60%)" stop-opacity=".9"/><stop offset="1" stop-color="hsl(${hue2} 90% 60%)" stop-opacity="0"/></radialGradient>
  </defs>
  <g style="transform-origin:center">${anim}
    <rect width="100%" height="100%" fill="url(#a)"/>
    <rect width="100%" height="100%" fill="url(#b)"/>
    <circle cx="${w / 2}" cy="${h * 0.55}" r="${Math.min(w, h) * 0.18}" fill="hsl(${hue2} 70% 20%)" opacity=".55"/>
  </g>
  <text x="32" y="${h - 32}" font-family="system-ui,sans-serif" font-size="28" fill="#fff" opacity=".7">Wilo demo · ${kind}</text>
</svg>`;
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
