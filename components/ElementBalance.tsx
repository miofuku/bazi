import React from 'react';
import { ElementType, Stem } from '../types';
import { ELEMENT_BG_COLORS, ELEMENT_COLORS, FIVE_ELEMENTS_INFO } from '../utils/constants';

// Element that produces the key element (Resource)
const RESOURCE_MAP: Record<ElementType, ElementType> = {
  [ElementType.WOOD]: ElementType.WATER,
  [ElementType.FIRE]: ElementType.WOOD,
  [ElementType.EARTH]: ElementType.FIRE,
  [ElementType.METAL]: ElementType.EARTH,
  [ElementType.WATER]: ElementType.METAL,
};

interface ElementBalanceProps {
  counts: Record<ElementType, number>;
  scores?: Record<ElementType, number>;
  dayMaster?: Stem;
}

export const ElementBalance: React.FC<ElementBalanceProps> = ({ counts, scores, dayMaster }) => {
  // Use scores if available, otherwise fallback to counts (for backward compatibility)
  const data = scores || counts;
  const total = (Object.values(data) as number[]).reduce((sum: number, val: number) => sum + val, 0) || 1;

  // Strength Calculation if Day Master is provided
  let strengthInfo = null;
  if (dayMaster) {
    const selfElement = dayMaster.element;
    const resourceElement = RESOURCE_MAP[selfElement];
    const selfScore = data[selfElement] || 0;
    const resourceScore = data[resourceElement] || 0;
    const strengthScore = selfScore + resourceScore;
    const isStrong = strengthScore >= (total / 2);

    strengthInfo = {
      isStrong,
      score: strengthScore,
      total,
      advice: isStrong
        ? "Output, Challenge, Management"
        : "Learning, Cooperation, Rest"
    };
  }

  // Find Dominant and Missing
  const entries = Object.entries(data) as [ElementType, number][];
  const dominant = entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const missing = entries.filter(e => e[1] === 0).map(e => e[0]);

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-center font-serif italic text-gold/60 text-lg mb-10">Infrastructure Layer Assessment</h3>

      <div className="space-y-6">
        {(Object.values(ElementType) as ElementType[]).map((type) => {
          const value = data[type] || 0;
          const percentage = Math.round((value / total) * 100);
          const isDominant = type === dominant;
          const isMissing = value === 0;

          return (
            <div key={type} className="group relative">
              <div className="flex justify-between items-end mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className={`font-bold transition-all duration-500 ${isDominant ? 'text-gold' : ''}`}>
                    {FIVE_ELEMENTS_INFO[type].english}
                  </span>
                  {isDominant && (
                    <span className="bg-gold/10 text-[9px] px-2 py-0.5 rounded-sm text-gold font-bold">DOMINANT</span>
                  )}
                  {isMissing && (
                    <span className="bg-white/5 text-[9px] px-2 py-0.5 rounded-sm text-slate-600 font-bold">VOID</span>
                  )}
                </div>
                <span className="font-mono text-[10px] opacity-40">{percentage}%</span>
              </div>

              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full ${ELEMENT_BG_COLORS[type]} transition-all duration-1000 ease-out rounded-full ${isDominant ? 'opacity-100 shadow-[0_0_10px_rgba(197,160,89,0.3)]' : 'opacity-40 grayscale-[0.2]'}`}
                  style={{ width: `${percentage === 0 ? 2 : percentage}%` }}
                ></div>
              </div>

              {/* Tooltip detail */}
              <div className="text-[10px] text-slate-500 mt-2 opacity-0 
              group-hover:opacity-100 transition-opacity duration-300 absolute right-0 -bottom-4">
                {FIVE_ELEMENTS_INFO[type].keywords}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center space-y-8">
        <div className="inline-block p-6 glass-midnight rounded-sm border-gold/10">
          <div className="text-xs text-gold/60 uppercase tracking-[0.3em] mb-3">System Dominance</div>
          <div className={`font-serif text-2xl text-gold text-glow-gold mb-2`}>
            {FIVE_ELEMENTS_INFO[dominant].english}
          </div>
          <div className="text-sm text-slate-400 mt-2 italic max-w-[240px] leading-relaxed">
            {FIVE_ELEMENTS_INFO[dominant].keywords}
          </div>
        </div>

        {strengthInfo && (
          <div className="p-6 border-t border-white/5 pt-10">
            <div className="text-xs text-slate-500 uppercase tracking-[0.3em] mb-4">Operational Advisory</div>
            <div className="font-serif text-xl text-slate-100 mb-2">
              {strengthInfo.isStrong ? "Strong Structure" : "Weak Structure"}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mb-6 uppercase tracking-widest">
              Index: {Math.round(strengthInfo.score)} / Base {strengthInfo.total}
            </div>
            <div className="inline-block bg-gold/10 border border-gold/20 px-6 py-2 text-xs font-bold uppercase tracking-widest text-gold">
              {strengthInfo.advice}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
