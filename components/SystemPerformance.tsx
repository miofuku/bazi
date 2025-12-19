import React from 'react';
import { SystemMetric } from '../types';

interface SystemPerformanceProps {
    metrics: Record<string, SystemMetric>;
}

export const SystemPerformance: React.FC<SystemPerformanceProps> = ({ metrics }) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h3 className="text-3xl font-serif text-slate-100 mb-3 tracking-tight">Systemic Performance Indicators</h3>
                <p className="text-gold/60 text-[10px] uppercase font-sans tracking-[0.4em]">Diagnostic Neural Evaluation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(Object.entries(metrics) as [string, SystemMetric][]).map(([key, metric]) => (
                    <div key={key} className="glass-midnight border-white/5 p-8 rounded-sm hover:border-gold/30 transition-all duration-500 group">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-gold transition-colors">
                                {metric.label}
                            </span>
                            <span className="font-mono text-2xl text-slate-100 font-light text-glow-gold">{metric.value}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-6 border border-white/5">
                            <div
                                className="h-full bg-slate-500 transition-all duration-1000 ease-out rounded-full group-hover:bg-gold group-hover:shadow-[0_0_10px_rgba(197,160,89,0.3)]"
                                style={{ width: `${metric.value}%` }}
                            ></div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed italic border-l border-gold/20 pl-4 py-1">
                            "{metric.description}"
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-16 p-8 border border-white/5 rounded-sm bg-white/2 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-12 h-12 border border-gold/30 flex items-center justify-center shrink-0 rotate-45">
                        <span className="text-gold text-[10px] font-bold uppercase tracking-tighter -rotate-45">CODE</span>
                    </div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-[0.2em] leading-relaxed text-center md:text-left">
                        These metrics quantify the interaction between your <span className="text-gold font-bold">Initial conditions</span> and core <span className="text-gold font-bold">logic architecture</span>. Consult the AI Strategist below for energy allocation pathways.
                    </p>
                </div>
            </div>
        </div>
    );
};
