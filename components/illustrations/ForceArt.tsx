import React from 'react';
import { ElementType } from '../../types';

// Plain-English natural forces, drawn as small emblems in each element's hue.
export const ELEMENT_HEX: Record<ElementType, string> = {
  [ElementType.WOOD]: '#4A6741',
  [ElementType.FIRE]: '#C4664A',
  [ElementType.EARTH]: '#8C7051',
  [ElementType.METAL]: '#8A8C84',
  [ElementType.WATER]: '#3D5A6C',
};

interface ForceArtProps {
  element: ElementType;
  className?: string;
}

export const ForceArt: React.FC<ForceArtProps> = ({ element, className }) => {
  const c = ELEMENT_HEX[element];
  const base = { fill: 'none', stroke: c, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill={c} fillOpacity={0.08} />
      <g {...base}>
        {element === ElementType.WOOD && (
          <>
            <path d="M32 52 V28" />
            <path d="M32 36 C32 36 20 34 20 24 C28 22 33 28 32 36 Z" fill={c} fillOpacity={0.18} />
            <path d="M32 30 C32 30 44 27 44 17 C36 15 31 22 32 30 Z" fill={c} fillOpacity={0.18} />
          </>
        )}
        {element === ElementType.FIRE && (
          <>
            <circle cx="32" cy="30" r="11" fill={c} fillOpacity={0.18} />
            {Array.from({ length: 8 }).map((_, i) => {
              const ang = (i * Math.PI) / 4;
              return <path key={i} d={`M${32 + Math.cos(ang) * 15} ${30 + Math.sin(ang) * 15} L${32 + Math.cos(ang) * 20} ${30 + Math.sin(ang) * 20}`} strokeWidth={2.2} />;
            })}
            <path d="M22 50 h20" strokeWidth={3.4} />
          </>
        )}
        {element === ElementType.EARTH && (
          <>
            <path d="M12 44 Q32 34 52 44" fill={c} fillOpacity={0.16} />
            <path d="M12 44 Q32 34 52 44" />
            <path d="M16 52 Q32 44 48 52" strokeOpacity={0.6} />
            <path d="M28 38 l4 -6 l4 6" strokeWidth={2.2} strokeOpacity={0.7} />
          </>
        )}
        {element === ElementType.METAL && (
          <>
            <path d="M20 28 L32 16 L44 28 L32 50 Z" fill={c} fillOpacity={0.16} />
            <path d="M20 28 L32 16 L44 28 L32 50 Z" />
            <path d="M20 28 H44 M32 16 V50" strokeWidth={1.8} strokeOpacity={0.55} />
          </>
        )}
        {element === ElementType.WATER && (
          <>
            <path d="M14 26 q9 -8 18 0 t18 0" />
            <path d="M14 38 q9 -8 18 0 t18 0" strokeOpacity={0.75} />
            <path d="M14 50 q9 -8 18 0 t18 0" strokeOpacity={0.5} />
          </>
        )}
      </g>
    </svg>
  );
};
