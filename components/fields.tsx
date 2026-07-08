import React from 'react';

// Shared numeric birth field, used by both the single and pair input forms.
export const Num: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}> = ({ label, value, min, max, onChange }) => (
  <label className="flex flex-col gap-1">
    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-sage-deep/70">{label}</span>
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full rounded-md border border-black/10 bg-silk/40 px-2 py-1.5 text-center text-sm text-ink focus:border-sage focus:outline-none"
    />
  </label>
);
