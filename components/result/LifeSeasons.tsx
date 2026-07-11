import React, { useState } from 'react';
import { LifeSeason } from '../../content/xiangfa/relationships';
import { ELEMENT_HEX, WIND } from '../../utils/tokens';
import { useAccent } from './AtmosphereContext';

const TONE_DOT: Record<LifeSeason['tone'], string> = {
  kind: 'a kind season',
  steady: 'a steady season',
  demanding: 'a demanding season',
};

// 用神 favorability of a decade → a wind (weather voice, not fortune): does the
// 大运's 干支 bring what this nature needs, or test it? `band` widens the
// neutral zone for borderline charts (honesty hedge — see utils/tokens.ts).
type Wind = { label: string; hex: string; blurb: string };
const windOf = (favor: number, band: number): Wind =>
  favor > band
    ? { label: 'Tailwind', hex: WIND.tailwind, blurb: 'the weather leans your way — energy comes cheaper here' }
    : favor < -band
    ? { label: 'Headwind', hex: WIND.headwind, blurb: 'the weather tests you — a decade to conserve and root, not force' }
    : { label: 'Even wind', hex: WIND.even, blurb: 'neither with you nor against you — a decade of steady tending' };

// "The seasons ahead" — the decade-long climates of a life (Da Yun). The card
// you're living in is marked; tap any decade to read its detail in the panel.
export const LifeSeasons: React.FC<{ seasons: LifeSeason[]; band?: number }> = ({ seasons, band = 0.15 }) => {
  const { accent, accentDeep } = useAccent();
  const currentIdx = seasons.findIndex((s) => s.current);
  const [selectedIdx, setSelectedIdx] = useState(currentIdx >= 0 ? currentIdx : 0);

  const selected = seasons[selectedIdx] ?? seasons[0];
  const when = selected.current
    ? 'Right now'
    : currentIdx < 0 ? 'This decade'
    : selectedIdx > currentIdx ? 'Ahead' : 'Earlier';
  const sw = windOf(selected.favor, band);

  return (
    <section>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>The seasons ahead</p>
      <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">Your life moves through long weathers</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
        Beyond the season you were born into, life turns through longer climates — each lasting about a decade, each asking and offering something different. They're simply the weather you'll be growing in.
      </p>

      {/* Detail panel for the selected decade (defaults to the one you're in) */}
      <div className="mt-6 rounded-2xl p-6 ring-1" style={{ background: `${accent}12`, borderColor: `${accent}40`, ['--tw-ring-color' as any]: `${accent}40` }} aria-live="polite">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-widest" style={{ color: accentDeep }}>
          {when} · ages {selected.startAge}–{selected.endAge} · from {selected.startYear}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink/85">
          <span className="font-display font-semibold text-ink">{selected.label.toLowerCase()} years — {TONE_DOT[selected.tone]}.</span>{' '}
          {selected.theme}{selected.note ? ` ${selected.note}` : ''}
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider" style={{ background: `${sw.hex}1f`, color: sw.hex }}>{sw.label}</span>
          <span className="text-ink/70">{sw.blurb}.</span>
        </p>
      </div>

      <p className="mt-8 mb-3 text-[11px] font-semibold uppercase tracking-widest text-stone/50">The decades · tap one to read it</p>

      {/* Timeline — wraps so every decade is visible at once; each is selectable */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {seasons.map((s, i) => {
          const hex = ELEMENT_HEX[s.element];
          const w = windOf(s.favor, band);
          const isSel = i === selectedIdx;
          return (
            <button
              type="button"
              key={s.startAge}
              onClick={() => setSelectedIdx(i)}
              aria-pressed={isSel}
              className={`relative cursor-pointer rounded-xl bg-white/55 p-4 text-left ring-1 transition-all hover:-translate-y-0.5 hover:bg-white/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage ${isSel ? '' : 'ring-ink/5'}`}
              style={isSel ? ({ ['--tw-ring-color' as any]: `${accent}66`, boxShadow: `0 0 0 1.5px ${accent}88` }) : undefined}
            >
              <div className="h-1.5 w-full rounded-full" style={{ background: hex, opacity: 0.8 }} />
              <div className="mt-3 flex items-baseline justify-between">
                <p className="font-display text-lg font-semibold text-ink">{s.startAge}–{s.endAge}</p>
                <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider" style={{ background: `${w.hex}1f`, color: w.hex }}>{w.label}</span>
              </div>
              <p className="text-[11px] uppercase tracking-wider text-stone/70">from {s.startYear}</p>
              <p className="mt-3 text-sm font-semibold" style={{ color: hex }}>{s.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/65">{s.blurb}</p>
              {s.current && (
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: accentDeep }}>● You are here</p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
