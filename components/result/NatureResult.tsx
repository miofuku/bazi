import React, { useEffect, useMemo } from 'react';
import { BaziChart } from '../../types';
import { buildReading } from '../../content/xiangfa/reading';
import { AtmosphereProvider } from './AtmosphereContext';
import { ResultShell } from './ResultShell';
import { NatureArt } from '../illustrations/NatureArt';
import { YourNature } from './YourNature';
import { SeasonEnvironment } from './SeasonEnvironment';
import { ThriveNeeds } from './ThriveNeeds';
import { InnerClimate } from './InnerClimate';
import { Interactions } from './Interactions';
import { Relationships } from './Relationships';
import { LifeSeasons } from './LifeSeasons';
import { Storyline } from './Storyline';
import { DailyCalendar } from './DailyCalendar';
import { KeepYourReading } from './KeepYourReading';
import { ShareControl } from './ShareControl';
import { TheFullChart } from './TheFullChart';

const Divider: React.FC<{ accent: string }> = ({ accent }) => (
  <div className="mx-auto h-px w-16" style={{ background: `${accent}40` }} />
);

export const NatureResult: React.FC<{ chart: BaziChart; onReset: () => void }> = ({ chart, onReset }) => {
  const { reading, atmo, relationships, interactions, lifeSeasons, storyline } = useMemo(
    () => buildReading(chart, new Date().getFullYear()),
    [chart],
  );

  // Tint the page to the reading while it's open.
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = atmo.wash;
    return () => { document.body.style.background = prev; };
  }, [atmo]);

  return (
    <AtmosphereProvider value={{ accent: atmo.accent, accentDeep: atmo.accentDeep }}>
      <ResultShell
        onReset={onReset}
        background={
          <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: atmo.wash }} aria-hidden>
            <NatureArt id={reading.stem.symbol} accent={atmo.accent} className="absolute -right-32 bottom-[-10rem] h-[44rem] w-[44rem] opacity-30" />
          </div>
        }
      >
      {/* Floating share control — card + link in one action */}
      <ShareControl reading={reading} atmo={atmo} />

      {/* ---- HERO: immersive, themed to element + season ---- */}
      <section
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
        style={{ background: atmo.hero, color: atmo.heroText }}
      >
        <div className="relative z-10 flex max-w-2xl flex-col items-center">
          {chart.date && (
            <p className="font-sans text-[11px] uppercase tracking-[0.4em]" style={{ color: atmo.heroTextSoft }}>
              {chart.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
          {!chart.hourPillar && (
            <p className="mt-4 rounded-full px-4 py-1.5 text-[11px] tracking-wide" style={{ background: `${atmo.accent}22`, color: atmo.heroTextSoft }}>
              Read from your year, season & day — birth time unknown, so your later years and inner life stay lightly drawn.
            </p>
          )}

          <NatureArt id={reading.stem.symbol} accent={atmo.accent} className="my-8 h-52 w-52 md:h-60 md:w-60" />

          <h1 className="font-display text-4xl font-medium leading-[1.05] sm:text-5xl md:text-7xl">
            You are {reading.stem.archetypeName}.
          </h1>
          <p className="mt-4 font-display text-2xl italic md:text-3xl" style={{ color: atmo.heroTextSoft }}>
            {capitalize(reading.season.environmentTitle)}.
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
        <ThriveNeeds needStatus={reading.needStatus} natureName={reading.stem.archetypeName} />
        <Divider accent={atmo.accent} />
        <InnerClimate
          elementShare={reading.elementShare}
          dominantElement={reading.dominantElement}
          weakestElement={reading.weakestElement}
        />
        <Divider accent={atmo.accent} />
        <Interactions data={interactions} />
        <Divider accent={atmo.accent} />
        <Relationships items={relationships} />
        <Divider accent={atmo.accent} />
        <LifeSeasons seasons={lifeSeasons} />
        <Divider accent={atmo.accent} />
        <DailyCalendar chart={chart} />
        <Divider accent={atmo.accent} />
        <Storyline beats={storyline} />

        <p className="pt-4 text-center font-display text-lg italic text-stone">
          You are one small, particular part of the living world — and it has a place for exactly your kind.
        </p>

        <KeepYourReading />

        <TheFullChart chart={chart} />
      </div>
      </ResultShell>
    </AtmosphereProvider>
  );
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
