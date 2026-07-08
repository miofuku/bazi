import React, { useState } from 'react';
import { CITIES, GeoSpec } from '../utils/cities';

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

const REGIONS = [...new Set(CITIES.map((c) => c.region))];

// Birthplace → 真太阳时 correction. Pick a city and the timezone offset (incl.
// historical DST / 战时) is resolved automatically at the birth moment; the
// longitude gives the local-meridian correction. "Manual" is an escape hatch.
export const GeoControl: React.FC<{ onChange: (s: GeoSpec | undefined) => void }> = ({ onChange }) => {
  const [sel, setSel] = useState('none'); // 'none' | 'manual' | city index
  const [lon, setLon] = useState(120);
  const [tz, setTz] = useState(8);

  const emit = (s: string, l: number, t: number) => {
    if (s === 'none') onChange(undefined);
    else if (s === 'manual') onChange({ kind: 'manual', lon: l, tzOffsetHours: t });
    else { const c = CITIES[Number(s)]; onChange({ kind: 'city', lon: c.lon, tz: c.tz }); }
  };

  return (
    <div className="rounded-lg border border-black/5 bg-black/[0.02] p-4">
      <label className="mb-2 block text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-stone">
        Birthplace · true solar time
      </label>
      <select
        value={sel}
        onChange={(e) => { setSel(e.target.value); emit(e.target.value, lon, tz); }}
        className="w-full rounded-md border border-black/10 bg-silk/40 px-3 py-2 text-sm text-ink focus:border-sage focus:outline-none"
      >
        <option value="none">No correction (use clock time)</option>
        {REGIONS.map((r) => (
          <optgroup key={r} label={r}>
            {CITIES.map((c, i) => c.region === r ? <option key={i} value={i}>{c.name}</option> : null)}
          </optgroup>
        ))}
        <option value="manual">▸ Manual longitude / timezone</option>
      </select>
      {sel === 'manual' && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Num label="Longitude °E" value={lon} min={-180} max={180} onChange={(l) => { setLon(l); emit(sel, l, tz); }} />
          <Num label="UTC offset" value={tz} min={-12} max={14} onChange={(t) => { setTz(t); emit(sel, lon, t); }} />
        </div>
      )}
    </div>
  );
};
