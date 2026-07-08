import React from 'react';
import { LifeSeason } from '../../content/xiangfa/relationships';
import { ELEMENT_HEX, WIND } from '../../utils/tokens';
import { useAccent } from './AtmosphereContext';

const TONE_DOT: Record<LifeSeason['tone'], string> = {
  kind: 'a kind season',
  steady: 'a steady season',
  demanding: 'a demanding season',
};

// 用神 favorability of a decade → a wind (weather voice, not fortune): does the
// 大运's 干支 bring what this nature needs, or test it?
type Wind = { label: string; hex: string; blurb: string };
const windOf = (favor: number): Wind =>
  favor > 0.15
    ? { label: 'Tailwind', hex: WIND.tailwind, blurb: 'the weather leans your way — energy comes cheaper here' }
    : favor < -0.15
    ? { label: 'Headwind', hex: WIND.headwind, blurb: 'the weather tests you — a decade to conserve and root, not force' }
    : { label: 'Even wind', hex: WIND.even, blurb: 'neither with you nor against you — a decade of steady tending' };

// "The seasons ahead" — the decade-long climates of a life (Da Yun), with the
// season you're living in now marked.
export const LifeSeasons: React.FC<{ seasons: LifeSeason[] }> = ({ seasons }) => {
  const { accent, accentDeep } = useAccent();
  const current = seasons.find((s) => s.current);

  return (
    <section>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>The seasons ahead</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">Your life moves through long weathers</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
        Beyond the season you were born into, life turns through longer climates — each lasting about a decade, each asking and offering something different. They're simply the weather you'll be growing in.
      </p>

      {current && (
        <div className="mt-6 rounded-2xl p-6 ring-1" style={{ background: `${accent}12`, borderColor: `${accent}40`, ['--tw-ring-color' as any]: `${accent}40` }}>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest" style={{ color: accentDeep }}>
            Right now · ages {current.startAge}–{current.endAge}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
            <span className="font-display font-semibold text-ink">{current.label.toLowerCase()} years — {TONE_DOT[current.tone]}.</span>{' '}
            {current.theme}{current.note ? ` ${current.note}` : ''}
          </p>
          {(() => { const w = windOf(current.favor); return (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider" style={{ background: `${w.hex}1f`, color: w.hex }}>{w.label}</span>
              <span className="text-ink/70">{w.blurb}.</span>
            </p>
          ); })()}
        </div>
      )}

      {/* Timeline — wraps so every decade is visible at once */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {seasons.map((s) => {
          const hex = ELEMENT_HEX[s.element];
          const w = windOf(s.favor);
          return (
            <div
              key={s.startAge}
              className={`relative rounded-xl bg-white/55 p-4 ring-1 transition-all ${s.current ? '' : 'ring-ink/5'}`}
              style={s.current ? ({ ['--tw-ring-color' as any]: `${accent}66`, boxShadow: `0 0 0 1.5px ${accent}88` }) : undefined}
            >
              <div className="h-1.5 w-full rounded-full" style={{ background: hex, opacity: 0.8 }} />
              <div className="mt-3 flex items-baseline justify-between">
                <p className="font-display text-lg font-semibold text-ink">{s.startAge}–{s.endAge}</p>
                <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider" style={{ background: `${w.hex}1f`, color: w.hex }}>{w.label}</span>
              </div>
              <p className="text-[11px] uppercase tracking-wider text-stone/70">from {s.startYear}</p>
              <p className="mt-3 text-sm font-semibold" style={{ color: hex }}>
                {s.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink/65">{s.blurb}</p>
              {s.current && (
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: accentDeep }}>● You are here</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
