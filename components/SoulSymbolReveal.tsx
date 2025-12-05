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
    // Animation States
    const [stage, setStage] = useState<'gathering' | 'converging' | 'flash' | 'token' | 'reveal'>('gathering');
    const archetype = getArchetype(chart);
    const dmElement = chart.dayMaster.element;

    useEffect(() => {
        // Animation Timeline
        // 0s: Gathering (Spinning elements)
        // 1.5s: Converging (Implosion)
        const t1 = setTimeout(() => setStage('converging'), 1500);
        // 2.0s: Flash (Collision)
        const t2 = setTimeout(() => setStage('flash'), 2000);
        // 2.1s: Token (Symbol Formed)
        const t3 = setTimeout(() => setStage('token'), 2100);
        // 5s: Reveal (Full Card)
        const t4 = setTimeout(() => setStage('reveal'), 5500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, []);

    // Helper for 5 Elements
    const elements = [
        { char: '木', color: 'bg-wood', icon: 'tree' },
        { char: '火', color: 'bg-fire', icon: 'lantern' },
        { char: '土', color: 'bg-earth', icon: 'rock' },
        { char: '金', color: 'bg-metal', icon: 'sword' },
        { char: '水', color: 'bg-water', icon: 'river' },
    ];

    if (stage === 'reveal') {
        // ... (Keep existing Reveal Card)
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper animate-fade-in px-4">
                <div className="w-full max-w-md bg-white border border-stone-100 shadow-2xl p-8 md:p-12 text-center rounded-sm relative overflow-hidden animate-slide-up">
                    <div className={`absolute top-0 left-0 w-full h-2 bg-${dmElement.toLowerCase()}`}></div>
                    <div className="mb-8 relative inline-block">
                        <div className={`absolute inset-0 bg-${dmElement.toLowerCase()}/20 rounded-full blur-xl scale-150`}></div>
                        <div className={`text-${dmElement.toLowerCase()} relative z-10 p-4 border-2 border-${dmElement.toLowerCase()} rounded-full`}>
                            <ElementIcon type={STEM_SYMBOLS[chart.dayMaster.chinese]} className="w-16 h-16" />
                        </div>
                    </div>
                    <h3 className="text-ink/60 text-xs font-bold uppercase tracking-[0.2em] mb-3">Your Elemental Archetype</h3>
                    <h1 className="text-3xl md:text-4xl font-title font-bold text-ink mb-2">{archetype.title}</h1>
                    <div className="w-12 h-0.5 bg-seal mx-auto mb-4"></div>
                    <p className="text-seal font-serif italic text-lg mb-6">{archetype.tagline}</p>
                    <p className="text-ink/70 text-sm leading-relaxed mb-10">{archetype.description}</p>
                    <button onClick={onComplete} className="w-full bg-ink text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-seal transition-colors">
                        Explore Your Blueprint
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'token') {
        // ... (Keep existing Token Display but emphasize the Character)
        return (
            <div className="fixed inset-0 z-50 bg-paper flex items-center justify-center animate-fade-in">
                <div className="flex flex-col items-center">
                    <h3 className="text-ink/40 text-xs font-bold uppercase tracking-[0.3em] mb-12 animate-pulse">Destiny Decoded</h3>

                    {/* The Soul Symbol */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        {/* 1. The Generative Aura (Spinning) */}
                        <div className="absolute inset-0 animate-[spin_12s_linear_infinite] opacity-50">
                            <svg viewBox="0 0 100 100" className={`w-full h-full stroke-${dmElement.toLowerCase()} fill-none stroke-[0.5]`}>
                                {dmElement === 'Wood' && <><circle cx="50" cy="50" r="45" /><rect x="48" y="5" width="4" height="90" /></>}
                                {dmElement === 'Fire' && <><polygon points="50,5 95,90 5,90" /><circle cx="50" cy="50" r="20" /></>}
                                {dmElement === 'Earth' && <><rect x="15" y="15" width="70" height="70" /><rect x="25" y="25" width="50" height="50" /></>}
                                {dmElement === 'Metal' && <><circle cx="50" cy="50" r="40" /><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="20" /></>}
                                {dmElement === 'Water' && <><path d="M10,50 Q50,0 90,50 Q50,100 10,50" /></>}
                            </svg>
                        </div>

                        {/* 2. The Day Master Character (The Core) */}
                        <div className="z-10 animate-slide-up">
                            <span className={`font-sc font-bold text-8xl text-ink drop-shadow-2xl`}>
                                {chart.dayMaster.chinese}
                            </span>
                        </div>

                        {/* 3. Seals/Stamps */}
                        <div className="absolute bottom-0 right-0 border-2 border-seal text-seal p-1 font-sc text-xs font-bold rotate-[-10deg] opacity-80">
                            {chart.dayMaster.element}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Gathering & Converging Stage
    return (
        <div className="fixed inset-0 z-50 bg-ink flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">

                {/* Flash Effect */}
                {stage === 'flash' && <div className="absolute inset-0 bg-white animate-pulse z-30"></div>}

                {/* Central Point */}
                <div className="absolute w-2 h-2 bg-white rounded-full z-10 shadow-[0_0_20px_rgba(255,255,255,0.8)]"></div>

                {/* 5 Elements Orbiting/Converging */}
                {elements.map((el, i) => {
                    // Position in a circle
                    const angle = (i * 72) * (Math.PI / 180);
                    const radius = 120; // px
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <div
                            key={i}
                            className={`absolute flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-white font-sc font-bold text-lg
                            transition-all duration-[800ms] ease-in-out ${el.color}
                            ${stage === 'converging' ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
                            style={{
                                transform: stage === 'converging'
                                    ? `translate(0px, 0px)` // Move to center
                                    : `translate(${x}px, ${y}px)` // Circle position
                            }}
                        >
                            {el.char}
                        </div>
                    );
                })}

                <div className="absolute bottom-20 text-white/30 font-sans uppercase tracking-[0.3em] text-xs animate-pulse">
                    Synthesizing Elements...
                </div>
            </div>
        </div>
    );
};
