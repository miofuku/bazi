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
      <h3 className="text-center font-serif italic text-seal/60 text-lg mb-8">Your Elemental Composition</h3>

      <div className="space-y-5">
        {(Object.values(ElementType) as ElementType[]).map((type) => {
          const value = data[type] || 0;
          const percentage = Math.round((value / total) * 100);
          const isDominant = type === dominant;
          const isMissing = value === 0;

          return (
            <div key={type} className="group relative">
              <div className="flex justify-between items-end mb-2 text-xs uppercase tracking-widest text-ink/40">
                <div className="flex items-center gap-2">
                  <span className={`font-bold transition-colors duration-300 ${isDominant ? ELEMENT_COLORS[type].split(' ')[0] : ''}`}>
                    {FIVE_ELEMENTS_INFO[type].english}
                  </span>
                  {isDominant && (
                    <span className="bg-ink/5 text-[9px] px-1.5 py-0.5 rounded text-ink/60 font-bold">DOMINANT</span>
                  )}
                  {isMissing && (
                    <span className="bg-stone-100 text-[9px] px-1.5 py-0.5 rounded text-stone-400 font-bold">VOID</span>
                  )}
                </div>
                <span className="font-mono text-[10px] opacity-50">{percentage}%</span>
              </div>

              <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${ELEMENT_BG_COLORS[type]} transition-all duration-1000 ease-out rounded-full ${isDominant ? 'opacity-100' : 'opacity-60 grayscale-[0.3]'}`}
                  style={{ width: `${percentage === 0 ? 2 : percentage}%` }} // Minimal width for visibility
                ></div>
              </div>

              {/* Tooltip-like details on hover (optional) */}
              <div className="text-[10px] text-ink/30 mt-1 opacity-0 
              group-hover:opacity-100 transition-opacity duration-300 absolute right-0 -bottom-4">
                {FIVE_ELEMENTS_INFO[type].keywords}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center space-y-6">
        <div className="inline-block p-4 bg-paper/50 rounded-lg border border-ink/5 backdrop-blur-sm">
          <div className="text-xs text-ink/40 uppercase tracking-widest mb-1">Your Superpower</div>
          <div className={`font-serif text-xl ${ELEMENT_COLORS[dominant].split(' ')[0]}`}>
            {FIVE_ELEMENTS_INFO[dominant].english}
          </div>
          <div className="text-sm text-ink/60 mt-1 italic">
            {FIVE_ELEMENTS_INFO[dominant].keywords}
          </div>
        </div>

        {strengthInfo && (
          <div className="p-4 border-t border-ink/5">
            <div className="text-xs text-ink/40 uppercase tracking-widest mb-2">Life Strategy</div>
            <div className="font-serif text-lg text-ink/80">
              {strengthInfo.isStrong ? "Strong Structure" : "Weak Structure"}
            </div>
            <div className="text-sm text-ink/60 mt-1 mb-3">
              (Self + Resource = {Math.round(strengthInfo.score)} / {strengthInfo.total})
            </div>
            <div className="inline-block bg-stone-100 px-4 py-2 rounded-full text-sm font-medium text-ink/70">
              {strengthInfo.advice}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
