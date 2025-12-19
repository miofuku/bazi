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
        <div className={`relative w-full min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-midnight border-b border-white/5`}>
            {/* Background Decorative Elements */}
            <div className={`absolute top-0 w-full h-full opacity-20 pointer-events-none`}>
                <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gold/10 blur-[120px]`}></div>
                <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-midnight-light blur-[80px]`}></div>
                <div className="absolute inset-0 generative-bg opacity-30"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6 animate-fade-in group">

                {/* Soul Symbol */}
                <div className="relative w-56 h-56 mb-12 transition-transform duration-1000 hover:scale-105">
                    {/* Rotating Aura */}
                    <div className="absolute inset-0 animate-[spin_30s_linear_infinite] opacity-40">
                        <svg viewBox="0 0 100 100" className={`w-full h-full stroke-gold fill-none stroke-[0.3]`}>
                            {dmElement === 'Wood' && <><circle cx="50" cy="50" r="45" /><rect x="48" y="5" width="4" height="90" /></>}
                            {dmElement === 'Fire' && <><polygon points="50,5 95,90 5,90" /><circle cx="50" cy="50" r="20" /></>}
                            {dmElement === 'Earth' && <><rect x="15" y="15" width="70" height="70" /><rect x="25" y="25" width="50" height="50" /></>}
                            {dmElement === 'Metal' && <><circle cx="50" cy="50" r="40" /><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="20" /></>}
                            {dmElement === 'Water' && <><path d="M10,50 Q50,0 90,50 Q50,100 10,50" /></>}
                        </svg>
                    </div>

                    {/* Center Character */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif font-bold text-8xl text-gold text-glow-gold drop-shadow-[0_0_15px_rgba(197,160,89,0.4)]">{dmChar}</span>
                    </div>

                    {/* Element Badge */}
                    <div className={`absolute -bottom-2 -right-2 bg-midnight-light px-4 py-1 rounded-full border border-gold/40 shadow-xl`}>
                        <span className={`text-[10px] uppercase font-bold tracking-[0.3em] text-gold`}>
                            {dmElement}
                        </span>
                    </div>
                </div>

                {/* Genetic Codex */}
                <div className="space-y-6 max-w-2xl">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-gold/60">Systemic Baseline: {chart.dayMaster.fullEnglishName || `${chart.dayMaster.polarity} ${chart.dayMaster.element}`}</span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-100 leading-tight tracking-tight">
                            {archetype.name}
                        </h1>
                    </div>

                    <div className="w-16 h-px bg-gold/30 mx-auto my-8"></div>

                    <p className="text-2xl md:text-3xl font-serif italic text-gold leading-relaxed drop-shadow-sm">
                        "{archetype.headline}"
                    </p>
                </div>

            </div>

            <div className="absolute bottom-10 animate-pulse">
                <svg className="w-6 h-6 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>
    );
};
