import { ElementType } from '../../types';
import { Season } from './types';

// Per-reading atmosphere: the colour and mood of a person's element + season.
// Element decides the hue family; season decides the light, warmth, and drama.

export interface Atmosphere {
  hero: string;        // rich, immersive background for the result hero
  wash: string;        // soft, tinted light background behind the reading
  accent: string;      // element accent (bright) — used on the dark hero
  accentDeep: string;  // darkened accent — used on the light wash for contrast
  heroText: string;    // primary text colour on the hero
  heroTextSoft: string;
  glyphHero: string;   // giant day-master watermark colour on the hero
  glyphWash: string;   // giant watermark colour over the light wash
  seasonLabel: Season;
}

interface ElementPalette {
  deepTop: string;
  deepBottom: string;
  accent: string;
  accentDeep: string;
  lite: string;
}

const ELEMENT_PALETTE: Record<ElementType, ElementPalette> = {
  [ElementType.WOOD]:  { deepTop: '#24341F', deepBottom: '#101A0E', accent: '#86A871', accentDeep: '#4F6B4C', lite: '#EAF1E3' },
  [ElementType.FIRE]:  { deepTop: '#3E1D14', deepBottom: '#210E09', accent: '#E0825A', accentDeep: '#A8503A', lite: '#FBECE2' },
  [ElementType.EARTH]: { deepTop: '#3A2C18', deepBottom: '#1E160C', accent: '#CB9A5E', accentDeep: '#8A6638', lite: '#F4ECDC' },
  [ElementType.METAL]: { deepTop: '#2B3239', deepBottom: '#15191C', accent: '#A2AFB3', accentDeep: '#5E6A6E', lite: '#ECEFF0' },
  [ElementType.WATER]: { deepTop: '#172B3A', deepBottom: '#0A131B', accent: '#5F97AE', accentDeep: '#2F5364', lite: '#E6EEF3' },
};

// How bright/warm the season's "glow" sits over the element's deep base.
const SEASON_GLOW: Record<Season, number> = {
  Spring: 0.40,
  Summer: 0.62,
  Autumn: 0.32,
  Winter: 0.20,
};

const hexA = (hex: string, alpha: number): string => {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function getAtmosphere(element: ElementType, season: Season): Atmosphere {
  const p = ELEMENT_PALETTE[element];
  const glow = SEASON_GLOW[season];

  // Hero: a season-tinted glow rising over the element's deep base.
  const hero =
    `radial-gradient(110% 80% at 50% 8%, ${hexA(p.accent, glow)} 0%, transparent 60%), ` +
    `linear-gradient(180deg, ${p.deepTop} 0%, ${p.deepBottom} 100%)`;

  // Wash: a gentle tint of the element fading to warm paper.
  const wash = `linear-gradient(180deg, ${p.lite} 0%, #F7F5EF 52%)`;

  return {
    hero,
    wash,
    accent: p.accent,
    accentDeep: p.accentDeep,
    heroText: '#F4F0E8',
    heroTextSoft: 'rgba(244, 240, 232, 0.72)',
    glyphHero: hexA('#FFFFFF', 0.055),
    glyphWash: hexA(p.accent, 0.07),
    seasonLabel: season,
  };
}
