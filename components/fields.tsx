import React, { useState } from 'react';

export interface GeoValue { longitude: number; tzOffsetHours: number }

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

// Optional 真太阳时 (true solar time) correction. When on, the hour pillar is
// computed from apparent solar time using birthplace longitude + timezone.
export const GeoControl: React.FC<{ onChange: (g: GeoValue | undefined) => void }> = ({ onChange }) => {
  const [on, setOn] = useState(false);
  const [lon, setLon] = useState(0);
  const [tz, setTz] = useState(0);

  const push = (o: boolean, l: number, t: number) =>
    onChange(o ? { longitude: l, tzOffsetHours: t } : undefined);

  return (
    <div className="rounded-lg border border-black/5 bg-black/[0.02] p-4">
      <label className="flex cursor-pointer items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone">
        <input type="checkbox" checked={on} onChange={(e) => { setOn(e.target.checked); push(e.target.checked, lon, tz); }} />
        真太阳时校正 · true solar time
      </label>
      {on && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Num label="Longitude °E" value={lon} min={-180} max={180} onChange={(l) => { setLon(l); push(on, l, tz); }} />
          <Num label="UTC offset" value={tz} min={-12} max={14} onChange={(t) => { setTz(t); push(on, lon, t); }} />
        </div>
      )}
    </div>
  );
};
