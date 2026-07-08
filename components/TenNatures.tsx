import React from 'react';
import { STEM_PROFILES, StemChar } from './../content/xiangfa';
import { ElementType } from '../types';
import { NatureArt } from './illustrations/NatureArt';
import { ELEMENT_HEX } from './illustrations/ForceArt';

// The five forces, each a Yang·Yin pair (阳干 above 阴干) — one column per element.
const PAIRS: [StemChar, StemChar][] = [
  ['甲', '乙'], ['丙', '丁'], ['戊', '己'], ['庚', '辛'], ['壬', '癸'],
];
// Each element's plain-English force name, used as the column header.
const FORCE_NAME: Record<ElementType, string> = {
  [ElementType.WOOD]: 'Growth', [ElementType.FIRE]: 'Warmth', [ElementType.EARTH]: 'Ground',
  [ElementType.METAL]: 'Structure', [ElementType.WATER]: 'Flow',
};

// One nature: an illustration-led card that reveals a detail bubble on hover / focus.
const NatureCard: React.FC<{ c: StemChar }> = ({ c }) => {
  const p = STEM_PROFILES[c];
  const accent = ELEMENT_HEX[p.element];
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex w-full flex-col items-center rounded-2xl bg-white/50 p-5 text-center ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1 hover:bg-white/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
      >
        <NatureArt id={p.symbol} accent={accent} className="h-20 w-20 transition-transform duration-500 group-hover:scale-105" />
        <h4 className="mt-4 font-display text-lg font-semibold text-ink">{p.archetypeName}</h4>
        <p className="mt-1 min-h-[2.75em] text-xs leading-snug text-stone">{p.imageTitle}</p>
      </button>

      {/* Detail bubble — appears on hover / keyboard focus */}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-72 max-w-[80vw] -translate-x-1/2 translate-y-1 rounded-2xl bg-white p-5 text-left opacity-0 shadow-xl ring-1 ring-ink/10 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        <div className="flex items-center gap-3">
          <NatureArt id={p.symbol} accent={accent} className="h-10 w-10 shrink-0" />
          <div>
            <h5 className="font-display text-base font-semibold text-ink">{p.archetypeName}</h5>
            <p className="text-[11px] uppercase tracking-wider" style={{ color: accent }}>
              {p.polarity} {p.element}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink/80">{p.essence}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.strengths.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full px-2.5 py-0.5 text-[11px]"
              style={{ background: `${accent}1f`, color: accent }}
            >
              {s}
            </span>
          ))}
        </div>

        <p className="mt-3 border-t border-ink/5 pt-2 text-xs italic leading-relaxed text-stone">
          {p.thrivingLine}
        </p>

        {/* little pointer */}
        <div className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white ring-1 ring-ink/10" />
      </div>
    </div>
  );
};

// The field-guide gallery: five columns, one per force — the 阳 nature above its 阴 twin.
export const TenNatures: React.FC = () => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-5">
    {PAIRS.map(([yang, yin]) => (
      <div key={yang} className="flex flex-col gap-4">
        <p className="text-center font-sans text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: `${ELEMENT_HEX[STEM_PROFILES[yang].element]}c0` }}>
          {FORCE_NAME[STEM_PROFILES[yang].element]}
        </p>
        <NatureCard c={yang} />
        <NatureCard c={yin} />
      </div>
    ))}
  </div>
);

// A staggered cluster of natures for the hero.
const MOTIF: StemChar[] = ['甲', '丙', '壬', '戊', '辛', '癸'];

export const StemMotif: React.FC = () => (
  <div className="grid grid-cols-3 gap-3">
    {MOTIF.map((c, i) => {
      const p = STEM_PROFILES[c];
      return (
        <NatureArt
          key={c}
          id={p.symbol}
          accent={ELEMENT_HEX[p.element]}
          className={`h-24 w-24 animate-fade-in ${i % 2 === 1 ? 'translate-y-5' : ''}`}
        />
      );
    })}
  </div>
);
