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
      <svg viewBox="0 0 24 24" fill="none" stroke="#6E8B6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16">
        <path className="reveal-grow" pathLength={1} d="M12 22V8" />
        <path className="reveal-grow" pathLength={1} style={{ animationDelay: '0.45s' }} d="M12 13C12 13 6 11 6 6.5C6 3.8 8.6 2.8 12 7" />
        <path className="reveal-grow" pathLength={1} style={{ animationDelay: '0.8s' }} d="M12 11C12 11 18 9.5 18 5.5C18 3.2 15.6 2.4 12 6" />
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
