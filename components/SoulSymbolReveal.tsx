import React, { useEffect, useState } from 'react';
import { BaziChart } from '../types';
import { getArchetype } from '../utils/archetypes';
import { ELEMENT_COLORS, STEM_SYMBOLS } from '../utils/constants';
import { ElementIcon } from './BaziChartDisplay';

interface SoulSymbolRevealProps {
    chart: BaziChart;
    onComplete: () => void;
}

export const SoulSymbolReveal: React.FC<SoulSymbolRevealProps> = ({ chart, onComplete }) => {
    const [stage, setStage] = useState<'gathering' | 'converging' | 'flash' | 'reveal'>('gathering');
    const archetype = getArchetype(chart);
    const dmElement = chart.dayMaster.element;

    useEffect(() => {
        // Animation Timeline
        const t1 = setTimeout(() => setStage('converging'), 1500); // Gather for 1.5s
        const t2 = setTimeout(() => setStage('flash'), 3000);      // Converge for 1.5s -> Flash
        const t3 = setTimeout(() => setStage('reveal'), 3100);     // Reveal almost immediately after flash

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    if (stage === 'reveal') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper animate-fade-in px-4">
                {/* Modern Zen Card */}
                <div className="w-full max-w-md bg-white border border-stone-100 shadow-2xl p-8 md:p-12 text-center rounded-sm relative overflow-hidden animate-slide-up">

                    {/* Background Gradient Hint */}
                    <div className={`absolute top-0 left-0 w-full h-2 bg-${dmElement.toLowerCase()}`}></div>

                    {/* Icon */}
                    <div className="mb-8 relative inline-block">
                        <div className={`absolute inset-0 bg-${dmElement.toLowerCase()}/20 rounded-full blur-xl scale-150`}></div>
                        <div className={`text-${dmElement.toLowerCase()} relative z-10 p-4 border-2 border-${dmElement.toLowerCase()} rounded-full`}>
                            <ElementIcon type={STEM_SYMBOLS[chart.dayMaster.chinese]} className="w-16 h-16" />
                        </div>
                    </div>

                    {/* Labels */}
                    <h3 className="text-ink/60 text-xs font-bold uppercase tracking-[0.2em] mb-3">Your Elemental Archetype</h3>
                    <h1 className="text-3xl md:text-4xl font-title font-bold text-ink mb-2">{archetype.title}</h1>
                    <div className="w-12 h-0.5 bg-seal mx-auto mb-4"></div>
                    <p className="text-seal font-serif italic text-lg mb-6">{archetype.tagline}</p>

                    <p className="text-ink/70 text-sm leading-relaxed mb-10">
                        {archetype.description}
                    </p>

                    <button
                        onClick={onComplete}
                        className="w-full bg-ink text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-seal transition-colors"
                    >
                        Explore Your Blueprint
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-ink flex items-center justify-center overflow-hidden">
            {/* Animation Content */}
            <div className="relative w-full h-full flex items-center justify-center">

                {/* Flash */}
                {stage === 'flash' && (
                    <div className="absolute inset-0 bg-white animate-pulse z-20"></div>
                )}

                {/* Central Core */}
                <div className={`w-4 h-4 bg-white rounded-full z-10 transition-all duration-[1500ms] ${stage === 'converging' ? 'scale-[20] opacity-0' : 'scale-100'}`}></div>

                {/* Converging Elements Text */}
                <div className={`absolute text-white/50 font-sc font-bold text-xl transition-all duration-[1000ms] transform 
                ${stage === 'converging' ? 'translate-x-0 translate-y-0 opacity-0 scale-50' : '-translate-x-20 -translate-y-20 opacity-100'}`}>
                    木
                </div>
                <div className={`absolute text-white/50 font-sc font-bold text-xl transition-all duration-[1000ms] transform 
                ${stage === 'converging' ? 'translate-x-0 translate-y-0 opacity-0 scale-50' : 'translate-x-20 -translate-y-20 opacity-100'}`}>
                    火
                </div>
                <div className={`absolute text-white/50 font-sc font-bold text-xl transition-all duration-[1000ms] transform 
                ${stage === 'converging' ? 'translate-x-0 translate-y-0 opacity-0 scale-50' : 'translate-x-20 translate-y-20 opacity-100'}`}>
                    土
                </div>
                <div className={`absolute text-white/50 font-sc font-bold text-xl transition-all duration-[1000ms] transform 
                ${stage === 'converging' ? 'translate-x-0 translate-y-0 opacity-0 scale-50' : '-translate-x-20 translate-y-20 opacity-100'}`}>
                    金
                </div>
                <div className={`absolute text-white/50 font-sc font-bold text-xl transition-all duration-[1000ms] transform 
                ${stage === 'converging' ? 'translate-x-0 translate-y-0 opacity-0 scale-50' : 'translate-y-32 opacity-100'}`}>
                    水
                </div>

                {/* Text */}
                <div className="absolute bottom-20 text-white/50 font-sans uppercase tracking-[0.3em] text-xs">
                    Analyzing Elemental Structure...
                </div>
            </div>
        </div>
    );
};
