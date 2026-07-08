import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { PairInputForm } from './components/PairInputForm';
import { NatureResult } from './components/result/NatureResult';
import { Compatibility } from './components/result/Compatibility';
import { calculateBazi } from './services/baziService';
import { analyzePair, PairResult, Birth } from './services/compatibilityService';
import { RelationLens } from './utils/CompatibilityAnalyzer';
import { ResolvedGeo } from './utils/cities';
import { BaziChart, Gender } from './types';
import { Methodology } from './components/Methodology';
import { TenNatures, StemMotif } from './components/TenNatures';
import { Footer } from './components/Footer';

// A quiet, growing-vine line that drifts across the background.
const GrowthFlow = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
    <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6E8B6A" stopOpacity="0.14" />
          <stop offset="50%" stopColor="#F7F5EF" stopOpacity="0" />
          <stop offset="100%" stopColor="#6E8B6A" stopOpacity="0.10" />
        </linearGradient>
      </defs>
      <path d="M-100,400 C200,300 400,600 700,400 C1000,200 1300,500 1500,400" stroke="url(#leaf-grad)" strokeWidth="1.5" fill="none" className="animate-flow" />
      <path d="M-100,500 C200,400 500,700 800,500 C1100,300 1400,600 1600,500" stroke="url(#leaf-grad)" strokeWidth="0.8" fill="none" className="animate-flow [animation-delay:-3s]" />
      <path d="M-100,300 C300,200 600,500 900,300 C1200,100 1400,400 1600,300" stroke="url(#leaf-grad)" strokeWidth="0.8" fill="none" className="animate-flow [animation-delay:-7s]" />
    </svg>
  </div>
);

const Sprig: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22V8" />
    <path d="M12 13C12 13 6 11 6 6.5C6 3.8 8.6 2.8 12 7" />
    <path d="M12 11C12 11 18 9.5 18 5.5C18 3.2 15.6 2.4 12 6" />
  </svg>
);

const Header: React.FC<{ onHome: () => void }> = ({ onHome }) => (
  <header className="fixed top-0 left-0 w-full z-50 bg-canvas/80 backdrop-blur-md border-b border-black/5">
    <div className="max-w-5xl mx-auto px-6 h-20 flex justify-between items-center">
      <button type="button" onClick={onHome} aria-label="Rootwise — back to start" className="flex items-center gap-3 rounded-lg">
        <span className="text-sage"><Sprig className="w-7 h-7" /></span>
        <span className="flex flex-col items-start leading-none">
          <span className="text-lg font-display font-semibold tracking-tight text-ink">Rootwise</span>
          <span className="text-[10px] font-sans text-stone tracking-[0.18em] uppercase mt-1">Your nature, by season</span>
        </span>
      </button>
      <nav className="hidden md:flex items-center gap-10">
        {[['The ten natures', 'natures'], ['How it reads', 'method'], ['Begin', 'begin']].map(([label, id]) => (
          <button
            key={id}
            type="button"
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded text-xs font-sans font-medium uppercase tracking-widest text-stone hover:text-sage transition-colors"
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  </header>
);

const App: React.FC = () => {
  const [chart, setChart] = useState<BaziChart | null>(null);
  const [mode, setMode] = useState<'single' | 'pair'>('single');
  const [pair, setPair] = useState<PairResult | null>(null);
  const [births, setBirths] = useState<[Birth, Birth] | null>(null);
  const [lens, setLens] = useState<RelationLens>('partner');
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (data: { year: number; month: number; day: number; hour?: number; minute: number; gender: Gender; geo?: ResolvedGeo }) => {
    try {
      setError(null);
      const result = calculateBazi(data.year, data.month, data.day, data.hour, data.minute, data.gender, data.geo);
      result.date = new Date(data.year, data.month - 1, data.day, data.hour, data.minute);
      setChart(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Could not read this birth moment. Please check the date and try again.');
      console.error(err);
    }
  };

  const handleAnalyzePair = (a: Birth, b: Birth, l: RelationLens) => {
    try {
      setError(null);
      setBirths([a, b]);
      setLens(l);
      setPair(analyzePair(a, b, l));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Could not read one of these birth moments. Please check the dates and try again.');
      console.error(err);
    }
  };

  const changeLens = (l: RelationLens) => {
    setLens(l);
    if (births) setPair(analyzePair(births[0], births[1], l));
  };

  const resetApp = () => {
    setChart(null);
    setPair(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pair) {
    return (
      <div className="relative min-h-screen text-ink font-sans">
        <Compatibility result={pair} lens={lens} onLensChange={changeLens} onReset={resetApp} />
        <Footer />
      </div>
    );
  }

  if (chart) {
    return (
      <div className="relative min-h-screen text-ink font-sans">
        <NatureResult chart={chart} onReset={resetApp} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-ink font-sans">
      <div className="fixed inset-0 -z-10 season-sky" aria-hidden />
      <Header onHome={resetApp} />
      <GrowthFlow />

      <main className="relative z-10">
        {/* HERO — editorial, asymmetric */}
        <section className="relative flex min-h-screen items-center px-6 pt-24 pb-16">
          <div className="mx-auto grid w-full max-w-5xl items-center gap-14 md:grid-cols-[1.45fr_1fr]">
            <div className="animate-slide-up">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-deep">
                You are a part of nature
              </p>
              <h1 className="mt-7 font-display text-5xl font-semibold leading-[1.0] tracking-tight text-ink md:text-7xl">
                You're not a sign.
                <br />
                <span className="italic text-sage">You're a living thing.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg font-sans leading-relaxed text-stone">
                A tree grows toward light; a river finds its channel; a seed waits for its season. People grow by the same rules. Rootwise shows you the living thing you are, the climate you grew up in, and the conditions that help you flourish.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById('begin')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full bg-sage px-9 py-4 font-sans text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-sage-deep md:text-sm"
                >
                  Find your nature
                </button>
                <button
                  onClick={() => document.getElementById('natures')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full border border-ink/15 px-9 py-4 font-sans text-xs font-semibold uppercase tracking-widest text-ink transition-all hover:border-sage/60 hover:bg-sage/5 md:text-sm"
                >
                  See the ten natures
                </button>
              </div>
            </div>

            {/* Specimen sheet of the ten glyphs */}
            <div className="hidden md:block">
              <StemMotif />
            </div>
          </div>
        </section>

        {/* PULL QUOTE — editorial band */}
        <section className="border-y border-ink/5 bg-mist/40 px-6 py-28 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl">
            <p className="font-display text-3xl leading-snug text-ink md:text-[2.6rem] md:leading-[1.25]">
              <span className="text-sage">“</span>The same forces that shape a tree, a field, or a river shape a person. Your birth names which living thing you are — and the season you were born into is the climate you first had to grow in.<span className="text-sage">”</span>
            </p>
          </div>
        </section>

        {/* THE TEN NATURES — the field guide */}
        <section id="natures" className="px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-deep">The ten natures</p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                  Everyone is one of ten living things
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-stone">
                Your day of birth decides which — then the season you arrived in colours everything. Find yours below.
              </p>
            </div>
            <TenNatures />
          </div>
        </section>

        {/* HOW IT READS */}
        <section id="method" className="border-y border-ink/5 bg-mist/40 px-6 py-28">
          <div className="mx-auto w-full max-w-5xl">
            <Methodology />
          </div>
        </section>

        {/* BEGIN */}
        <section id="begin" className="px-6 py-28">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-sage-deep">Begin</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              {mode === 'single' ? 'When were you born?' : 'How do two natures fit?'}
            </h2>
            <p className="mb-8 mt-4 max-w-md text-stone">
              {mode === 'single'
                ? 'Your date, time, and place in the year reveal the living thing you are — and the seasons of the life ahead.'
                : 'Two birth moments — a co-founder, a partner, a friend. See what each brings the other, where roles fit, and the days that suit you both.'}
            </p>

            {/* single / pair toggle */}
            <div className="mb-12 inline-flex rounded-full border border-ink/10 p-1">
              {(['single', 'pair'] as const).map((m) => (
                <button key={m} type="button" onClick={() => { setMode(m); setError(null); }}
                  className={`rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${mode === m ? 'bg-sage text-white' : 'text-stone hover:text-sage'}`}>
                  {m === 'single' ? 'One nature' : 'Two natures'}
                </button>
              ))}
            </div>

            {error && (
              <p role="alert" className="mb-8 w-full max-w-md rounded-xl border border-fire/20 bg-fire/10 px-4 py-3 text-sm text-fire">
                {error}
              </p>
            )}

            {mode === 'single'
              ? <InputForm onCalculate={handleCalculate} />
              : <PairInputForm onAnalyze={handleAnalyzePair} />}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
