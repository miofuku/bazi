import React, { useId } from 'react';

// Bespoke SVG "medallion" illustrations — one living scene per nature.
// Each is drawn in the reading's accent colour so it matches the person's
// element. Swappable API: <NatureArt id="tree" accent="#6E8B6A" />.

interface NatureArtProps {
  id: string;       // one of: tree sprout sun lantern rock field sword gem river rain
  accent?: string;  // hex; the element accent
  className?: string;
}

export const NatureArt: React.FC<NatureArtProps> = ({ id, accent = '#6E8B6A', className }) => {
  const uid = useId().replace(/:/g, '');
  const clip = `clip-${uid}`;
  const a = accent;

  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx="120" cy="120" r="112" />
        </clipPath>
      </defs>

      {/* medallion backdrop */}
      <circle cx="120" cy="120" r="112" fill={a} fillOpacity={0.07} />
      <g
        clipPath={`url(#${clip})`}
        fill="none"
        stroke={a}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Scene id={id} a={a} />
      </g>
      <circle cx="120" cy="120" r="112" fill="none" stroke={a} strokeOpacity={0.22} strokeWidth={1.5} />
    </svg>
  );
};

const Scene: React.FC<{ id: string; a: string }> = ({ id, a }) => {
  switch (id) {
    case 'tree': // The Tree — a canopy reaching up over a hill, sun behind
      return (
        <>
          <path d="M-10 182 Q120 150 250 182 L250 252 -10 252 Z" fill={a} fillOpacity={0.12} stroke="none" />
          <circle cx="186" cy="58" r="16" fill={a} fillOpacity={0.25} stroke="none" />
          <path d="M120 186 V120" />
          <path d="M120 150 L98 132 M120 138 L142 120" strokeWidth={2.4} />
          <circle cx="120" cy="92" r="44" fill={a} fillOpacity={0.16} />
          <path d="M120 50 q-30 4 -36 34 q-22 18 0 40 q26 22 56 6 q30 -2 24 -38 q4 -34 -44 -42 Z" fill={a} fillOpacity={0.10} stroke="none" />
        </>
      );
    case 'sprout': // The Vine — a climber curling up a slender support
      return (
        <>
          <path d="M-10 188 Q120 162 250 188 L250 252 -10 252 Z" fill={a} fillOpacity={0.12} stroke="none" />
          <path d="M120 188 V64" strokeWidth={2.2} strokeOpacity={0.5} />
          <path d="M120 184 C150 168 96 150 124 128 C152 108 96 96 122 76" />
          <path d="M124 128 c20 -10 30 2 30 14 c-18 4 -30 -2 -30 -14 Z" fill={a} fillOpacity={0.18} />
          <path d="M122 160 c-20 -8 -30 4 -28 16 c18 2 30 -4 28 -16 Z" fill={a} fillOpacity={0.18} />
          <path d="M122 76 c14 -12 30 -6 32 4 c-14 12 -30 6 -32 -4 Z" fill={a} fillOpacity={0.2} />
        </>
      );
    case 'sun': // The Sun — high and radiant over low hills
      return (
        <>
          <path d="M-10 196 Q70 170 130 192 Q190 212 250 188 L250 252 -10 252 Z" fill={a} fillOpacity={0.12} stroke="none" />
          <circle cx="120" cy="104" r="40" fill={a} fillOpacity={0.18} />
          {Array.from({ length: 12 }).map((_, i) => {
            const ang = (i * Math.PI) / 6;
            const x1 = 120 + Math.cos(ang) * 52, y1 = 104 + Math.sin(ang) * 52;
            const x2 = 120 + Math.cos(ang) * 66, y2 = 104 + Math.sin(ang) * 66;
            return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} strokeWidth={2.4} />;
          })}
        </>
      );
    case 'lantern': // The Flame — a tended fire and its glow
      return (
        <>
          <circle cx="120" cy="120" r="50" fill={a} fillOpacity={0.12} stroke="none" />
          <path d="M120 64 C150 96 150 116 138 138 C132 150 108 150 102 138 C92 118 100 102 120 64 Z" fill={a} fillOpacity={0.2} />
          <path d="M120 96 C133 112 132 126 124 138 C120 144 112 142 110 134 C107 122 112 112 120 96 Z" fill={a} fillOpacity={0.28} stroke="none" />
          <path d="M96 168 h48" strokeWidth={4} />
          <path d="M104 168 q16 -14 32 0" strokeWidth={2.2} strokeOpacity={0.6} />
        </>
      );
    case 'rock': // The Mountain — steady peaks with a high snowline
      return (
        <>
          <path d="M-10 198 Q120 176 250 198 L250 252 -10 252 Z" fill={a} fillOpacity={0.1} stroke="none" />
          <path d="M40 196 L104 84 L150 150 L182 104 L226 196 Z" fill={a} fillOpacity={0.15} />
          <path d="M40 196 L104 84 L150 150 L182 104 L226 196" />
          <path d="M88 110 l16 -26 l18 26 l-12 8 l-10 -8 Z" fill={a} fillOpacity={0.3} stroke="none" />
          <path d="M168 126 l14 -22 l16 22 l-12 6 Z" fill={a} fillOpacity={0.3} stroke="none" />
        </>
      );
    case 'field': // The Field — tended rows ripening under a low sun
      return (
        <>
          <circle cx="180" cy="78" r="18" fill={a} fillOpacity={0.22} stroke="none" />
          <path d="M-4 150 Q120 132 244 150" strokeOpacity={0.5} strokeWidth={2} />
          <path d="M-10 176 Q120 158 250 176" />
          <path d="M-16 206 Q120 186 256 206" />
          {[70, 110, 150, 190].map((x) => (
            <path key={x} d={`M${x} 176 v-16 M${x} 160 l-7 -8 M${x} 162 l7 -8`} strokeWidth={2.2} strokeOpacity={0.8} />
          ))}
        </>
      );
    case 'sword': // The Blade — forged, upright, clean-edged
      return (
        <>
          <circle cx="120" cy="120" r="50" fill={a} fillOpacity={0.08} stroke="none" />
          <path d="M120 52 L132 96 L130 168 L110 168 L108 96 Z" fill={a} fillOpacity={0.16} />
          <path d="M120 52 L132 96 L130 168 L110 168 L108 96 Z" />
          <path d="M120 70 V160" strokeWidth={1.8} strokeOpacity={0.55} />
          <path d="M92 172 h56" strokeWidth={4} />
          <path d="M120 172 v16" strokeWidth={4} />
          <circle cx="120" cy="194" r="5" fill={a} fillOpacity={0.3} />
        </>
      );
    case 'gem': // The Jewel — faceted, catching the light
      return (
        <>
          <circle cx="120" cy="122" r="48" fill={a} fillOpacity={0.1} stroke="none" />
          <path d="M84 104 L120 70 L156 104 L120 178 Z" fill={a} fillOpacity={0.18} />
          <path d="M84 104 L120 70 L156 104 L120 178 Z" />
          <path d="M84 104 H156 M120 70 V178 M102 104 L120 178 L138 104" strokeWidth={1.8} strokeOpacity={0.6} />
          <path d="M170 78 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 Z" fill={a} fillOpacity={0.3} stroke="none" />
        </>
      );
    case 'river': // The River — winding wide through a valley
      return (
        <>
          <path d="M-10 120 Q40 110 60 150 T120 170 Q170 180 200 130 L250 120 250 252 -10 252 Z" fill={a} fillOpacity={0.06} stroke="none" />
          <path d="M96 56 C150 96 84 128 132 164 C160 186 120 210 150 236" strokeWidth={10} stroke={a} strokeOpacity={0.18} />
          <path d="M96 56 C150 96 84 128 132 164 C160 186 120 210 150 236" strokeWidth={3} />
          <path d="M70 110 q14 8 28 0 M150 150 q14 8 28 0 M64 178 q14 8 28 0" strokeWidth={2} strokeOpacity={0.5} />
        </>
      );
    case 'rain': // The Rain — soft clouds nourishing what grows below
      return (
        <>
          <path d="M78 96 a24 24 0 0 1 46 -10 a20 20 0 0 1 34 14 a18 18 0 0 1 -6 35 H92 a22 22 0 0 1 -14 -39 Z" fill={a} fillOpacity={0.16} />
          <path d="M78 96 a24 24 0 0 1 46 -10 a20 20 0 0 1 34 14 a18 18 0 0 1 -6 35 H92 a22 22 0 0 1 -14 -39 Z" strokeWidth={2.4} />
          {[84, 112, 140, 168].map((x, i) => (
            <path key={x} d={`M${x} ${150 + (i % 2) * 8} l-6 16`} strokeWidth={2.6} />
          ))}
          <path d="M112 210 v-18 M112 198 l-8 -8 M112 200 l8 -8" strokeWidth={2.4} strokeOpacity={0.8} />
        </>
      );
    default:
      return <circle cx="120" cy="120" r="40" fill={a} fillOpacity={0.15} />;
  }
};
