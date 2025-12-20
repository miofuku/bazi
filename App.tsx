import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { BaziChartDisplay } from './components/BaziChartDisplay';
import { ResultDashboard } from './components/ResultDashboard';
import { PrismDashboard } from './components/PrismDashboard';
import { calculateBazi } from './services/baziService';
import { BaziChart, Gender } from './types';
import { Methodology } from './components/Methodology';
import { Footer } from './components/Footer';

// Modern Energy Flow Background
const EnergyFlow = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
    <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C5A059" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#0B1221" stopOpacity="0" />
          <stop offset="100%" stopColor="#C5A059" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path d="M-100,400 C200,300 400,600 700,400 C1000,200 1300,500 1500,400" stroke="url(#flow-grad)" strokeWidth="2" fill="none" className="animate-flow" />
      <path d="M-100,500 C200,400 500,700 800,500 C1100,300 1400,600 1600,500" stroke="url(#flow-grad)" strokeWidth="1" fill="none" className="animate-flow [animation-delay:-3s]" />
      <path d="M-100,300 C300,200 600,500 900,300 C1200,100 1400,400 1600,300" stroke="url(#flow-grad)" strokeWidth="1" fill="none" className="animate-flow [animation-delay:-7s]" />
    </svg>
  </div>
);

// Minimalist Header
const Header: React.FC<{ onHome: () => void }> = ({ onHome }) => (
  <header className="fixed top-0 left-0 w-full z-50 bg-midnight/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
    <div className="max-w-6xl mx-auto px-6 h-24 flex justify-between items-center">
      <div
        className="flex items-center gap-4 group cursor-pointer"
        onClick={onHome}
      >
        <div className="w-10 h-10 border border-gold/30 flex items-center justify-center relative overflow-hidden transition-all duration-500 bg-white/5 group-hover:bg-gold group-hover:border-gold">
          <span className="font-serif font-bold text-xl z-10 text-gold group-hover:text-midnight transition-colors duration-500">C</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-serif tracking-[0.1em] text-slate-200 transition-colors font-bold uppercase">
            CHRONOSOPHY <span className="text-sm normal-case opacity-50 font-sans italic">(时智)</span>
          </h1>
          <span className="text-[10px] font-sans text-gold/60 tracking-[0.2em] uppercase">The Wisdom of Temporal Synergy.</span>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-10">
        {['System', 'Philosophy', 'About'].map((item) => (
          <span key={item} className="text-xs font-sans font-medium uppercase tracking-widest text-slate-400 hover:text-gold cursor-pointer transition-colors">
            {item}
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
      // Add date to result
      result.date = new Date(data.year, data.month - 1, data.day, data.hour, data.minute);
      setChart(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert("Could not calculate chart. Please ensure the date is valid and libraries are loaded.");
      console.error(error);
    }
  };

  const resetApp = () => {
    setChart(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-slate-200 font-sans generative-bg">
      <Header onHome={resetApp} />
      <EnergyFlow />

      <main className="pt-32 pb-24 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
        {!chart ? (
          <div className="animate-fade-in">
            {/* HERO SECTION */}
            <div className="text-center mb-24 pt-12">
              <div className="w-16 h-16 mx-auto mb-10 border border-gold/40 flex items-center justify-center rotate-45 group">
                <span className="font-serif text-3xl text-gold -rotate-45 group-hover:scale-110 transition-transform">C</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-serif font-bold text-slate-100 mb-8 tracking-tight">
                Decode Your <span className="text-gold italic">Primal</span> Architecture.
              </h2>
              <p className="text-lg md:text-xl font-sans text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
                CHRONOSOPHY bridges ancient Eastern metaphysics with systemic logic to reveal the hidden resonance between your inner nature and the cycles of time.
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gold hover:bg-gold-light text-midnight px-10 py-4 font-bold uppercase tracking-widest transition-all rounded-sm shadow-xl hover:shadow-gold/20"
                >
                  Explore Your Genesis Code
                </button>
              </div>
            </div>

            {/* THE CONCEPT */}
            <section className="mb-32 py-24 border-y border-white/5 bg-white/2 backdrop-blur-sm px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-xs uppercase tracking-[0.5em] text-gold/60 mb-8">The Philosophy</h3>
                <p className="text-2xl md:text-4xl font-serif text-slate-200 leading-snug">
                  "Your birth is not a random event, but the initiation of a complex system. We translate the ancient 'Bazi' into a modern framework of <span className="text-gold">Cognitive Genetics</span> and <span className="text-gold">Temporal Dynamics</span>."
                </p>
              </div>
            </section>

            {/* THE METHODOLOGY */}
            <section className="mb-32">
              <Methodology />
            </section>

            {/* THE THREE PILLARS */}
            <section className="mb-32 grid md:grid-cols-3 gap-12">
              <div className="p-8 border border-white/5 hover:border-gold/20 transition-colors group">
                <div className="text-gold mb-6 font-serif italic text-3xl">01</div>
                <h4 className="text-xl font-serif font-bold text-slate-100 mb-4 uppercase tracking-widest">Origin (本源)</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your static blueprint—the "Personality Gene Code." Understanding the core variables that define your baseline state.
                </p>
              </div>
              <div className="p-8 border border-white/5 hover:border-gold/20 transition-colors group">
                <div className="text-gold mb-6 font-serif italic text-3xl">02</div>
                <h4 className="text-xl font-serif font-bold text-slate-100 mb-4 uppercase tracking-widest">Flow (流转)</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The dynamic friction and synergy between your system and the environment. Navigating the waves of temporal seasonality.
                </p>
              </div>
              <div className="p-8 border border-white/5 hover:border-gold/20 transition-colors group">
                <div className="text-gold mb-6 font-serif italic text-3xl">03</div>
                <h4 className="text-xl font-serif font-bold text-slate-100 mb-4 uppercase tracking-widest">Alchemy (炼金)</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The practical application of self-knowledge. Mastering your internal state to achieve optimal resonance with external cycles.
                </p>
              </div>
            </section>

            <div id="registration" className="animate-slide-up w-full flex justify-center pt-12">
              <InputForm onCalculate={handleCalculate} />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-16">
            {/* Top Bar: Back & Title */}
            <div className="flex justify-between items-end border-b border-ink/10 pb-6">
              <div>
                <button
                  onClick={() => setChart(null)}
                  className="text-ink/40 hover:text-seal text-xs font-bold uppercase tracking-widest transition-colors mb-2 flex items-center gap-2"
                >
                  <span>←</span> Recalibrate
                </button>
                <h2 className="text-3xl font-title text-ink">System Audit</h2>
              </div>
              <div className="text-right hidden md:block">
                {/* Baseline header removed */}
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <PrismDashboard chart={chart} />

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;