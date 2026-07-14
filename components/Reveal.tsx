import React, { useEffect } from 'react';

// The ceremonial pause before a reading appears: a sprout draws itself while
// two lines of copy pass, then the overlay fades and the hero shows through.
// The engine is instant — this beat is deliberate theatre, so it is skipped
// entirely for prefers-reduced-motion users.

const LINES = {
  single: ['Reading your birth moment…', 'Finding the season you took root in…'],
  pair: ['Reading two birth moments…', 'Setting your natures side by side…'],
};

export const Reveal: React.FC<{ pair?: boolean; onDone: () => void }> = ({ pair, onDone }) => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone();
      return;
    }
    const t = setTimeout(onDone, 2700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="reveal-overlay fixed inset-0 z-[60] flex flex-col items-center justify-center bg-canvas" role="status" aria-label="Preparing your reading">
      {/* The rooted mark germinates from the seed: shoot rises, leaves unfurl,
          then roots descend — the axis is split so it grows outward, not top-down
          (fits the "took root" copy). Matches components/Sprig.tsx end-state. */}
      <svg viewBox="0 0 24 24" fill="none" stroke="#6E8B6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16">
        <path className="reveal-grow" pathLength={1} d="M12 12V3" />
        <path className="reveal-grow" pathLength={1} style={{ animationDelay: '0.35s' }} d="M12 7C12 7 6 5.5 6 2.5C6 0.5 8.5 0 12 4" />
        <path className="reveal-grow" pathLength={1} style={{ animationDelay: '0.47s' }} d="M12 7C12 7 18 5.5 18 2.5C18 0.5 15.5 0 12 3.2" />
        <path className="reveal-grow" pathLength={1} style={{ animationDelay: '0.55s' }} d="M12 12V20" />
        <path className="reveal-grow" pathLength={1} style={{ animationDelay: '0.68s' }} d="M12 13C10.5 14.5 9 15 7.3 16.8" />
        <path className="reveal-grow" pathLength={1} style={{ animationDelay: '0.8s' }} d="M12 15.5C13.6 16.4 15 16.8 16.6 18.6" />
        <path className="reveal-grow" pathLength={1} style={{ animationDelay: '0.92s' }} d="M12 17.5C11 18.5 10.2 19.2 9.4 20.5" />
      </svg>
      <div className="relative mt-8 h-6 w-full">
        {LINES[pair ? 'pair' : 'single'].map((line, i) => (
          <p
            key={line}
            className="reveal-line absolute inset-x-0 text-center font-display text-lg italic text-stone"
            style={{ animationDelay: `${i * 1.15}s` }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};
