import React from 'react';
import { BaziChart, Pillar, ElementType, Polarity } from '../types';
import { ELEMENT_COLORS, ELEMENT_BG_COLORS, STEM_SYMBOLS, BRANCH_SYMBOLS } from '../utils/constants';

interface BaziChartDisplayProps {
  chart: BaziChart;
}

// Custom SVG icons matching the elegant flat design style
// All icons are outlined to match the reference style
export const ElementIcon: React.FC<{ type: string } & React.SVGProps<SVGSVGElement>> = ({ type, className, ...props }) => {
  const iconProps = {
    className: className || "w-5 h-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props
  };

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

export const GeometricShape: React.FC<{ type: ElementType; className?: string }> = ({ type, className }) => {
  switch (type) {
    case ElementType.WOOD:
      return (
        <svg viewBox="0 0 100 100" className={className || "w-12 h-12 stroke-wood fill-none"}>
          <line x1="50" y1="10" x2="50" y2="90" strokeWidth="4" />
          <line x1="30" y1="30" x2="70" y2="30" strokeWidth="2" opacity="0.5" />
          <line x1="20" y1="50" x2="80" y2="50" strokeWidth="2" opacity="0.3" />
        </svg>
      );
    case ElementType.FIRE:
      return (
        <svg viewBox="0 0 100 100" className={className || "w-12 h-12 stroke-fire fill-none"}>
          <path d="M50 10L90 90H10L50 10Z" strokeWidth="4" />
          <circle cx="50" cy="55" r="15" strokeWidth="2" opacity="0.5" />
        </svg>
      );
    case ElementType.EARTH:
      return (
        <svg viewBox="0 0 100 100" className={className || "w-12 h-12 stroke-earth fill-none"}>
          <rect x="20" y="20" width="60" height="60" strokeWidth="4" />
          <rect x="35" y="35" width="30" height="30" strokeWidth="2" opacity="0.5" />
        </svg>
      );
    case ElementType.METAL:
      return (
        <svg viewBox="0 0 100 100" className={className || "w-12 h-12 stroke-metal fill-none"}>
          <circle cx="50" cy="50" r="40" strokeWidth="4" />
          <circle cx="50" cy="50" r="25" strokeWidth="2" opacity="0.6" />
          <circle cx="50" cy="50" r="10" strokeWidth="1" opacity="0.3" />
        </svg>
      );
    case ElementType.WATER:
      return (
        <svg viewBox="0 0 100 100" className={className || "w-12 h-12 stroke-water fill-none"}>
          <path d="M10 50 Q30 20 50 50 T90 50" strokeWidth="4" />
          <path d="M10 70 Q30 40 50 70 T90 70" strokeWidth="2" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
};

const GeometricPillar: React.FC<{ pillar: Pillar; label: string }> = ({ pillar, label }) => (
  <div className="flex flex-col items-center gap-6">
    <div className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">{label}</div>
    <div className="relative group">
      <div className="flex flex-col gap-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
        {/* Stem Symbol */}
        <div className="relative flex justify-center items-center">
          <span className={`${ELEMENT_COLORS[pillar.stem.element]} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
            <ElementIcon type={STEM_SYMBOLS[pillar.stem.chinese]} className="w-16 h-16 stroke-[1.5]" />
          </span>
          <div className="absolute -top-2 -right-4 text-[10px] font-mono text-gold/40 border border-gold/10 rounded-full w-6 h-6 flex items-center justify-center bg-midnight/80 backdrop-blur-sm">{pillar.stem.chinese}</div>
        </div>

        {/* Branch Symbol */}
        <div className="relative flex justify-center items-center">
          <span className={`${ELEMENT_COLORS[pillar.branch.element]} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
            <ElementIcon type={BRANCH_SYMBOLS[pillar.branch.chinese]} className="w-16 h-16 stroke-[1.5]" />
          </span>
          <div className="absolute -bottom-2 -right-4 text-[10px] font-mono text-gold/40 border border-gold/10 rounded-full w-6 h-6 flex items-center justify-center bg-midnight/80 backdrop-blur-sm">{pillar.branch.chinese}</div>
        </div>
      </div>
      {/* Visual connector */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
    </div>
  </div>
);

export const GenesisCode: React.FC<{ chart: BaziChart }> = ({ chart }) => {
  return (
    <div className="w-full py-10">
      <div className="grid grid-cols-4 gap-4 md:gap-12 max-w-4xl mx-auto">
        <GeometricPillar pillar={chart.yearPillar} label="Year" />
        <GeometricPillar pillar={chart.monthPillar} label="Month" />
        <GeometricPillar pillar={chart.dayPillar} label="Day" />
        <GeometricPillar pillar={chart.hourPillar} label="Hour" />
      </div>
      <div className="mt-16 text-center">
        <div className="inline-block px-6 py-2 border border-white/5 bg-white/2 backdrop-blur-sm rounded-sm">
          <p className="text-[9px] uppercase tracking-[0.5em] text-slate-500">
            System Architecture Hash: <span className="text-gold/60">{chart.dayMaster.name}{chart.yearPillar.branch.name}{chart.monthPillar.branch.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};


const PillarCard: React.FC<{ pillar: Pillar; label: string; delay: number }> = ({ pillar, label, delay }) => {
  return (
    <div
      className="group relative flex flex-col items-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Pillar Title */}
      <div className="mb-4">
        <div className="py-1.5 px-4 border border-gold/30 rounded-full bg-midnight-light text-[10px] font-bold uppercase tracking-[0.3em] text-gold/80 shadow-[0_0_10px_rgba(197,160,89,0.1)]">
          {label}
        </div>
      </div>

      {/* The Scroll Strip (Tech Panel Style) */}
      <div className="relative w-24 md:w-32 bg-white/40 backdrop-blur-md border border-white/50 shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden flex flex-col pb-6 rounded-sm">

        {/* Decorative Top Pattern (Tech Lines) */}
        <div className="h-1 bg-ink/5 w-full mb-2 flex justify-between px-2">
          <div className="w-px h-full bg-ink/20"></div>
          <div className="w-px h-full bg-ink/20"></div>
          <div className="w-px h-full bg-ink/20"></div>
        </div>

        {/* Stem */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 py-4 border-b border-white/10 relative">
          {/* Stem Deity Label */}
          {pillar.stem.deity && (
            <span className="absolute top-1 text-[9px] font-sans font-bold uppercase tracking-wider text-gold/60 bg-midnight/80 px-2 py-0.5 rounded-sm border border-gold/20 backdrop-blur-sm">
              {pillar.stem.deity}
            </span>
          )}

          <span className={`text-4xl md:text-5xl font-sc font-bold ${ELEMENT_COLORS[pillar.stem.element]} drop-shadow-sm`}>
            {pillar.stem.chinese}
          </span>
          <span className="font-sans font-medium text-xs text-slate-400 uppercase tracking-widest">{pillar.stem.name}</span>
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className={`${ELEMENT_COLORS[pillar.stem.element]}`}>
              <ElementIcon
                type={STEM_SYMBOLS[pillar.stem.chinese]}
                className="w-6 h-6 stroke-[1.5]"
              />
            </span>
          </div>
        </div>

        {/* Branch */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 py-4 relative">
          <span className={`text-4xl md:text-5xl font-sc font-bold ${ELEMENT_COLORS[pillar.branch.element]} drop-shadow-sm`}>
            {pillar.branch.chinese}
          </span>

          {/* Branch Main Deity Label */}
          {pillar.branch.deity && (
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-gold/60 bg-midnight/80 px-2 py-0.5 rounded-sm border border-gold/20 backdrop-blur-sm mb-1">
              {pillar.branch.deity}
            </span>
          )}

          <span className="font-sans font-medium text-xs text-slate-400 uppercase tracking-widest">{pillar.branch.name}</span>
          <span className="text-[9px] font-sans font-bold text-slate-600 uppercase tracking-[0.3em]">{pillar.branch.zodiac}</span>
          <div className="flex flex-col items-center gap-1 mt-2">
            <span className={`${ELEMENT_COLORS[pillar.branch.element]}`}>
              <ElementIcon
                type={BRANCH_SYMBOLS[pillar.branch.chinese]}
                className="w-6 h-6 stroke-[1.5]"
              />
            </span>
          </div>
        </div>

        {/* Decorative Bottom */}
        <div className="absolute bottom-0 w-full h-1 bg-white/5 flex justify-center gap-1">
          <div className="w-1 h-full bg-white/10"></div>
          <div className="w-8 h-full bg-gold/60 shadow-[0_0_10px_rgba(197,160,89,0.3)]"></div>
          <div className="w-1 h-full bg-white/10"></div>
        </div>
      </div>

      {/* Hidden Stems */}
      <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center gap-1">
        <div className="h-4 w-px bg-gold/30"></div>
        <div className="glass-midnight border-gold/10 px-5 py-4 rounded-sm shadow-xl flex gap-6">
          {pillar.branch.hiddenStems.map((hs, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {hs.deity && <span className="text-[8px] text-gold/60 font-bold uppercase tracking-wider mb-1">{hs.deity}</span>}
              <span className={`text-2xl font-sc font-bold ${ELEMENT_COLORS[hs.element]} drop-shadow-sm`}>{hs.chinese}</span>
              <span className={`${ELEMENT_COLORS[hs.element]}`}>
                <ElementIcon
                  type={STEM_SYMBOLS[hs.chinese]}
                  className="w-5 h-5 opacity-80"
                />
              </span>
              <span className="text-[9px] text-slate-500 font-sans uppercase tracking-widest mt-1">{hs.name}</span>
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
      {/* Date Header */}
      {chart.date && (
        <div className="flex justify-center mb-16">
          <div className="inline-flex items-center gap-4 px-8 py-3 border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Chart Calibration</span>
            <span className="w-px h-4 bg-white/10"></span>
            <span className="font-serif text-gold/80 italic text-lg">
              {chart.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              <span className="mx-3 text-white/10">|</span>
              {chart.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      )}

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
    <div className="relative pt-16 mt-12 border-t border-white/5 w-full">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-midnight px-8 py-1.5 border border-gold/20 rounded-full shadow-gold/10 flex items-center gap-3">
        <span className="font-serif text-sm text-gold font-bold tracking-[0.2em] uppercase">Great Cycles</span>
      </div>

      {/* Full width scrolling container with more padding for breathability */}
      <div className="flex overflow-x-auto py-8 gap-8 px-8 md:justify-between no-scrollbar mask-fade w-full">
        {chart.daYun.map((yun, idx) => (
          <div key={idx} className="min-w-[100px] flex-1 group flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-2">

            {/* Age Label */}
            <div className="mb-4 text-center">
              <div className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-[0.2em]">Age {yun.startAge}</div>
              <div className="text-[10px] font-serif text-gold/40 mt-1 italic">{yun.year}</div>
            </div>

            {/* Coin Style Cycle */}
            <div className="w-24 h-24 rounded-full bg-white/2 border border-white/10 group-hover:border-gold transition-all duration-500 flex items-center justify-center shadow-lg relative hover:bg-gold/5 group-hover:shadow-gold/10">
              <div className="absolute inset-1.5 rounded-full border border-dashed border-white/5 group-hover:border-gold/30 transition-all"></div>

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