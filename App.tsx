import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { BaziChartDisplay } from './components/BaziChartDisplay';
import { ResultDashboard } from './components/ResultDashboard';
import { calculateBazi } from './services/baziService';
import { BaziChart, Gender } from './types';

// Decorative Ink Mountains SVG
const InkMountains = () => (
  <div className="fixed bottom-0 left-0 w-full h-[40vh] z-0 pointer-events-none opacity-10">
    <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="w-full h-full fill-ink">
      <path d="M0,300 L0,200 C150,220 250,150 400,180 C550,210 600,100 800,150 C950,190 1100,220 1200,250 L1200,300 Z" />
      <path d="M0,300 L0,250 C100,260 300,280 500,240 C700,200 900,250 1200,200 L1200,300 Z" opacity="0.5" />
    </svg>
  </div>
);

// Minimalist Header
const Header: React.FC<{ onHome: () => void }> = ({ onHome }) => (
  <header className="fixed top-0 left-0 w-full z-50 bg-paper/80 backdrop-blur-md border-b border-ink/5 transition-all duration-300">
    <div className="max-w-6xl mx-auto px-6 h-24 flex justify-between items-center">
      <div
        className="flex items-center gap-4 group cursor-pointer"
        onClick={onHome}
      >
        <div className="w-10 h-10 border border-ink/30 flex items-center justify-center relative overflow-hidden transition-all duration-500 bg-white/50 group-hover:bg-ink group-hover:border-ink">
          <span className="font-title font-bold text-xl z-10 text-ink group-hover:text-white transition-colors duration-500">C</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-title tracking-[0.1em] text-ink transition-colors font-bold uppercase">
            CHRONOSOPHY <span className="text-sm normal-case font-sc">(时智)</span>
          </h1>
          <span className="text-[10px] font-sans text-stone-500 tracking-[0.2em] uppercase">The Wisdom of Temporal Synergy.</span>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-10">
        {['System', 'Philosophy', 'About'].map((item) => (
          <span key={item} className="text-xs font-sans font-medium uppercase tracking-widest text-ink/40 hover:text-seal cursor-pointer transition-colors">
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
    <div className="relative min-h-screen text-ink font-sans">
      <Header onHome={resetApp} />
      <InkMountains />

      <main className="pt-32 pb-24 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
        {!chart ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="mb-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-ink text-white flex items-center justify-center rounded-sm shadow-2xl">
                <span className="font-title text-4xl">C</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-title font-bold text-ink mb-4 tracking-tight">
                CHRONOSOPHY <span className="text-3xl md:text-4xl font-sc block mt-2">(时智)</span>
              </h2>
              <div className="w-px h-12 bg-gradient-to-b from-ink to-transparent mx-auto mb-6"></div>
              <p className="text-lg md:text-xl font-sans text-ink/60 uppercase tracking-[0.2em] mb-8">
                The Wisdom of Temporal Synergy. <br /><span className="text-sm normal-case font-sc opacity-60">(关于时空协同的智慧。)</span>
              </p>

              <div className="bg-white/40 backdrop-blur-md border border-white/60 p-10 md:p-14 rounded-sm shadow-xl max-w-4xl mx-auto my-16 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-wood via-earth to-water opacity-50"></div>

                <h3 className="font-title text-2xl md:text-3xl text-ink mb-8 tracking-wide font-bold uppercase text-center relative z-10">
                  Eastern Personality Gene Code
                </h3>

                <blockquote className="font-serif text-xl md:text-2xl text-ink/80 leading-relaxed text-center mb-8 relative z-10">
                  "Your birth time represents the <span className="text-metal font-bold">Initial Conditions</span>
                  of your systemic evolution. We decode this <span className="text-wood font-bold">Base Architecture</span>
                  to pre-calculate <span className="text-water font-bold">Temporal Synergy</span>
                  and mitigate <span className="text-fire font-bold">Macro-Cycle Friction</span>."
                </blockquote>

                <p className="font-sans text-xs md:text-sm text-center tracking-[0.2em] text-ink/60 uppercase font-bold relative z-10">
                  Data-driven risk management and energy allocation for the modern builder.
                </p>

                {/* Decor elements */}
                <div className="absolute -bottom-10 -right-10 text-wood/5 rotate-[-15deg]">
                  <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22H22L12 2Z" /></svg>
                </div>
              </div>

              <div className="max-w-4xl mx-auto mb-12 text-center space-y-4">
                <p className="text-xl md:text-2xl font-serif text-seal/100 italic">
                  "Evolution is just a system of variables. Knowledge is the ultimate optimization."
                </p>
                <p className="text-base md:text-lg text-ink/80 font-sans max-w-2xl mx-auto">
                  We translate the 2,000-year-old Recursive Systemic model into high-fidelity cognitive insights and systemic risk management.
                </p>
              </div>
            </div>

            <div className="animate-slide-up w-full flex justify-center">
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
            <ResultDashboard chart={chart} />

          </div>
        )}
      </main>

      <footer className="border-t border-ink/5 py-12 text-center relative z-10 bg-paper">
        <div className="w-12 h-12 border border-ink/20 text-ink flex items-center justify-center mx-auto mb-4 hover:bg-ink hover:text-white transition-all duration-500 cursor-default group">
          <span className="font-title text-xl">C</span>
        </div>
        <p className="text-ink/40 text-xs font-sans uppercase tracking-widest">&copy; {new Date().getFullYear()} CHRONOSOPHY.</p>
      </footer>


    </div>
  );
};

export default App;