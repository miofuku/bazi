import React from 'react';
import { Season } from '../../content/xiangfa';

// Small season motif, drawn in the reading's accent.
interface SeasonArtProps {
  season: Season;
  accent?: string;
  className?: string;
}

export const SeasonArt: React.FC<SeasonArtProps> = ({ season, accent = '#6E8B6A', className }) => {
  const a = accent;
  const base = { fill: 'none', stroke: a, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-hidden="true">
      <circle cx="36" cy="36" r="34" fill={a} fillOpacity={0.08} />
      <g {...base}>
        {season === 'Spring' && (
          <>
            <path d="M36 56 V34" />
            <path d="M36 42 C36 42 22 40 22 28 C32 26 38 33 36 42 Z" fill={a} fillOpacity={0.2} />
            <path d="M36 36 C36 36 50 33 50 21 C40 19 34 27 36 36 Z" fill={a} fillOpacity={0.2} />
          </>
        )}
        {season === 'Summer' && (
          <>
            <circle cx="36" cy="36" r="12" fill={a} fillOpacity={0.2} />
            {Array.from({ length: 12 }).map((_, i) => {
              const ang = (i * Math.PI) / 6;
              return <path key={i} d={`M${36 + Math.cos(ang) * 16} ${36 + Math.sin(ang) * 16} L${36 + Math.cos(ang) * 22} ${36 + Math.sin(ang) * 22}`} strokeWidth={2.2} />;
            })}
          </>
        )}
        {season === 'Autumn' && (
          <>
            <path d="M44 22 C30 24 22 36 26 50 C40 48 50 36 44 22 Z" fill={a} fillOpacity={0.2} />
            <path d="M26 50 L44 22 M31 44 l9 -4 M34 38 l9 -4 M37 32 l8 -4" strokeWidth={2} />
          </>
        )}
        {season === 'Winter' && (
          <>
            <path d="M36 54 V20" />
            <path d="M36 36 l-12 -10 M36 36 l12 -10 M36 46 l-10 -8 M36 46 l10 -8" strokeWidth={2.2} />
            <circle cx="24" cy="22" r="2" fill={a} stroke="none" />
            <circle cx="50" cy="30" r="2" fill={a} stroke="none" />
          </>
        )}
      </g>
    </svg>
  );
};
