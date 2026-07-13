import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BaziChart } from '../../types';
import { buildReading } from '../../content/xiangfa/reading';
import { computeDayFavor } from '../../services/dailyService';
import { windHex } from '../../utils/tokens';
import { AtmosphereProvider } from './AtmosphereContext';
import { ResultShell } from './ResultShell';
import { NatureArt } from '../illustrations/NatureArt';
import { ReadingGist } from './ReadingGist';
import { MovementHeader } from './Movement';
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

  // A quick path to today's weather. The daily section is the surface a returning
  // reader comes back for, yet it sits deep in the scroll — so a floating jump
  // stays available (even from the hero), and fades out only while it's on screen.
  const dailyRef = useRef<HTMLDivElement>(null);
  const [atDaily, setAtDaily] = useState(false);
  useEffect(() => {
    const el = dailyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtDaily(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const jumpToDaily = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    dailyRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  // A live preview on the jump button: today's date, ringed in today's own
  // weather colour (the same wind gradient the calendar uses).
  const todayDate = new Date().getDate();
  const todayFavor = useMemo(() => computeDayFavor(chart, new Date())?.favor ?? 0, [chart]);

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

      {/* Floating jump to today's weather — the return-visitor's fast path.
          Fades out while the daily section is on screen. */}
      <button
        onClick={jumpToDaily}
        aria-label="Jump to today's weather"
        className={`group fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-white/80 py-1.5 pl-2 pr-4 shadow-lift ring-1 ring-ink/5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white ${atDaily ? 'pointer-events-none translate-y-2 opacity-0' : 'opacity-100'}`}
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold tabular-nums text-ink shadow-sm ring-2"
          style={{ ['--tw-ring-color' as any]: windHex(todayFavor) }}
          aria-hidden
        >
          {todayDate}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink/70">Today’s weather</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink/35 transition-transform group-hover:translate-y-0.5" aria-hidden>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

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
        <ReadingGist
          current={lifeSeasons.find((s) => s.current)}
          topNeed={reading.needStatus.find((n) => n.status === 'scarce')}
        />

        <MovementHeader
          id="part-nature"
          kicker="Part one"
          title="The living thing you are"
          desc="Your nature, and the conditions it grows in."
        />
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

        <MovementHeader
          id="part-weather"
          kicker="Part two"
          title="The weather you grow in"
          desc="The long seasons of your life — and the day you’re in."
        />
        <LifeSeasons seasons={lifeSeasons} />
        <Divider accent={atmo.accent} />
        <div id="daily-weather" ref={dailyRef}>
          <DailyCalendar chart={chart} />
        </div>

        <MovementHeader
          id="part-practice"
          kicker="Part three"
          title="Growing on purpose"
          desc="Your whole story in one line, and how to carry it on."
        />
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
