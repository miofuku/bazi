import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { NatureResult } from './components/result/NatureResult';
import { calculateBazi } from './services/baziService';
import { BaziChart, Gender } from './types';
import { Methodology } from './components/Methodology';
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
      <div className="flex items-center gap-3 group cursor-pointer" onClick={onHome}>
        <span className="text-sage"><Sprig className="w-7 h-7" /></span>
        <div className="flex flex-col leading-none">
          <h1 className="text-lg font-display font-semibold tracking-tight text-ink">Rootwise</h1>
          <span className="text-[10px] font-sans text-stone tracking-[0.18em] uppercase mt-1">Your nature, by season</span>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-10">
        {[['The idea', 'idea'], ['The method', 'method']].map(([label, id]) => (
          <span
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            className="text-xs font-sans font-medium uppercase tracking-widest text-stone hover:text-sage cursor-pointer transition-colors"
          >
            {label}
          </span>
        ))}
      </nav>
    </div>
  </header>
);

const App: React.FC = () => {
  const [chart, setChart] = useState<BaziChart | null>(null);

  const handleCalculate = (data: { year: number; month: number; day: number; hour: number; minute: number; gender: Gender }) => {
    try {
      const result = calculateBazi(data.year, data.month, data.day, data.hour, data.minute, data.gender);
      result.date = new Date(data.year, data.month - 1, data.day, data.hour, data.minute);
      setChart(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert('Could not read this birth moment. Please check the date and try again.');
      console.error(error);
    }
  };

  const resetApp = () => {
    setChart(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-ink font-sans generative-bg">
      <Header onHome={resetApp} />
      <GrowthFlow />

      <main className={`relative z-10 ${chart ? 'pt-28 pb-24 px-4 md:px-6 max-w-4xl mx-auto' : 'h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth'}`}>
        {!chart ? (
          <>
            {/* HERO */}
            <section className="h-screen w-full snap-start flex flex-col items-center justify-center px-6 pt-20">
              <div className="max-w-3xl mx-auto text-center">
                <span className="text-sage mx-auto mb-8 inline-block"><Sprig className="w-12 h-12" /></span>
                <h2 className="text-5xl md:text-7xl font-display font-semibold text-ink mb-8 tracking-tight leading-[1.05]">
                  Your birthday holds <span className="text-sage italic">your nature</span>.
                </h2>
                <p className="text-lg md:text-xl font-sans text-stone max-w-2xl mx-auto leading-relaxed mb-12">
                  In the old Chinese art of 八字象法, each of us is a living thing — a tree, a river, a flame — born into a particular season. Rootwise reads your birth as that image: who you are, and the conditions that help you flourish.
                </p>
                <div className="flex justify-center gap-5 flex-wrap">
                  <button
                    onClick={() => document.getElementById('begin')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-sage hover:bg-sage-deep text-white px-9 py-4 font-sans font-semibold uppercase tracking-widest transition-all rounded-full text-xs md:text-sm"
                  >
                    Reveal my nature
                  </button>
                  <button
                    onClick={() => document.getElementById('idea')?.scrollIntoView({ behavior: 'smooth' })}
                    className="border border-ink/15 hover:border-sage/60 text-ink px-9 py-4 font-sans font-semibold uppercase tracking-widest transition-all rounded-full hover:bg-sage/5 text-xs md:text-sm"
                  >
                    The idea
                  </button>
                </div>
              </div>
            </section>

            {/* THE IDEA */}
            <section id="idea" className="h-screen w-full snap-start flex flex-col items-center justify-center px-8 border-y border-black/5 bg-mist/40 backdrop-blur-sm">
              <div className="max-w-3xl mx-auto text-center">
                <span className="inline-block px-3 py-1 bg-sage text-white text-[11px] uppercase tracking-[0.3em] font-semibold mb-8 rounded-full">The idea</span>
                <h3 className="text-4xl md:text-5xl font-display font-semibold text-ink mb-10 tracking-tight">A person is a part of nature</h3>
                <p className="text-2xl md:text-3xl font-display text-ink leading-snug italic">
                  “The same forces that shape a tree, a field, or a river shape a person. Your birth names which living thing you are — and the season you were born into is the climate you first had to grow in.”
                </p>
              </div>
            </section>

            {/* THE METHOD */}
            <section id="method" className="min-h-screen w-full snap-start flex flex-col items-center justify-center px-6 py-24">
              <div className="max-w-5xl mx-auto w-full">
                <Methodology />
              </div>
            </section>

            {/* INPUT */}
            <section id="begin" className="h-screen w-full snap-start flex flex-col items-center justify-center px-6">
              <div className="animate-slide-up w-full max-w-4xl mx-auto flex flex-col items-center text-center">
                <span className="inline-block px-3 py-1 bg-sage text-white text-[11px] uppercase tracking-[0.3em] font-semibold mb-8 rounded-full">Begin</span>
                <h3 className="text-4xl md:text-5xl font-display font-semibold text-ink mb-4 tracking-tight">When were you born?</h3>
                <p className="text-stone mb-12 max-w-md">Your date, time, and sex set the four pillars and the seasons of your life ahead.</p>
                <InputForm onCalculate={handleCalculate} />
              </div>
            </section>
          </>
        ) : (
          <div className="animate-fade-in">
            <button
              onClick={resetApp}
              className="text-stone hover:text-sage text-xs font-semibold uppercase tracking-widest transition-colors mb-10 flex items-center gap-2"
            >
              <span>←</span> Read another
            </button>
            <NatureResult chart={chart} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
