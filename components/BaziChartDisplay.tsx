import React from 'react';
import { BaziChart, Pillar, ElementType, Polarity } from '../types';
import { ELEMENT_COLORS, ELEMENT_BG_COLORS, STEM_SYMBOLS, BRANCH_SYMBOLS } from '../utils/constants';

interface BaziChartDisplayProps {
  chart: BaziChart;
}

// Custom SVG icons matching the elegant flat design style
// All icons are outlined to match the reference style
export const ElementIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-5 h-5" }) => {
  const iconProps = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (type) {
    case 'tree': // 甲/寅 - Christmas Tree / Pine shape
      return (
        <svg {...iconProps}>
          {/* Pine Crown */}
          <path d="M12 3L16 9H14L18 15H15L19 21H5L9 15H6L10 9H8L12 3Z" strokeLinejoin="round" />
          {/* Trunk */}
          <path d="M12 21V23" />
        </svg>
      );
    case 'sprout': // 乙/卯 - Sprout (keep existing)
      return (
        <svg {...iconProps}>
          <path d="M12 22V12" />
          <path d="M12 12C12 12 6 10 6 6C6 3 9 2 12 6" />
          <path d="M12 12C12 12 18 10 18 6C18 3 15 2 12 6" />
        </svg>
      );
    case 'sun': // 丙/巳 - Sun outline
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2V4" />
          <path d="M12 20V22" />
          <path d="M4.93 4.93L6.34 6.34" />
          <path d="M17.66 17.66L19.07 19.07" />
          <path d="M2 12H4" />
          <path d="M20 12H22" />
          <path d="M4.93 19.07L6.34 17.66" />
          <path d="M17.66 6.34L19.07 4.93" />
        </svg>
      );
    case 'lantern': // 丁/午 - Candle/Flame outline
      return (
        <svg {...iconProps}>
          <path d="M6 14 H18 V20 A2 2 0 0 1 16 22 H8 A2 2 0 0 1 6 20 Z" />
          <path d="M12 2C12 2 15 6 15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 6 12 2 12 2Z" />
          <path d="M12 14V12" />
        </svg>
      );
    case 'rock': // 戊/辰/戌 - Mountain/Rock outline
      return (
        <svg {...iconProps}>
          <path d="M3 20H21" />
          <path d="M3 20L8 10L12 16L16 6L21 20" />
        </svg>
      );
    case 'field': // 己/丑/未 - Field (Grid / 田 shape)
      return (
        <svg {...iconProps}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      );
    case 'sword': // 庚/申 - Sword pointing UP
      return (
        <svg {...iconProps}>
          {/* Pommel */}
          <circle cx="12" cy="20" r="1.5" />
          {/* Handle */}
          <path d="M12 18.5V15" />
          {/* Guard */}
          <path d="M8 15H16" />
          {/* Blade */}
          <path d="M9 15L10.5 5L12 2L13.5 5L15 15" strokeLinejoin="miter" />
          {/* Fuller */}
          <path d="M12 15V7" opacity="0.5" />
        </svg>
      );
    case 'gem': // 辛/酉 - Pearl necklace outline
      return (
        <svg {...iconProps}>
          <circle cx="6" cy="8" r="2" />
          <circle cx="4" cy="13" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="12" cy="20" r="2" />
          <circle cx="18" cy="18" r="2" />
          <circle cx="20" cy="13" r="2" />
          <circle cx="18" cy="8" r="2" />
        </svg>
      );
    case 'river': // 壬/亥 - Old Waves (3 wavy lines)
      return (
        <svg {...iconProps}>
          <path d="M2 6C4 6 5 8 7 8C9 8 10 6 12 6C14 6 15 8 17 8C19 8 20 6 22 6" />
          <path d="M2 12C4 12 5 14 7 14C9 14 10 12 12 12C14 12 15 14 17 14C19 14 20 12 22 12" />
          <path d="M2 18C4 18 5 20 7 20C9 20 10 18 12 18C14 18 15 20 17 20C19 20 20 18 22 18" />
        </svg>
      );
    case 'rain': // 癸/子 - 3 Drops (Water Dew)
      return (
        <svg {...iconProps}>
          {/* Top Drop */}
          <path d="M12 2C12 2 10 5 10 7C10 8.1 10.9 9 12 9C13.1 9 14 8.1 14 7C14 5 12 2 12 2Z" />
          {/* Bottom Left Drop */}
          <path d="M7 12C7 12 5 15 5 17C5 18.1 5.9 19 7 19C8.1 19 9 18.1 9 17C9 15 7 12 7 12Z" />
          {/* Bottom Right Drop */}
          <path d="M17 12C17 12 15 15 15 17C15 18.1 15.9 19 17 19C18.1 19 19 18.1 19 17C19 15 17 12 17 12Z" />
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
          <span className="text-[10px] uppercase tracking-wider text-ink/40">{pillar.stem.element}</span>
          <div className="flex flex-col items-center gap-1 mt-1">
            <span className={`${ELEMENT_COLORS[pillar.stem.element]}`}>
              <ElementIcon
                type={STEM_SYMBOLS[pillar.stem.chinese]}
                className="w-7 h-7"
              />
            </span>
          </div>
        </div>

        {/* Branch */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-3">
          <span className={`text-4xl md:text-5xl font-sc font-bold ${ELEMENT_COLORS[pillar.branch.element]}`}>
            {pillar.branch.chinese}
          </span>
          <span className="font-serif italic text-sm text-ink/60">{pillar.branch.name}</span>
          <span className="text-[10px] uppercase font-bold text-ink/30">{pillar.branch.zodiac}</span>
          <div className="flex flex-col items-center gap-1 mt-1">
            <span className={`${ELEMENT_COLORS[pillar.branch.element]}`}>
              <ElementIcon
                type={BRANCH_SYMBOLS[pillar.branch.chinese]}
                className="w-7 h-7"
              />
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
                <ElementIcon
                  type={STEM_SYMBOLS[hs.chinese]}
                  className="w-5 h-5"
                />
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