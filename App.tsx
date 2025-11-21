import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { BaziChartDisplay, DaYunDisplay } from './components/BaziChartDisplay';
import { ElementBalance } from './components/ElementBalance';
import { PremiumServices } from './components/PremiumServices';
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

const Header: React.FC<{ onHome: () => void }> = ({ onHome }) => (
  <header className="fixed top-0 left-0 w-full z-50 bg-paper/90 backdrop-blur-sm border-b border-ink/5 transition-all duration-300">
    <div className="max-w-6xl mx-auto px-6 h-24 flex justify-between items-center">
      <div 
        className="flex items-center gap-4 group cursor-pointer"
        onClick={onHome}
      >
        <div className="w-10 h-10 border-2 border-ink rounded-none flex items-center justify-center relative overflow-hidden transition-colors duration-500 group-hover:border-seal">
          <div className="absolute inset-0 bg-seal opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="font-sc font-bold text-xl z-10 group-hover:text-white transition-colors">知</span>
        </div>
        <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-title tracking-[0.15em] text-ink group-hover:text-seal transition-colors font-bold uppercase">
            Knowing Destiny
            </h1>
            <span className="text-[10px] md:text-xs font-sc text-stone-500 tracking-[0.3em]">探真知命</span>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-10">
         {['Chart', 'Philosophy', 'About'].map((item) => (
           <span key={item} className="text-xs font-serif italic text-ink/60 hover:text-seal cursor-pointer transition-colors border-b border-transparent hover:border-seal pb-1">
             {item}
           </span>
         ))}
      </nav>
    </div>
  </header>
);

const App: React.FC = () => {
  const [chart, setChart] = useState<BaziChart | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = (data: { year: number; month: number; day: number; hour: number; minute: number; gender: Gender }) => {
    setLoading(true);
    setTimeout(() => {
      try {
        const result = calculateBazi(data.year, data.month, data.day, data.hour, data.minute, data.gender);
        setChart(result);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        alert("Could not calculate chart. Please ensure the date is valid and libraries are loaded.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 800);
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
             <div className="mb-16 text-center max-w-2xl">
               <h2 className="text-5xl md:text-7xl font-sc font-bold text-ink mb-6 tracking-tight opacity-90">
                 知命
               </h2>
               <div className="w-px h-16 bg-gradient-to-b from-ink to-transparent mx-auto mb-6"></div>
               <p className="text-lg font-serif italic text-ink/60 max-w-lg mx-auto">
                 "To know your destiny is to flow with the river, not against it."
               </p>
             </div>
             
             {loading ? (
               <div className="flex flex-col items-center animate-fade-in">
                 <div className="relative w-16 h-16 mb-8">
                    <div className="absolute inset-0 border border-ink/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-2 border border-seal/80 rounded-full animate-[spin_3s_ease-in-out_infinite]"></div>
                 </div>
                 <span className="font-sc text-ink tracking-[0.2em] text-sm">Calculations in progress...</span>
               </div>
             ) : (
               <div className="animate-slide-up w-full flex justify-center">
                 <InputForm onCalculate={handleCalculate} />
               </div>
             )}
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
                  <span>←</span> Return
                </button>
                <h2 className="text-3xl font-title text-ink">The Destiny Scroll</h2>
              </div>
              <div className="text-right hidden md:block">
                 <div className="text-xs text-ink/40 uppercase tracking-widest mb-1">Day Master</div>
                 <div className="flex items-center justify-end gap-2">
                    <span className="font-sc text-2xl font-bold text-ink">{chart.dayMaster.chinese}</span>
                    <span className={`font-serif text-lg italic opacity-80`}>
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
          <div className="w-12 h-12 border border-ink text-ink flex items-center justify-center font-sc text-xl mx-auto mb-4 hover:bg-seal hover:text-white hover:border-seal transition-colors cursor-default">知</div>
          <p className="text-ink/40 text-xs uppercase tracking-widest">&copy; {new Date().getFullYear()} Knowing Destiny.</p>
      </footer>
    </div>
  );
};

export default App;