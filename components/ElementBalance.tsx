import React from 'react';
import { ElementType } from '../types';
import { ELEMENT_BG_COLORS, ELEMENT_COLORS } from '../utils/constants';

interface ElementBalanceProps {
  counts: Record<ElementType, number>;
}

const getElementIcon = (element: ElementType, className: string = "w-4 h-4") => {
  switch (element) {
    case ElementType.WOOD: return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L12 22 M12 6L8 10 M12 10L16 14 M12 14L8 18" stroke="currentColor" strokeWidth="2" /></svg>;
    case ElementType.FIRE: return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c0 0-6 5-6 11a6 6 0 1 0 12 0c0-6-6-11-6-11z"/></svg>;
    case ElementType.EARTH: return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 20h18L12 4z"/></svg>;
    case ElementType.METAL: return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/></svg>;
    case ElementType.WATER: return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s-6 7-6 12a6 6 0 1 0 12 0c0-5-6-12-6-12z"/></svg>;
    default: return null;
  }
};

// SVG Diagram Component
const FiveElementsDiagram: React.FC = () => {
  // Positions based on 200x200 viewBox, center 100,100, Radius ~70
  // Order clockwise: Fire(Top) -> Earth -> Metal -> Water -> Wood -> Fire
  const pos = {
    [ElementType.FIRE]: { x: 100, y: 25 },
    [ElementType.EARTH]: { x: 171, y: 77 },
    [ElementType.METAL]: { x: 144, y: 163 },
    [ElementType.WATER]: { x: 56, y: 163 },
    [ElementType.WOOD]: { x: 29, y: 77 },
  };

  // Tailwind Colors (Hardcoded to match constants for SVG usage)
  const colors = {
    [ElementType.WOOD]: '#4A6741',
    [ElementType.FIRE]: '#B24C3B',
    [ElementType.EARTH]: '#8C7051',
    [ElementType.METAL]: '#D4AF37',
    [ElementType.WATER]: '#3D5A6C',
  };

  return (
    <div className="mt-8 pt-8 border-t border-stone-100 flex flex-col items-center">
      <h4 className="text-xs font-title font-bold uppercase tracking-widest text-ink/50 mb-4">Cycle of Qi</h4>
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <path d="M0,0 L0,4 L6,2 z" fill="#999" />
            </marker>
          </defs>

          {/* Generating Cycle (Circle/Outer) */}
          <g className="opacity-20">
             <path 
               d={`M${pos[ElementType.FIRE].x},${pos[ElementType.FIRE].y} L${pos[ElementType.EARTH].x},${pos[ElementType.EARTH].y} L${pos[ElementType.METAL].x},${pos[ElementType.METAL].y} L${pos[ElementType.WATER].x},${pos[ElementType.WATER].y} L${pos[ElementType.WOOD].x},${pos[ElementType.WOOD].y} Z`}
               fill="none"
               stroke="currentColor"
               strokeWidth="1"
               strokeDasharray="4 2"
             />
          </g>
           {/* Generation Arrows (Curved slightly) */}
           <path d={`M${pos[ElementType.FIRE].x},${pos[ElementType.FIRE].y+10} Q135,50 ${pos[ElementType.EARTH].x-5},${pos[ElementType.EARTH].y-5}`} fill="none" stroke="#ccc" strokeWidth="1" markerEnd="url(#arrowhead)" />
           <path d={`M${pos[ElementType.EARTH].x-5},${pos[ElementType.EARTH].y+5} Q160,120 ${pos[ElementType.METAL].x},${pos[ElementType.METAL].y-10}`} fill="none" stroke="#ccc" strokeWidth="1" markerEnd="url(#arrowhead)" />
           <path d={`M${pos[ElementType.METAL].x-10},${pos[ElementType.METAL].y} Q100,170 ${pos[ElementType.WATER].x+10},${pos[ElementType.WATER].y}`} fill="none" stroke="#ccc" strokeWidth="1" markerEnd="url(#arrowhead)" />
           <path d={`M${pos[ElementType.WATER].x},${pos[ElementType.WATER].y-10} Q40,120 ${pos[ElementType.WOOD].x+5},${pos[ElementType.WOOD].y+5}`} fill="none" stroke="#ccc" strokeWidth="1" markerEnd="url(#arrowhead)" />
           <path d={`M${pos[ElementType.WOOD].x+5},${pos[ElementType.WOOD].y-5} Q65,50 ${pos[ElementType.FIRE].x},${pos[ElementType.FIRE].y+10}`} fill="none" stroke="#ccc" strokeWidth="1" markerEnd="url(#arrowhead)" />


          {/* Controlling Cycle (Star/Inner) */}
          <g className="opacity-10">
            <path 
              d={`M${pos[ElementType.FIRE].x},${pos[ElementType.FIRE].y} L${pos[ElementType.METAL].x},${pos[ElementType.METAL].y} L${pos[ElementType.WOOD].x},${pos[ElementType.WOOD].y} L${pos[ElementType.EARTH].x},${pos[ElementType.EARTH].y} L${pos[ElementType.WATER].x},${pos[ElementType.WATER].y} Z`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </g>

          {/* Element Nodes */}
          {Object.keys(pos).map((key) => {
            const type = key as ElementType;
            const p = pos[type];
            return (
              <g key={type} transform={`translate(${p.x}, ${p.y})`}>
                <circle r="14" fill="white" stroke={colors[type]} strokeWidth="2" />
                <g transform="translate(-7, -7)" className={ELEMENT_COLORS[type]}>
                  {getElementIcon(type, "w-3.5 h-3.5")}
                </g>
                <text y="24" textAnchor="middle" className="text-[8px] font-serif uppercase fill-stone-500 tracking-wider">{type}</text>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-2 text-[9px] uppercase tracking-widest text-stone-400">
           <div className="flex items-center gap-1">
             <span className="w-3 h-px bg-stone-400"></span> Creation
           </div>
           <div className="flex items-center gap-1">
             <span className="w-3 h-px bg-stone-300 opacity-50"></span> Control
           </div>
        </div>
      </div>
    </div>
  );
};

export const ElementBalance: React.FC<ElementBalanceProps> = ({ counts }) => {
  const values = Object.values(counts) as number[];
  const max = Math.max(...values) || 1;

  return (
    <div className="bg-white p-8 border-2 border-stone-100 relative w-full shadow-sm">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-ink/30"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-ink/30"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-ink/30"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-ink/30"></div>

      <h3 className="text-lg font-title text-ink mb-6 tracking-widest text-center border-b border-stone-100 pb-4">
        Elemental Qi
      </h3>
      
      <div className="space-y-6">
        {Object.values(ElementType).map((type, idx) => {
          const count = counts[type];
          const percentage = (count / max) * 100;
          
          return (
            <div key={type} className="group">
              <div className="flex justify-between items-end mb-2 text-xs uppercase tracking-wider font-bold text-stone-500">
                 <div className="flex items-center gap-2">
                    <span className={`${ELEMENT_COLORS[type]}`}>{getElementIcon(type)}</span>
                    <span>{type}</span>
                 </div>
                 <span className="text-ink">{count}</span>
              </div>
              
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${ELEMENT_BG_COLORS[type]} opacity-80 group-hover:opacity-100 transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Interaction Diagram */}
      <FiveElementsDiagram />
    </div>
  );
};
