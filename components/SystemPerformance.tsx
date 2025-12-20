import React, { useState } from 'react';
import { SystemMetric } from '../types';

interface SystemPerformanceProps {
    metrics: Record<string, SystemMetric>;
}

export const SystemPerformance: React.FC<SystemPerformanceProps> = ({ metrics }) => {
    const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

    // Helper to get source logic description (Mock for now, normally from constituents)
    const getSourceLogic = (key: string) => {
        const mappings: Record<string, string> = {
            curiosity: "Output Stars (The Natural Alchemist / The Disruptive Innovator) + Fluid Intelligence",
            vision: "The Transcendental Visionary + Fire Variance",
            resilience: "Peer Resonance (The Peer Resonance / The Competitive Drive) + Grounding Matrix",
            logic: "Resource & Officer Stars + Structural Precision",
            venture: "The Strategic Aggressor + The Venture Opportunist",
            impact: "The Competitive Drive + Metal Resonance"
        };
        return mappings[key] || "Complex System Synergy";
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h3 className="text-3xl font-serif text-slate-100 mb-3 tracking-tight">The 6-Dimension Talent Stack</h3>
                <p className="text-gold/60 text-[10px] uppercase font-sans tracking-[0.4em]">System Capacity Analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {(Object.entries(metrics) as [string, SystemMetric][]).map(([key, metric]) => (
                    <div key={key} className="relative group"
                        onMouseEnter={() => setHoveredMetric(key)}
                        onMouseLeave={() => setHoveredMetric(null)}
                    >
                        {/* Label & Value */}
                        <div className="flex justify-between items-end mb-4 relative z-10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-gold transition-colors duration-300">
                                {metric.label}
                            </span>
                            <span className="font-mono text-xl text-slate-200 group-hover:text-gold group-hover:text-glow-gold transition-colors duration-300">
                                {metric.value} <span className="text-[10px] opacity-50">/ 100</span>
                            </span>
                        </div>

                        {/* RPG Bar Container */}
                        <div className="h-4 w-full bg-midnight/80 border border-white/5 skew-x-[-12deg] relative p-0.5 overflow-hidden shadow-inner">
                            {/* Background hash pattern */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 50%, #ffffff 50%, #ffffff 75%, transparent 75%, transparent)', backgroundSize: '4px 4px' }}></div>

                            {/* Active Bar */}
                            <div className="h-full bg-gradient-to-r from-slate-600 to-slate-400 group-hover:from-gold group-hover:to-amber-300 transition-all duration-700 ease-out relative"
                                style={{ width: `${metric.value}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="mt-4 text-xs text-slate-500 leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity">
                            "{metric.description}"
                        </p>

                        {/* Tooltip / Logic Reveal */}
                        <div className={`absolute -top-12 left-0 w-full flex justify-center transition-all duration-300 pointer-events-none transform ${hoveredMetric === key ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                            <div className="bg-midnight border border-gold/20 px-4 py-2 text-[9px] uppercase tracking-widest text-gold shadow-xl">
                                Source: {getSourceLogic(key)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
