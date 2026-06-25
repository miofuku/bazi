import React from 'react';
import { StemImageProfile } from '../../content/xiangfa';
import { NatureArt } from '../illustrations/NatureArt';
import { useAccent } from './AtmosphereContext';

// "Your Nature" — the person rendered as a living natural image.
export const YourNature: React.FC<{ stem: StemImageProfile }> = ({ stem }) => {
  const { accent, accentDeep } = useAccent();
  return (
    <section className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
      <NatureArt id={stem.symbol} accent={accent} className="h-40 w-40 md:h-44 md:w-44" />

      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: accentDeep }}>Your nature</p>
        <h2 className="mt-2 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">{stem.archetypeName}</h2>
        <p className="mt-3 font-display text-lg italic text-stone">{stem.imageTitle}</p>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink/80">{stem.essence}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-widest" style={{ color: accentDeep }}>What you bring</h3>
            <ul className="space-y-2">
              {stem.strengths.map((s) => (
                <li key={s} className="flex gap-2 text-sm text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-widest text-clay">Growth edges</h3>
            <ul className="space-y-2">
              {stem.growthEdges.map((g) => (
                <li key={g} className="flex gap-2 text-sm text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />{g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
