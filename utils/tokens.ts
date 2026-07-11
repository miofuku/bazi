import { ElementType } from '../types';

// ── Design tokens — the single source of truth for Rootwise's visual language. ──
// Colours mirror the Tailwind palette in index.html; keep the two in sync. Import
// from here rather than re-typing hex literals in components.

// The five natural forces → hue.
export const ELEMENT_HEX: Record<ElementType, string> = {
  [ElementType.WOOD]: '#4A6741',
  [ElementType.FIRE]: '#C4664A',
  [ElementType.EARTH]: '#8C7051',
  [ElementType.METAL]: '#8A8C84',
  [ElementType.WATER]: '#3D5A6C',
};

// The five natural forces → 漢字 (display only).
export const ELEMENT_CN: Record<ElementType, string> = {
  [ElementType.WOOD]: '木', [ElementType.FIRE]: '火', [ElementType.EARTH]: '土',
  [ElementType.METAL]: '金', [ElementType.WATER]: '水',
};

// Weather "wind" — a decade / day's 顺涩 (favour), read as tailwind / even / headwind.
export const WIND = {
  tailwind: '#4A6741',
  even: '#8A8C84',
  headwind: '#C4664A',
} as const;
export type WindTone = keyof typeof WIND;

// Two-person compatibility: person A (sage) vs person B (clay).
export const PERSON = { a: '#6E8B6A', b: '#C4664A' } as const;

// Natal interaction kinds (刑冲合害) → hue.
export const REL_TONE: Record<'clash' | 'punish' | 'harm' | 'combine' | 'bond', string> = {
  clash: '#C4664A', punish: '#9a6a44', harm: '#8A6638', combine: '#4F6B4C', bond: '#4F6B4C',
};

// The favour → wind bucket, one threshold shared across seasons / days / axes.
// `band` widens the neutral zone for borderline charts (see windBand).
export const windTone = (favor: number, band = 0.15): WindTone =>
  favor > band ? 'tailwind' : favor < -band ? 'headwind' : 'even';

// Honesty hedge (docs/普通人案例验证.md): when a chart's 旺衰 sits near the
// strong/weak boundary (同党 share ~44–56%), its 用忌 could flip — so mid-sized
// wind signals aren't trustworthy. Widen the "Even wind" band for those charts:
// better to say less than to say it backwards.
export const windBand = (supportShare?: number): number =>
  supportShare !== undefined && Math.abs(supportShare - 0.5) <= 0.06 ? 0.3 : 0.15;

// Continuous wind colour for a favour in [-1, 1] — lighter near zero, so days the
// climate pushed into the same bucket still read as rank-distinct.
const mix = (h1: string, h2: string, t: number): string => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(h1), [r2, g2, b2] = p(h2);
  const c = (a: number, b: number) => Math.round(a + (b - a) * t).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
};
export const windHex = (f: number): string =>
  f >= 0 ? mix(WIND.even, WIND.tailwind, Math.min(f / 0.6, 1)) : mix(WIND.even, WIND.headwind, Math.min(-f / 0.6, 1));
