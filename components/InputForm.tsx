import React, { useState } from 'react';
import { Gender } from '../types';
import { Num, GeoControl } from './fields';
import { GeoSpec, resolveGeo, ResolvedGeo } from '../utils/cities';

interface InputFormProps {
  onCalculate: (data: { year: number; month: number; day: number; hour?: number; minute: number; gender: Gender; geo?: ResolvedGeo }) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onCalculate }) => {
  const [dateValue, setDateValue] = useState({ year: 2000, month: 6, day: 15 });
  const [timeValue, setTimeValue] = useState({ hour: 12, minute: 30 });
  const [timeKnown, setTimeKnown] = useState(true);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [geoSpec, setGeoSpec] = useState<GeoSpec | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { year, month, day } = dateValue;
    const { hour, minute } = timeValue;
    // No hour → a 三柱 (year·month·day) reading; 真太阳时/birthplace only refine the hour.
    const geo = timeKnown && geoSpec ? resolveGeo(geoSpec, year, month, day, hour, minute) : undefined;
    onCalculate({ year, month, day, hour: timeKnown ? hour : undefined, minute: timeKnown ? minute : 0, gender, geo });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg glass-light p-10 relative shadow-2xl border-black/5">

      <div className="text-center mb-10 border-b border-black/5 pb-6">
        <h3 className="font-display text-2xl tracking-wide text-ink">Your birth moment</h3>
        <p className="text-[10px] font-sans text-sage-deep uppercase tracking-[0.3em] mt-3">Date · time · sex</p>
      </div>

      <div className="space-y-8 relative z-10">

        {/* Date & time */}
        <div className="grid grid-cols-3 gap-3">
          <Num label="Year" value={dateValue.year} min={1900} max={2100} onChange={(year) => setDateValue({ ...dateValue, year })} />
          <Num label="Month" value={dateValue.month} min={1} max={12} onChange={(month) => setDateValue({ ...dateValue, month })} />
          <Num label="Day" value={dateValue.day} min={1} max={31} onChange={(day) => setDateValue({ ...dateValue, day })} />
          {timeKnown && <>
            <Num label="Hour" value={timeValue.hour} min={0} max={23} onChange={(hour) => setTimeValue({ ...timeValue, hour })} />
            <Num label="Min" value={timeValue.minute} min={0} max={59} onChange={(minute) => setTimeValue({ ...timeValue, minute })} />
          </>}
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-left">
          <input type="checkbox" checked={!timeKnown} onChange={(e) => setTimeKnown(!e.target.checked)} className="mt-0.5 h-4 w-4 accent-sage" />
          <span className="text-xs leading-relaxed text-stone">
            I don't know my birth hour.
            {!timeKnown && <span className="mt-1 block text-stone/70">We'll read your year, season, and day — a fuller reading than most give. The hour would only add the finer grain of your later years and inner life.</span>}
          </span>
        </label>

        {timeKnown && <GeoControl onChange={setGeoSpec} />}

        {/* Sex (sets the direction of the life seasons) */}
        <div className="bg-black/[0.02] p-6 border border-black/5 rounded-lg">
          <p className="text-[10px] font-sans text-stone uppercase tracking-[0.2em] text-center mb-4">Sex at birth</p>
          <div className="flex justify-center gap-8">
            <button
              type="button"
              onClick={() => setGender(Gender.MALE)}
              className={`w-32 py-3 border rounded-full font-semibold text-xs uppercase tracking-widest transition-all duration-500 ${gender === Gender.MALE ? 'border-sage bg-sage text-white' : 'border-black/10 text-stone hover:border-sage hover:text-sage-deep'}`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender(Gender.FEMALE)}
              className={`w-32 py-3 border rounded-full font-semibold text-xs uppercase tracking-widest transition-all duration-500 ${gender === Gender.FEMALE ? 'border-sage bg-sage text-white' : 'border-black/10 text-stone hover:border-sage hover:text-sage-deep'}`}
            >
              Female
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-sage hover:bg-sage-deep text-white font-display font-semibold py-5 rounded-full transition-all duration-500 tracking-[0.2em] uppercase group relative overflow-hidden"
        >
          <span className="relative z-10 group-hover:tracking-[0.35em] transition-all duration-500">Reveal my nature</span>
        </button>
      </div>
    </form>
  );
};
