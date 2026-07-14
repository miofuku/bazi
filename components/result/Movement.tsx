import React from 'react';
import { useAccent } from './AtmosphereContext';

// A movement landmark. The reading is a three-act arc — what you are → the
// weather you grow in → growing on purpose — and these headers mark the shifts
// so a long scroll reads as a journey, not a wall of equal sections. Larger and
// centered than a section heading, with extra space above for the gear-shift;
// each is also an anchor (id) for wayfinding. No card, no ornament — the
// whitespace and scale carry the boundary, keeping the reading calm.
export const MovementHeader: React.FC<{ id: string; numeral: string; title: string; desc: string }> = ({
  id,
  numeral,
  title,
  desc,
}) => {
  const { accent } = useAccent();
  return (
    <div id={id} className="scroll-mt-6 pt-10 text-center md:pt-16">
      {/* A large, faint serif numeral gives each act its own editorial identity
          (Act I / II / III) — the one rhythm break, kept at the boundary only. */}
      <span
        className="block font-display text-6xl font-semibold leading-none sm:text-7xl"
        style={{ color: accent, opacity: 0.16 }}
        aria-hidden
      >
        {numeral}
      </span>
      <h2 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] italic leading-relaxed text-ink/55">{desc}</p>
    </div>
  );
};
