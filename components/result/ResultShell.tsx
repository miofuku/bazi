import React, { useEffect, useState } from 'react';

// The shared frame for a result page — solo (NatureResult) or paired
// (Compatibility). It owns only what the two genuinely share: a full-height
// stage, the floating "Read another" control, and a back-to-top. Everything
// page-specific — the fixed background (themed wash + glyph vs. season-sky),
// the hero/header, and the sections — is passed in, so each page keeps its look.
export const ResultShell: React.FC<{
  background: React.ReactNode; // the fixed -z-10 layer, verbatim per page
  onReset: () => void;
  children: React.ReactNode;
}> = ({ background, onReset, children }) => {
  // Back-to-top appears once you're into the reading (past ~the first screen),
  // so it never clutters the top where it would do nothing.
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShowTop(window.scrollY > window.innerHeight * 0.8);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      {background}

      {/* Floating back control */}
      <button
        onClick={onReset}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink/70 backdrop-blur-md transition-colors hover:text-ink"
      >
        <span>←</span> Read another
      </button>

      {/* Back to top — mirrors the bottom-right control; hidden at the top */}
      <button
        onClick={toTop}
        aria-label="Back to top"
        aria-hidden={!showTop}
        tabIndex={showTop ? undefined : -1}
        className={`fixed bottom-6 left-6 z-50 grid h-11 w-11 place-items-center rounded-full bg-white/70 text-ink/60 shadow-lift ring-1 ring-ink/5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:text-ink ${showTop ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {children}
    </div>
  );
};
