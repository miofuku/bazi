import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { BaziChartDisplay, DaYunDisplay, ElementIcon } from './components/BaziChartDisplay';
import { ElementBalance } from './components/ElementBalance';
import { PremiumServices } from './components/PremiumServices';
import { SoulSymbolReveal } from './components/SoulSymbolReveal';
import { calculateBazi } from './services/baziService';
import { BaziChart, Gender, Polarity } from './types';
import { ELEMENT_COLORS, STEM_SYMBOLS } from './utils/constants';

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
          <span className="font-title font-bold text-xl z-10 text-ink group-hover:text-white transition-colors duration-500">E</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-title tracking-[0.1em] text-ink transition-colors font-bold uppercase">
            Elementa
          </h1>
          <span className="text-[10px] font-sans text-stone-500 tracking-[0.2em] uppercase">Ancient Wisdom. Future Clarity.</span>
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

const QUOTES = [
  "Water does not resist. Water flows. — Lao Tzu",
  "The green reed which bends in the wind is stronger than the mighty oak which breaks. — Confucius",
  "Nature does not hurry, yet everything is accomplished. — Lao Tzu",
  "Knowing others is intelligence; knowing yourself is true wisdom. — Lao Tzu",
  "The journey of a thousand miles begins with a single step. — Lao Tzu",
  "He who knows he has enough is rich. — Lao Tzu",
  "When I let go of what I am, I become what I might be. — Lao Tzu",
  "Life is a series of natural and spontaneous changes. Don't resist them. — Lao Tzu"
];

const App: React.FC = () => {
  const [chart, setChart] = useState<BaziChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);

  const handleCalculate = (data: { year: number; month: number; day: number; hour: number; minute: number; gender: Gender }) => {
    setLoading(true);
    // Pick random quote
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    setTimeout(() => {
      try {
        const result = calculateBazi(data.year, data.month, data.day, data.hour, data.minute, data.gender);
        // Add date to result
        result.date = new Date(data.year, data.month - 1, data.day, data.hour, data.minute);
        setChart(result);
        setShowReveal(true); // Trigger Reveal
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        alert("Could not calculate chart. Please ensure the date is valid and libraries are loaded.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 3000); // Longer duration to read the quote (3s)
  };

  const resetApp = () => {
    setChart(null);
    setShowReveal(false);
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
                <span className="font-title text-4xl">E</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-title font-bold text-ink mb-4 tracking-tight">
                Elementa
              </h2>
              <div className="w-px h-12 bg-gradient-to-b from-ink to-transparent mx-auto mb-6"></div>
              <p className="text-lg md:text-xl font-sans text-ink/60 uppercase tracking-[0.2em] mb-8">
                Ancient Wisdom, Decoded for Modern Life.
              </p>

              <div className="bg-white/40 backdrop-blur-md border border-white/60 p-10 md:p-14 rounded-sm shadow-xl max-w-4xl mx-auto my-16 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-wood via-earth to-water opacity-50"></div>

                <h3 className="font-title text-2xl md:text-3xl text-ink mb-8 tracking-wide font-bold uppercase text-center relative z-10">
                  The Ecosystem of You
                </h3>

                <blockquote className="font-serif text-xl md:text-2xl text-ink/80 leading-relaxed text-center mb-8 relative z-10">
                  "Think of your life as a <span className="text-wood font-bold">garden</span>.
                  Bazi analyzes the <span className="text-earth font-bold">soil</span> <span className="text-base text-ink/50 italic">(your base nature)</span>,
                  the <span className="text-water font-bold">weather</span> <span className="text-base text-ink/50 italic">(the timing/luck cycles)</span>,
                  and the <span className="text-wood font-bold">seeds</span> <span className="text-base text-ink/50 italic">(your talents)</span>."
                </blockquote>

                <p className="font-sans text-xs md:text-sm text-center tracking-[0.2em] text-ink/60 uppercase font-bold relative z-10">
                  You cannot change the weather, but you can choose when to plant.
                </p>

                {/* Decor elements */}
                <div className="absolute -bottom-10 -right-10 text-wood/5 rotate-[-15deg]">
                  <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22H22L12 2Z" /></svg>
                </div>
              </div>

              <div className="max-w-4xl mx-auto mb-12 text-center space-y-4">
                <p className="text-xl md:text-2xl font-serif text-seal/100 italic">
                  "Your birth time isn't just a number. It's an energy coordinate."
                </p>
                <p className="text-base md:text-lg text-ink/80 font-sans max-w-2xl mx-auto">
                  We translate the 2,000-year-old Bazi system into actionable strategies for your career and relationships.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center w-full h-32">
                <div className="relative flex items-center justify-center">
                  {/* Ink Spreading Effect */}
                  <div className="w-4 h-4 bg-ink rounded-full animate-ink-spread opacity-80 blur-sm absolute"></div>
                  <div className="w-4 h-4 bg-ink/50 rounded-full animate-ping absolute"></div>
                </div>
                <div className="mt-12 text-center max-w-md px-4 animate-fade-in">
                  <p className="font-serif italic text-ink/70 text-lg mb-2">"{quote.split('—')[0].trim()}"</p>
                  <p className="font-sc text-xs text-ink/40 tracking-widest uppercase">— {quote.split('—')[1]?.trim()}</p>
                </div>
              </div>
            ) : (
              <div className="animate-slide-up w-full flex justify-center">
                <InputForm onCalculate={handleCalculate} />
              </div>
            )}
          </div>
        ) : showReveal ? (
          <SoulSymbolReveal chart={chart} onComplete={() => setShowReveal(false)} />
        ) : (
          <div className="animate-fade-in space-y-16">
            {/* Top Bar: Back & Title */}
            <div className="flex justify-between items-end border-b border-ink/10 pb-6">
              <div>
                <button
                  onClick={() => setChart(null)}
                  className="text-ink/40 hover:text-seal text-xs font-bold uppercase tracking-widest transition-colors mb-2 flex items-center gap-2"
                >
                  <span>←</span> Return
                </button>
                <h2 className="text-3xl font-title text-ink">My Blueprint</h2>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-xs text-ink/40 uppercase tracking-widest mb-1">Day Master</div>
                <div className="flex items-center justify-end gap-3">
                  <span className={`font-sc text-2xl font-bold ${ELEMENT_COLORS[chart.dayMaster.element]}`}>
                    {chart.dayMaster.chinese}
                  </span>
                  <span className={`${ELEMENT_COLORS[chart.dayMaster.element]}`}>
                    <ElementIcon
                      type={STEM_SYMBOLS[chart.dayMaster.chinese]}
                      className="w-8 h-8"
                    />
                  </span>
                  <span className={`font-serif text-lg italic ${ELEMENT_COLORS[chart.dayMaster.element]}`}>
                    {chart.dayMaster.polarity} {chart.dayMaster.element}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

              {/* Left: Pillars (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                <BaziChartDisplay chart={chart} />
              </div>

              {/* Right: Stats (4 cols) */}
              <div className="lg:col-span-4 space-y-8">
                <ElementBalance counts={chart.elementCounts} />
              </div>
            </div>

            <PremiumServices />

            {/* Da Yun Section - Full Width Bottom */}
            <div className="w-full">
              <DaYunDisplay chart={chart} />
            </div>

          </div>
        )}
      </main>

      <footer className="border-t border-ink/5 py-12 text-center relative z-10 bg-paper">
        <div className="w-12 h-12 border border-ink/20 text-ink flex items-center justify-center mx-auto mb-4 hover:bg-ink hover:text-white transition-all duration-500 cursor-default group">
          <span className="font-title text-xl">E</span>
        </div>
        <p className="text-ink/40 text-xs font-sans uppercase tracking-widest">&copy; {new Date().getFullYear()} Elementa.</p>
      </footer>

      {chart && showReveal && (
        <SoulSymbolReveal chart={chart} onComplete={() => setShowReveal(false)} />
      )}
    </div>
  );
};

export default App;