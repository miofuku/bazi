import React, { useState } from 'react';
import { ElementCounts, ElementType, ElementScore } from '../types';
import { ELEMENT_COLORS, ELEMENT_BG_COLORS, FIVE_ELEMENTS_INFO } from '../utils/constants';

interface ElementBalanceProps {
  counts: ElementCounts;
  scores?: ElementScore;
  dayMaster: { element: ElementType; chinese: string };
}

export const ElementBalance: React.FC<ElementBalanceProps> = ({ counts, scores, dayMaster }) => {
  // Determine dominance based on scores if available, else counts
  const data = scores || counts;
  const total: number = (Object.values(data) as number[]).reduce((a: number, b: number) => a + b, 0) || 1;
  const sorted = (Object.entries(data) as [string, number][]).sort(([, a], [, b]) => b - a);
  const dominant = (sorted[0]?.[0] as ElementType) || ElementType.WOOD;

  // Ordered elements for the Pentagon
  const ORDERED_ELEMENTS: ElementType[] = [
    ElementType.WOOD,
    ElementType.FIRE,
    ElementType.EARTH,
    ElementType.METAL,
    ElementType.WATER
  ];

  const [hovered, setHovered] = useState<ElementType | null>(null);

  // Calculate Radar Points
  const maxVal = Math.max(...(Object.values(data) as number[])) * 1.1 || 1;
  const points = ORDERED_ELEMENTS.map((el, i) => {
    // Scale relative to maxVal for visual balance, typically filling ~80% of radius
    const val = data[el] || 0;
    const relative = val / maxVal * 0.8;
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const r = relative * 40; // max radius 40
    return `${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`;
  }).join(' ');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-serif text-slate-100 mb-3 tracking-tight">The Core Equilibrium</h2>
        <p className="text-gold/60 text-[10px] uppercase font-sans tracking-[0.4em]">核心能量平衡</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* 1. Radar Chart */}
        <div className="relative aspect-square max-w-sm mx-auto w-full group">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
            {/* Background Grids */}
            {[20, 40].map(r => (
              <circle key={r} cx="50" cy="50" r={r} stroke="rgba(255,255,255,0.05)" fill="none" />
            ))}
            {/* Axes */}
            {ORDERED_ELEMENTS.map((el, i) => {
              const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
              const x = 50 + Math.cos(angle) * 40;
              const y = 50 + Math.sin(angle) * 40;
              return (
                <g key={el}>
                  <line x1="50" y1="50" x2={x} y2={y} stroke="rgba(255,255,255,0.1)" />
                  {/* Labels */}
                  <text x={50 + Math.cos(angle) * 50} y={50 + Math.sin(angle) * 50}
                    textAnchor="middle" dominantBaseline="middle"
                    className="text-[3px] fill-slate-400 font-bold uppercase tracking-widest cursor-pointer hover:fill-gold transition-colors"
                    onMouseEnter={() => setHovered(el)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {hovered === el ? FIVE_ELEMENTS_INFO[el].keywords.split(' ')[0] : FIVE_ELEMENTS_INFO[el].english}
                  </text>
                </g>
              );
            })}

            {/* Data Polygon */}
            <polygon points={points} fill="rgba(197, 160, 89, 0.2)" stroke="#C5A059" strokeWidth="0.5" className="filter drop-shadow-[0_0_8px_rgba(197,160,89,0.3)] transition-all duration-1000 ease-out" />

            {/* Vertices */}
            {ORDERED_ELEMENTS.map((el, i) => {
              const val = data[el] || 0;
              const relative = val / maxVal * 0.8;
              const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
              const r = relative * 40;
              const cx = 50 + Math.cos(angle) * r;
              const cy = 50 + Math.sin(angle) * r;
              return (
                <circle key={el} cx={cx} cy={cy} r="1.5" className="fill-gold cursor-pointer hover:r-3 transition-all"
                  onMouseEnter={() => setHovered(el)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
          </svg>
        </div>

        {/* 2. Context Panel */}
        <div>
          <div className="glass-midnight border-gold/10 p-8 rounded-sm min-h-[300px] flex flex-col justify-center transition-all duration-300">
            {hovered ? (
              <div className="animate-fade-in">
                <span className={`text-xs font-bold uppercase tracking-widest mb-2 block ${ELEMENT_COLORS[hovered]}`}>
                  {FIVE_ELEMENTS_INFO[hovered].english} Node Active
                </span>
                <h3 className="text-2xl font-serif text-slate-100 mb-4">{FIVE_ELEMENTS_INFO[hovered].keywords}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {hovered === dayMaster.element
                    ? "This is your Core Identifier. It dictates your fundamental operating logic and resource needs."
                    : "An auxiliary system providing resource inputs (Resource) or output channels (Output) relative to your core."}
                </p>
              </div>
            ) : (
              <div className="text-center opacity-60">
                <div className="text-gold text-4xl mb-4 font-serif italic">
                  {Math.round(((data[dominant] || 0) / total) * 100)}%
                </div>
                <h4 className="text-slate-200 font-bold uppercase tracking-widest text-xs mb-2">Dominant Frequency: {FIVE_ELEMENTS_INFO[dominant].english}</h4>
                <p className="text-[10px] text-slate-500">Hover over the radar nodes to decode specific elemental intelligences.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
