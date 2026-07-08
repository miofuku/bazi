import React, { useState } from 'react';
import { Gender } from '../types';
import { Birth } from '../services/compatibilityService';
import { RelationLens } from '../utils/CompatibilityAnalyzer';
import { Num, GeoControl } from './fields';
import { GeoSpec, resolveGeo } from '../utils/cities';

interface Props {
  onAnalyze: (a: Birth, b: Birth, lens: RelationLens) => void;
}

const blank = (label: string): Birth => ({
  label, year: 1990, month: 6, day: 15, hour: 12, minute: 0, gender: Gender.MALE,
});

const PersonFields: React.FC<{
  value: Birth;
  onChange: (b: Birth) => void;
  onGeoSpec: (s: GeoSpec | undefined) => void;
}> = ({ value, onChange, onGeoSpec }) => (
  <div className="flex flex-col gap-3 rounded-xl border border-black/5 bg-black/[0.015] p-5">
    <input
      value={value.label}
      onChange={(e) => onChange({ ...value, label: e.target.value })}
      placeholder="Name or label"
      className="w-full rounded-md border border-black/10 bg-white/60 px-3 py-2 font-display text-lg text-ink focus:border-sage focus:outline-none"
    />
    <div className="grid grid-cols-3 gap-2">
      <Num label="Year" value={value.year} min={1900} max={2100} onChange={(year) => onChange({ ...value, year })} />
      <Num label="Month" value={value.month} min={1} max={12} onChange={(month) => onChange({ ...value, month })} />
      <Num label="Day" value={value.day} min={1} max={31} onChange={(day) => onChange({ ...value, day })} />
      <Num label="Hour" value={value.hour} min={0} max={23} onChange={(hour) => onChange({ ...value, hour })} />
      <Num label="Min" value={value.minute} min={0} max={59} onChange={(minute) => onChange({ ...value, minute })} />
      <label className="flex flex-col gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-sage-deep/70">Sex</span>
        <div className="flex overflow-hidden rounded-md border border-black/10">
          {[Gender.MALE, Gender.FEMALE].map((g) => (
            <button key={g} type="button" onClick={() => onChange({ ...value, gender: g })}
              className={`flex-1 py-1.5 text-xs transition-colors ${value.gender === g ? 'bg-sage text-white' : 'bg-silk/40 text-stone'}`}>
              {g === Gender.MALE ? 'M' : 'F'}
            </button>
          ))}
        </div>
      </label>
    </div>
    <GeoControl onChange={onGeoSpec} />
  </div>
);

const withGeo = (birth: Birth, spec: GeoSpec | undefined): Birth =>
  spec
    ? { ...birth, geo: resolveGeo(spec, birth.year, birth.month, birth.day, birth.hour, birth.minute) }
    : { ...birth, geo: undefined };

export const PairInputForm: React.FC<Props> = ({ onAnalyze }) => {
  const [a, setA] = useState<Birth>(blank('Person A'));
  const [b, setB] = useState<Birth>(blank('Person B'));
  const [geoA, setGeoA] = useState<GeoSpec | undefined>(undefined);
  const [geoB, setGeoB] = useState<GeoSpec | undefined>(undefined);
  const [lens, setLens] = useState<RelationLens>('partner');

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onAnalyze(withGeo(a, geoA), withGeo(b, geoB), lens); }}
      className="w-full max-w-2xl glass-light p-8 shadow-2xl border-black/5"
    >
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-full border border-ink/10 p-1">
          {(['partner', 'marriage'] as RelationLens[]).map((l) => (
            <button key={l} type="button" onClick={() => setLens(l)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${lens === l ? 'bg-sage text-white' : 'text-stone hover:text-sage'}`}>
              {l === 'partner' ? 'Co-founder' : 'Marriage'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PersonFields value={a} onChange={setA} onGeoSpec={setGeoA} />
        <PersonFields value={b} onChange={setB} onGeoSpec={setGeoB} />
      </div>

      <button type="submit"
        className="mt-6 w-full rounded-full bg-sage py-4 font-display font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-sage-deep">
        See how you fit
      </button>
    </form>
  );
};
