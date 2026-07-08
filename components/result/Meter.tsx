import React from 'react';

// The one meter spec across the reading — a soft track with a rounded, tinted fill.
// value is 0..1; pass `className` (e.g. "flex-1") to size it in a row.
// Used by the supply bars and the two-axis panel so every filled bar reads the same.
export const Meter: React.FC<{ value: number; hex: string; className?: string }> = ({ value, hex, className }) => (
  <div className={`h-2.5 w-full overflow-hidden rounded-full bg-ink/[0.06] ${className ?? ''}`}>
    <div
      className="h-full rounded-full transition-[width] duration-700 ease-out"
      style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: hex, opacity: 0.85 }}
    />
  </div>
);
