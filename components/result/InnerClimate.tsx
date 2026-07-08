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

// Join element labels into a coloured, grammatical list ("A", "A and B", "A, B and C").
const ForceList: React.FC<{ els: ElementType[] }> = ({ els }) => (
  <>
    {els.map((el, i) => (
      <React.Fragment key={el}>
        {i > 0 && (i === els.length - 1 ? ' and ' : ', ')}
        <span className={`font-semibold ${ELEMENT_COLORS[el]}`}>{ELEMENT_NATURE[el].label}</span>
      </React.Fragment>
    ))}
  </>
);

// The five natural forces as the "weather" a person carries inside.
export const InnerClimate: React.FC<InnerClimateProps> = ({ elementShare }) => {
  const { accentDeep } = useAccent();

  // Tie-aware: read strongest/weakest off the *displayed* percentages, so when
  // two forces show the same %, both are named.
  const pct = (el: ElementType) => Math.round(elementShare[el] * 100);
  const maxP = Math.max(...ORDER.map(pct));
  const minP = Math.min(...ORDER.map(pct));
  const strongest = ORDER.filter((el) => pct(el) === maxP);
  const weakest = ORDER.filter((el) => pct(el) === minP);
  const allEven = maxP === minP;

  return (
    <section>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>Your inner weather</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">The forces that move through you</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
        Five forces shape everything that grows. Each of us carries them in our own proportions — heavy in one, light in another. That blend isn't a flaw; it's simply your weather, the climate other people feel when they're near you.
      </p>

      {/* Proportional strip */}
      <div className="mt-8 flex h-4 w-full overflow-hidden rounded-full ring-1 ring-ink/5 shadow-lift">
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
          <div key={el} className="rounded-xl bg-white/50 p-4 ring-1 ring-ink/5 shadow-lift">
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
        {allEven ? (
          <>Your forces run unusually even — no single one takes the lead, and none falls away. A rare, level climate to live in.</>
        ) : (
          <>
            <ForceList els={strongest} />{' '}
            {strongest.length > 1 ? 'run strongest in you' : 'runs strongest in you'}, while{' '}
            <ForceList els={weakest} />{' '}
            {weakest.length > 1
              ? 'are the quietest — often the very qualities that, when tended, help you feel whole.'
              : 'is the quietest — often the very quality that, when tended, helps you feel whole.'}
          </>
        )}
      </p>
    </section>
  );
};
