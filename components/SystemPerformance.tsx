

import React from 'react';
import { SystemMetric } from '../types';

interface SystemPerformanceProps {
    metrics: Record<string, SystemMetric>;
}

export const SystemPerformance: React.FC<SystemPerformanceProps> = ({ metrics }) => {
    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-20 animate-fade-in-up">
                <h3 className="text-4xl font-serif text-ink mb-4 tracking-tight">The 6 Dimensions of Inner Force</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 px-4">
                {(Object.entries(metrics) as [string, SystemMetric][]).map(([key, metric], index) => (
                    <div key={key} className="bg-silk/40 border border-black/5 p-8 rounded-sm backdrop-blur-sm relative group hover:border-gold/20 transition-all duration-500 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>

                        {/* Chip Header: Label & Status */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-seal group-hover:text-gold transition-colors duration-300">
                                    {metric.label}
                                </span>
                                <span className="font-mono text-sm text-gold/80 bg-gold/5 border border-gold/10 px-2 py-1 rounded-sm inline-block">
                                    {metric.status || 'Calibrating...'}
                                </span>
                            </div>
                            <span className="font-mono text-3xl font-bold text-ink group-hover:text-gold group-hover:text-glow-gold transition-colors duration-300">
                                {metric.value}<span className="text-sm text-seal/50 ml-1">/100</span>
                            </span>
                        </div>

                        {/* Visual: Cell/Battery Pack Style */}
                        <div className="w-full h-12 flex gap-1 mb-8">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 h-full rounded-sm transition-all duration-700 ${(i / 20) * 100 < metric.value
                                        ? 'bg-gold shadow-[0_0_8px_rgba(197,160,89,0.2)]'
                                        : 'bg-black/5'
                                        }`}
                                ></div>
                            ))}
                        </div>

                        {/* Content: Description */}
                        <p className="text-sm text-seal leading-relaxed mb-6 font-light">
                            {metric.description}
                        </p>

                        {/* Founder Insight (Console/Terminal Style) */}
                        {metric.founderInsight && (
                            <div className="mt-6 border-t border-dashed border-black/10 pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-seal/70">Founder Insight</span>
                                </div>
                                <div className="font-mono text-xs text-red-900/70 bg-red-500/5 border-l-2 border-red-500/50 pl-4 py-2 italic">
                                    "{metric.founderInsight}"
                                </div>
                            </div>
                        )}

                        {/* Decorative Corner Markers */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/10 group-hover:border-gold/50 transition-colors"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/10 group-hover:border-gold/50 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/10 group-hover:border-gold/50 transition-colors"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/10 group-hover:border-gold/50 transition-colors"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};
