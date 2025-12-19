import React from 'react';
import { BaziChart } from '../types';
import { StructureResult } from '../utils/structures';
import { STEM_SYMBOLS } from '../utils/constants';

interface ResultHeroProps {
    chart: BaziChart;
    structure: StructureResult;
}

export const ResultHero: React.FC<ResultHeroProps> = ({ chart, structure }) => {
    const dmElement = chart.dayMaster.element;
    const dmChar = chart.dayMaster.chinese;
    const { name, archetype } = structure;

    // Visual cues based on DM Element
    const glowColors: Record<string, string> = {
        'Wood': 'from-wood/20 to-wood/5',
        'Fire': 'from-fire/20 to-fire/5',
        'Earth': 'from-earth/20 to-earth/5',
        'Metal': 'from-metal/20 to-metal/5',
        'Water': 'from-water/20 to-water/5',
    };

    const borderColors: Record<string, string> = {
        'Wood': 'border-wood',
        'Fire': 'border-fire',
        'Earth': 'border-earth',
        'Metal': 'border-metal',
        'Water': 'border-water',
    };

    const textColors: Record<string, string> = {
        'Wood': 'text-wood',
        'Fire': 'text-fire',
        'Earth': 'text-earth',
        'Metal': 'text-metal',
        'Water': 'text-water',
    };

    return (
        <div className={`relative w-full min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b ${glowColors[dmElement]} via-white to-white`}>
            {/* Background Decorative Elements */}
            <div className={`absolute top-0 w-full h-full opacity-10 pointer-events-none`}>
                <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-${dmElement.toLowerCase()}/30 blur-[100px]`}></div>
                <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-seal/5 blur-[80px]`}></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6 animate-fade-in group">

                {/* Soul Symbol (Static Version of Reveal) */}
                <div className="relative w-48 h-48 mb-10 transition-transform duration-700 hover:scale-105">
                    {/* Rotating Aura */}
                    <div className="absolute inset-0 animate-[spin_20s_linear_infinite] opacity-30">
                        <svg viewBox="0 0 100 100" className={`w-full h-full stroke-${dmElement.toLowerCase()} fill-none stroke-[0.5]`}>
                            {dmElement === 'Wood' && <><circle cx="50" cy="50" r="45" /><rect x="48" y="5" width="4" height="90" /></>}
                            {dmElement === 'Fire' && <><polygon points="50,5 95,90 5,90" /><circle cx="50" cy="50" r="20" /></>}
                            {dmElement === 'Earth' && <><rect x="15" y="15" width="70" height="70" /><rect x="25" y="25" width="50" height="50" /></>}
                            {dmElement === 'Metal' && <><circle cx="50" cy="50" r="40" /><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="20" /></>}
                            {dmElement === 'Water' && <><path d="M10,50 Q50,0 90,50 Q50,100 10,50" /></>}
                        </svg>
                    </div>

                    {/* Center Character */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-sc font-bold text-7xl text-ink drop-shadow-xl">{dmChar}</span>
                    </div>

                    {/* Element Badge */}
                    <div className={`absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full border ${borderColors[dmElement]} shadow-sm`}>
                        <span className={`text-[10px] uppercase font-bold tracking-widest ${textColors[dmElement]}`}>
                            {dmElement}
                        </span>
                    </div>
                </div>

                {/* Genetic Codex */}
                <div className="space-y-4 max-w-2xl">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Systemic Baseline: {chart.dayMaster.fullEnglishName || `${chart.dayMaster.polarity} ${chart.dayMaster.element}`}</span>
                        <h1 className="text-4xl md:text-6xl font-title font-bold text-ink leading-tight">
                            {archetype.name}
                        </h1>
                    </div>

                    <div className="w-16 h-0.5 bg-seal/20 mx-auto my-6"></div>

                    <p className="text-xl md:text-2xl font-serif italic text-seal leading-relaxed">
                        "{archetype.headline}"
                    </p>
                </div>

            </div>

            <div className="absolute bottom-10 animate-bounce">
                <svg className="w-6 h-6 text-ink/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>
    );
};
