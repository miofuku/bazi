import React, { useEffect, useMemo } from 'react';
import { BaziChart } from '../../types';
import { buildXiangfaReading } from '../../content/xiangfa';
import { getAtmosphere } from '../../content/xiangfa/atmosphere';
import { AtmosphereProvider } from './AtmosphereContext';
import { ElementIcon } from './icons';
import { YourNature } from './YourNature';
import { SeasonEnvironment } from './SeasonEnvironment';
import { ThriveNeeds } from './ThriveNeeds';
import { PillarsView } from './PillarsView';
import { InnerClimate } from './InnerClimate';

const Divider: React.FC<{ accent: string }> = ({ accent }) => (
  <div className="mx-auto h-px w-16" style={{ background: `${accent}40` }} />
);

export const NatureResult: React.FC<{ chart: BaziChart; onReset: () => void }> = ({ chart, onReset }) => {
  const reading = useMemo(() => buildXiangfaReading(chart), [chart]);
  const atmo = useMemo(() => getAtmosphere(reading.stem.element, reading.season.season), [reading]);

  // Tint the page (and mobile browser chrome) to the reading while it's open.
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = atmo.wash;
    return () => { document.body.style.background = prev; };
  }, [atmo]);

  return (
    <AtmosphereProvider value={{ accent: atmo.accent, accentDeep: atmo.accentDeep }}>
      {/* Fixed wash + giant watermark behind the scrolling reading */}
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: atmo.wash }} aria-hidden>
        <span
          className="absolute -right-16 bottom-[-6rem] font-sc font-semibold leading-none select-none"
          style={{ fontSize: '40rem', color: atmo.glyphWash }}
        >
          {reading.stem.stem}
        </span>
      </div>

      {/* Floating back control */}
      <button
        onClick={onReset}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink/70 backdrop-blur-md transition-colors hover:text-ink"
      >
        <span>←</span> Read another
      </button>

      {/* ---- HERO: immersive, themed to element + season ---- */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ background: atmo.hero, color: atmo.heroText }}
      >
        {/* Giant day-master glyph watermark */}
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sc font-semibold leading-none select-none"
          style={{ fontSize: '34rem', color: atmo.glyphHero }}
          aria-hidden
        >
          {reading.stem.stem}
        </span>

        <div className="relative z-10 max-w-2xl">
          {chart.date && (
            <p className="font-sans text-[11px] uppercase tracking-[0.4em]" style={{ color: atmo.heroTextSoft }}>
              {chart.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}

          <div className="my-8 flex justify-center" style={{ color: atmo.accent }}>
            <ElementIcon type={reading.stem.symbol} className="h-12 w-12 stroke-[1.1]" />
          </div>

          <h1 className="font-display text-4xl font-medium leading-[1.12] md:text-6xl">
            You are {lowerFirst(reading.stem.imageTitle)},
          </h1>
          <p className="mt-3 font-display text-2xl italic md:text-3xl" style={{ color: atmo.heroTextSoft }}>
            {lowerFirst(reading.season.environmentTitle)}.
          </p>

          <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed" style={{ color: atmo.heroTextSoft }}>
            {reading.stem.thrivingLine}
          </p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ color: atmo.heroTextSoft }} aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ---- READING: over the soft themed wash ---- */}
      <div className="relative z-10 mx-auto max-w-4xl space-y-20 px-4 py-24 md:px-6">
        <YourNature stem={reading.stem} />
        <Divider accent={atmo.accent} />
        <SeasonEnvironment season={reading.season} />
        <Divider accent={atmo.accent} />
        <ThriveNeeds needStatus={reading.needStatus} />
        <Divider accent={atmo.accent} />
        <InnerClimate
          elementShare={reading.elementShare}
          dominantElement={reading.dominantElement}
          weakestElement={reading.weakestElement}
        />
        <Divider accent={atmo.accent} />
        <section>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: atmo.accentDeep }}>
            Your four pillars
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">The moment, in full</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">
            The year, season, day, and hour of your birth, each a stem above an earthly branch. The Day is you; the rest is the world you arrived into.
          </p>
          <div className="mt-8">
            <PillarsView chart={chart} />
          </div>
        </section>

        <p className="border-t border-ink/5 pt-8 text-center text-xs italic leading-relaxed text-stone">
          八字象法 reads your birth as a living image in nature — a way to understand yourself, not a prediction of fortune.
        </p>
      </div>
    </AtmosphereProvider>
  );
};

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
