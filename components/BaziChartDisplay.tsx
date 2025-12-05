import React from 'react';
import { BaziChart, Pillar, ElementType } from '../types';
import { ELEMENT_COLORS, ELEMENT_BG_COLORS, STEM_SYMBOLS, BRANCH_SYMBOLS } from '../utils/constants';

interface BaziChartDisplayProps {
  chart: BaziChart;
}

// Custom SVG icons matching the elegant flat design style
const ElementIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-5 h-5" }) => {
  const iconProps = { className, viewBox: "0 0 24 24", fill: "currentColor" };

  switch (type) {
    case 'tree': // 甲/寅 - Big Tree with trunk and crown
      return (
        <svg {...iconProps}>
          {/* Tree crown - layered circles */}
          <ellipse cx="12" cy="7" rx="7" ry="5" />
          <ellipse cx="8" cy="9" rx="4" ry="3" />
          <ellipse cx="16" cy="9" rx="4" ry="3" />
          {/* Trunk */}
          <path d="M10 12V20H14V12" />
          {/* Roots */}
          <path d="M8 20L10 18M14 18L16 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'sprout': // 乙/卯 - Y-shaped sprout with leaves
      return (
        <svg {...iconProps}>
          {/* Stem */}
          <path d="M12 22V12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left leaf */}
          <path d="M12 12C12 12 6 10 6 6C6 3 9 2 12 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right leaf */}
          <path d="M12 12C12 12 18 10 18 6C18 3 15 2 12 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'sun': // 丙/巳 - Sun
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'lantern': // 丁/午 - Candle/Lantern flame
      return (
        <svg {...iconProps}>
          <path d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14 12 14C14.5 14 16 12.5 16 10C16 6 12 2 12 2Z" />
          <rect x="10" y="14" width="4" height="2" rx="0.5" />
          <rect x="9" y="16" width="6" height="6" rx="1" />
        </svg>
      );
    case 'rock': // 戊/辰/戌 - Rock/Stone
      return (
        <svg {...iconProps}>
          <path d="M4 18L8 8L12 12L16 6L20 18H4Z" />
          <path d="M7 18L10 14L13 16L17 12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </svg>
      );
    case 'field': // 己/丑/未 - Farmland/Field
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'sword': // 庚/申 - Crossed swords (⚔️ style)
      return (
        <svg {...iconProps}>
          {/* Left sword */}
          <path d="M4 4L18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M2 6L6 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Right sword */}
          <path d="M20 4L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 2L22 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'gem': // 辛/酉 - Pearl necklace
      return (
        <svg {...iconProps}>
          {/* String of pearls in a U shape */}
          <circle cx="6" cy="8" r="2.5" />
          <circle cx="4" cy="13" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="12" cy="20" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <circle cx="20" cy="13" r="2.5" />
          <circle cx="18" cy="8" r="2.5" />
        </svg>
      );
    case 'river': // 壬/亥 - River/Waves
      return (
        <svg {...iconProps}>
          <path d="M2 6C4 6 5 8 7 8C9 8 10 6 12 6C14 6 15 8 17 8C19 8 20 6 22 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M2 12C4 12 5 14 7 14C9 14 10 12 12 12C14 12 15 14 17 14C19 14 20 12 22 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M2 18C4 18 5 20 7 20C9 20 10 18 12 18C14 18 15 20 17 20C19 20 20 18 22 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'rain': // 癸/子 - Rain/Dew drops
      return (
        <svg {...iconProps}>
          <path d="M7 4C7 4 4 8 4 10C4 11.66 5.34 13 7 13C8.66 13 10 11.66 10 10C10 8 7 4 7 4Z" />
          <path d="M17 4C17 4 14 8 14 10C14 11.66 15.34 13 17 13C18.66 13 20 11.66 20 10C20 8 17 4 17 4Z" />
          <path d="M12 12C12 12 9 16 9 18C9 19.66 10.34 21 12 21C13.66 21 15 19.66 15 18C15 16 12 12 12 12Z" />
        </svg>
      );
    default:
      return null;
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
            <span className={`${ELEMENT_COLORS[pillar.stem.element]}`}>
              <ElementIcon type={STEM_SYMBOLS[pillar.stem.chinese]} className="w-5 h-5" />
            </span>
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
            <span className={`${ELEMENT_COLORS[pillar.branch.element]}`}>
              <ElementIcon type={BRANCH_SYMBOLS[pillar.branch.chinese]} className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Decorative Bottom */}
        <div className="absolute bottom-0 w-full h-1 bg-seal/80"></div>
      </div>

      {/* Hidden Stems 藏干 (Reveal below) */}
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center gap-1">
        <div className="h-4 w-px bg-ink/20"></div>
        <div className="bg-white border border-stone-200 px-4 py-3 rounded shadow-sm flex gap-4">
          {pillar.branch.hiddenStems.map((hs, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className={`text-xl font-sc font-bold ${ELEMENT_COLORS[hs.element]}`}>{hs.chinese}</span>
              <span className={`${ELEMENT_COLORS[hs.element]}`}>
                <ElementIcon type={STEM_SYMBOLS[hs.chinese]} className="w-4 h-4" />
              </span>
              <span className="text-[9px] text-ink/40 font-serif">{hs.name}</span>
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