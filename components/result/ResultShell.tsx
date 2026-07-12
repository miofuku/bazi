import React from 'react';

// The shared frame for a result page — solo (NatureResult) or paired
// (Compatibility). It owns only what the two genuinely share: a full-height
// stage and the floating "Read another" control. Everything page-specific —
// the fixed background (themed wash + glyph vs. season-sky), the hero/header,
// and the sections — is passed in, so each page keeps its own look.
export const ResultShell: React.FC<{
  background: React.ReactNode; // the fixed -z-10 layer, verbatim per page
  onReset: () => void;
  children: React.ReactNode;
}> = ({ background, onReset, children }) => (
  <div className="relative min-h-screen">
    {background}

    {/* Floating back control */}
    <button
      onClick={onReset}
      className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink/70 backdrop-blur-md transition-colors hover:text-ink"
    >
      <span>←</span> Read another
    </button>

    {children}
  </div>
);
