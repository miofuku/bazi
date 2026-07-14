import React from 'react';

// The Rootwise mark — a shoot with two leaves above the soil line and a branching
// root system below it: rooted growth (owns the name "Root-wise"). Single source
// of truth for the static mark; keep in sync with brand/rootwise-mark-a.svg and
// the favicon in index.html. Uses currentColor so callers set the tint.
export const Sprig: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3V20" />
    <path d="M12 7C12 7 6 5.5 6 2.5C6 0.5 8.5 0 12 4" />
    <path d="M12 7C12 7 18 5.5 18 2.5C18 0.5 15.5 0 12 3.2" />
    <path d="M12 13C10.5 14.5 9 15 7.3 16.8" />
    <path d="M12 15.5C13.6 16.4 15 16.8 16.6 18.6" />
    <path d="M12 17.5C11 18.5 10.2 19.2 9.4 20.5" />
  </svg>
);
