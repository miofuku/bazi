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
        { char: 'W', color: 'bg-wood', icon: 'tree' },
        { char: 'F', color: 'bg-fire', icon: 'lantern' },
        { char: 'E', color: 'bg-earth', icon: 'rock' },
        { char: 'M', color: 'bg-metal', icon: 'sword' },
        { char: 'W', color: 'bg-water', icon: 'river' },
    ];

    if (stage === 'reveal') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight animate-fade-in px-4">
                <div className="w-full max-w-md glass-midnight border-gold/10 shadow-2xl p-10 md:p-14 text-center rounded-sm relative overflow-hidden animate-slide-up">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gold`}></div>
                    <div className="mb-10 relative inline-block">
                        <div className={`absolute inset-0 bg-gold/20 rounded-full blur-2xl scale-150`}></div>
                        <div className={`text-gold relative z-10 p-6 border border-gold/30 rounded-full`}>
                            <ElementIcon type={STEM_SYMBOLS[chart.dayMaster.chinese]} className="w-20 h-20" />
                        </div>
                    </div>
                    <h3 className="text-gold/60 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Your Elemental Archetype</h3>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-2 tracking-tight">{archetype.title}</h1>
                    <div className="w-16 h-px bg-gold/30 mx-auto mb-6"></div>
                    <p className="text-gold font-serif italic text-xl mb-8">"{archetype.tagline}"</p>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12">{archetype.description}</p>
                    <button onClick={onComplete} className="w-full bg-gold hover:bg-gold-light text-midnight py-5 font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-500 shadow-xl hover:shadow-gold/20">
                        Explore Your Blueprint
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'token') {
        return (
            <div className="fixed inset-0 z-50 bg-midnight flex items-center justify-center animate-fade-in">
                <div className="flex flex-col items-center">
                    <h3 className="text-gold/40 text-[10px] font-bold uppercase tracking-[0.5em] mb-16 animate-pulse">Initial Conditions Decoded</h3>

                    {/* The Soul Symbol */}
                    <div className="relative w-72 h-72 flex items-center justify-center">
                        {/* 1. The Generative Aura (Spinning) */}
                        <div className="absolute inset-0 animate-[spin_15s_linear_infinite] opacity-40">
                            <svg viewBox="0 0 100 100" className={`w-full h-full stroke-gold fill-none stroke-[0.3]`}>
                                {dmElement === 'Wood' && <><circle cx="50" cy="50" r="45" /><rect x="48" y="5" width="4" height="90" /></>}
                                {dmElement === 'Fire' && <><polygon points="50,5 95,90 5,90" /><circle cx="50" cy="50" r="20" /></>}
                                {dmElement === 'Earth' && <><rect x="15" y="15" width="70" height="70" /><rect x="25" y="25" width="50" height="50" /></>}
                                {dmElement === 'Metal' && <><circle cx="50" cy="50" r="40" /><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="20" /></>}
                                {dmElement === 'Water' && <><path d="M10,50 Q50,0 90,50 Q50,100 10,50" /></>}
                            </svg>
                        </div>

                        {/* 2. The Day Master Character (The Core) */}
                        <div className="z-10 animate-slide-up">
                            <span className={`font-serif font-bold text-9xl text-gold text-glow-gold drop-shadow-[0_0_20px_rgba(197,160,89,0.5)]`}>
                                {chart.dayMaster.chinese}
                            </span>
                        </div>

                        {/* 3. Parameter Marker */}
                        <div className="absolute -bottom-4 bg-midnight border border-gold/40 text-gold px-4 py-1.5 font-sans text-[10px] font-bold tracking-[0.3em] uppercase opacity-80 backdrop-blur-md">
                            {chart.dayMaster.element}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Gathering & Converging Stage
    return (
        <div className="fixed inset-0 z-50 bg-midnight flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 generative-bg opacity-30"></div>

                {/* Flash Effect */}
                {stage === 'flash' && <div className="absolute inset-0 bg-white animate-flash z-30"></div>}

                {/* Central Point */}
                <div className="absolute w-1 h-1 bg-gold rounded-full z-10 shadow-[0_0_20px_rgba(197,160,89,1)]"></div>

                {/* 5 Elements Orbiting/Converging */}
                {elements.map((el, i) => {
                    const angle = (i * 72) * (Math.PI / 180);
                    const radius = 160;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                        <div
                            key={i}
                            className={`absolute flex items-center justify-center w-14 h-14 rounded-full border border-gold/20 shadow-xl text-white font-sc font-bold text-xl
                            transition-all duration-[1000ms] ease-in-out ${el.color}
                            ${stage === 'converging' ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
                            style={{
                                transform: stage === 'converging'
                                    ? `translate(0px, 0px)`
                                    : `translate(${x}px, ${y}px)`
                            }}
                        >
                            {el.char}
                        </div>
                    );
                })}

                <div className="absolute bottom-24 text-gold/40 font-sans uppercase tracking-[0.5em] text-[10px] animate-pulse">
                    Synthesizing System Logic...
                </div>
            </div>
        </div>
    );
};
