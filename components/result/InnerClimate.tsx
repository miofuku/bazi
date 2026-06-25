import React from 'react';
import { ElementType } from '../../types';
import { ELEMENT_BG_COLORS, ELEMENT_COLORS } from '../../utils/constants';
import { ELEMENT_NATURE } from './icons';
import { ForceArt } from '../illustrations/ForceArt';
import { useAccent } from './AtmosphereContext';

interface InnerClimateProps {
  elementShare: Record<ElementType, number>;
  dominantElement: ElementType;
  weakestElement: ElementType;
}

const ORDER: ElementType[] = [
  ElementType.WOOD, ElementType.FIRE, ElementType.EARTH, ElementType.METAL, ElementType.WATER,
];

// The five natural forces as the "weather" a person carries inside.
export const InnerClimate: React.FC<InnerClimateProps> = ({ elementShare, dominantElement, weakestElement }) => {
  const { accentDeep } = useAccent();
  return (
    <section>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>Your inner weather</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">The forces that move through you</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
        Five forces shape everything that grows. Each of us carries them in our own proportions — heavy in one, light in another. That blend isn't a flaw; it's simply your weather, the climate other people feel when they're near you.
      </p>

      {/* Proportional strip */}
      <div className="mt-8 flex h-4 w-full overflow-hidden rounded-full ring-1 ring-ink/5">
        {ORDER.map((el) => (
          <div
            key={el}
            className={`${ELEMENT_BG_COLORS[el]} h-full transition-all duration-700`}
            style={{ width: `${Math.max(elementShare[el] * 100, 2)}%` }}
            title={`${ELEMENT_NATURE[el].label} · ${Math.round(elementShare[el] * 100)}%`}
          />
        ))}
      </div>

      {/* Legend with force emblems */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ORDER.map((el) => (
          <div key={el} className="rounded-xl bg-white/50 p-4 ring-1 ring-ink/5">
            <div className="flex items-center gap-2">
              <ForceArt element={el} className="h-8 w-8 shrink-0" />
              <span className={`font-display font-semibold ${ELEMENT_COLORS[el]}`}>{ELEMENT_NATURE[el].label}</span>
              <span className="ml-auto text-xs font-semibold text-stone">{Math.round(elementShare[el] * 100)}%</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink/60">{ELEMENT_NATURE[el].note}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-ink/75">
        <span className={`font-semibold ${ELEMENT_COLORS[dominantElement]}`}>{ELEMENT_NATURE[dominantElement].label}</span>
        {' '}runs strongest in you, while{' '}
        <span className={`font-semibold ${ELEMENT_COLORS[weakestElement]}`}>{ELEMENT_NATURE[weakestElement].label}</span>
        {' '}is the quietest — often the very quality that, when tended, helps you feel whole.
      </p>
    </section>
  );
};
