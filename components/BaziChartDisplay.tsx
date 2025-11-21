import React from 'react';
import { BaziChart, Pillar, ElementType } from '../types';
import { ELEMENT_COLORS, ELEMENT_BG_COLORS } from '../utils/constants';

interface BaziChartDisplayProps {
  chart: BaziChart;
}

// Improved Element Icons (Filled, Stamp Style)
const getElementIcon = (element: ElementType, className: string = "w-5 h-5") => {
  switch (element) {
    case ElementType.WOOD: // Tree / Bamboo
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L12 22 M12 22L7 17 M12 22L17 17 M12 6L8 10 M12 10L16 14 M12 14L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      );
    case ElementType.FIRE: // Flame
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2c0 0-6 5-6 11a6 6 0 1 0 12 0c0-6-6-11-6-11zm0 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
        </svg>
      );
    case ElementType.EARTH: // Mountain
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 20h18L12 4 3 20zm9-11l4.5 8h-9L12 9z"/>
        </svg>
      );
    case ElementType.METAL: // Coin / Shield
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
           <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
           <rect x="9" y="9" width="6" height="6" fill="currentColor"/>
        </svg>
      );
    case ElementType.WATER: // Waves
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 12c0 3 2.5 5 5 5s5-2 5-5-2.5-5-5-5-5 2-5 5zm10 0c0 3 2.5 5 5 5s5-2 5-5-2.5-5-5-5-5 2-5 5z"/>
        </svg>
      );
    default: return null;
  }
};

const PillarCard: React.FC<{ pillar: Pillar; label: string; delay: number }> = ({ pillar, label, delay }) => {
  return (
    <div 
      className="group relative flex flex-col items-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Pillar Title */}
      <div className="mb-4">
        <div className="py-1 px-3 border border-ink/20 rounded-full bg-paper text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
          {label}
        </div>
      </div>

      {/* The Scroll Strip */}
      <div className="relative w-24 md:w-32 bg-white border-x-2 border-stone-200 shadow-lg transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-xl overflow-hidden flex flex-col pb-6">
        
        {/* Decorative Top Pattern */}
        <div className="h-2 bg-ink/5 w-full mb-2 border-b border-ink/5"></div>

        {/* Stem */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-3 border-b border-dashed border-stone-300">
            <span className={`text-4xl md:text-5xl font-sc font-bold ${ELEMENT_COLORS[pillar.stem.element]}`}>
                {pillar.stem.chinese}
            </span>
            <span className="font-serif italic text-sm text-ink/60">{pillar.stem.name}</span>
            <div className="flex flex-col items-center gap-1 mt-1">
                <span className={`${ELEMENT_COLORS[pillar.stem.element]}`}>{getElementIcon(pillar.stem.element, "w-4 h-4")}</span>
            </div>
        </div>

        {/* Branch */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-3">
            <span className={`text-4xl md:text-5xl font-sc font-bold ${ELEMENT_COLORS[pillar.branch.element]}`}>
                {pillar.branch.chinese}
            </span>
            <div className="flex flex-col items-center leading-none">
                 <span className="font-serif italic text-sm text-ink/60">{pillar.branch.name}</span>
                 <span className="text-[10px] uppercase font-bold text-ink/30 mt-1">{pillar.branch.zodiac}</span>
            </div>
            <div className="flex flex-col items-center gap-1 mt-1">
                <span className={`${ELEMENT_COLORS[pillar.branch.element]}`}>{getElementIcon(pillar.branch.element, "w-4 h-4")}</span>
            </div>
        </div>
        
        {/* Decorative Bottom */}
        <div className="absolute bottom-0 w-full h-1 bg-seal/80"></div>
      </div>
      
      {/* Hidden Stems (Reveal below) */}
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center gap-1">
         <div className="h-4 w-px bg-ink/20"></div>
         <div className="bg-white border border-stone-200 px-3 py-2 rounded shadow-sm flex gap-3">
            {pillar.branch.hiddenStems.map((hs, i) => (
                <div key={i} className="flex flex-col items-center">
                    <span className={`text-sm font-sc ${ELEMENT_COLORS[hs.element]}`}>{hs.chinese}</span>
                    <span className="text-[8px] text-ink/40 font-serif">{hs.name}</span>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export const BaziChartDisplay: React.FC<BaziChartDisplayProps> = ({ chart }) => {
  return (
    <div className="w-full animate-fade-in">
       {/* Pillars Grid */}
       <div className="flex flex-wrap justify-center md:justify-between gap-6 px-2 md:px-8">
         <PillarCard pillar={chart.yearPillar} label="Year" delay={0} />
         <PillarCard pillar={chart.monthPillar} label="Month" delay={150} />
         <PillarCard pillar={chart.dayPillar} label="Day" delay={300} />
         <PillarCard pillar={chart.hourPillar} label="Hour" delay={450} />
       </div>
    </div>
  );
};

export const DaYunDisplay: React.FC<{ chart: BaziChart }> = ({ chart }) => {
  return (
    <div className="relative pt-12 mt-4 border-t-2 border-ink/5 w-full">
         <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-paper px-6 py-1 border border-ink/10 rounded-full shadow-sm flex items-center gap-2">
            <span className="font-title text-sm text-ink font-bold tracking-widest uppercase">Great Cycles</span>
            <span className="font-sc text-sm text-ink/40">大运</span>
         </div>
         
         {/* Full width scrolling container with more padding for breathability */}
         <div className="flex overflow-x-auto py-8 gap-8 px-8 md:justify-between no-scrollbar mask-fade w-full">
           {chart.daYun.map((yun, idx) => (
             <div key={idx} className="min-w-[100px] flex-1 group flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-2">
               
               {/* Age Label */}
               <div className="mb-3 text-center">
                   <div className="text-xs font-title font-bold text-ink/60 uppercase tracking-wider">Age {yun.startAge}</div>
                   <div className="text-[10px] font-serif text-ink/30 mt-1">{yun.year}</div>
               </div>
               
               {/* Coin Style Cycle */}
               <div className="w-20 h-20 rounded-full bg-paper border-2 border-stone-200 group-hover:border-seal transition-colors flex items-center justify-center shadow-md relative hover:shadow-lg hover:bg-white">
                   <div className="absolute inset-1 rounded-full border border-dashed border-stone-300 group-hover:border-seal/30 transition-colors"></div>
                   
                   <div className="flex flex-col items-center leading-none z-10 gap-1">
                       <div className="flex items-center gap-1">
                           <span className={`text-xl font-sc font-bold ${ELEMENT_COLORS[yun.pillar.stem.element]}`}>{yun.pillar.stem.chinese}</span>
                           <span className={`text-xl font-sc font-bold ${ELEMENT_COLORS[yun.pillar.branch.element]}`}>{yun.pillar.branch.chinese}</span>
                       </div>
                       <div className="flex items-center gap-1 opacity-60">
                           <span className="text-[8px] font-serif uppercase tracking-tighter">{yun.pillar.stem.name}</span>
                           <span className="text-[8px] font-serif uppercase tracking-tighter">{yun.pillar.branch.name}</span>
                       </div>
                   </div>
               </div>
               
               {/* Element Indicator Dots */}
               <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`w-1.5 h-1.5 rounded-full ${ELEMENT_BG_COLORS[yun.pillar.stem.element]}`}></div>
                    <div className={`w-1.5 h-1.5 rounded-full ${ELEMENT_BG_COLORS[yun.pillar.branch.element]}`}></div>
               </div>
             </div>
           ))}
         </div>
    </div>
  );
};