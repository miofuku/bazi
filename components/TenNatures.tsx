import React from 'react';
import { STEM_PROFILES, StemChar } from './../content/xiangfa';
import { NatureArt } from './illustrations/NatureArt';
import { ELEMENT_HEX } from './illustrations/ForceArt';

// Ordered by force family: growth, warmth, ground, structure, flow.
const ORDER: StemChar[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// The full field-guide gallery of the ten natures — illustration-led, no glyphs.
export const TenNatures: React.FC = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
    {ORDER.map((c) => {
      const p = STEM_PROFILES[c];
      const accent = ELEMENT_HEX[p.element];
      return (
        <div
          key={c}
          className="group flex flex-col items-center rounded-2xl bg-white/50 p-5 text-center ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1 hover:bg-white/75"
        >
          <NatureArt id={p.symbol} accent={accent} className="h-20 w-20 transition-transform duration-500 group-hover:scale-105" />
          <h4 className="mt-4 font-display text-lg font-semibold text-ink">{p.archetypeName}</h4>
          <p className="mt-1 text-xs leading-snug text-stone">{p.imageTitle}</p>
        </div>
      );
    })}
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
