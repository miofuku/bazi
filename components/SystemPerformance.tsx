import React from 'react';
import { SystemMetric } from '../types';

interface SystemPerformanceProps {
    metrics: Record<string, SystemMetric>;
}

export const SystemPerformance: React.FC<SystemPerformanceProps> = ({ metrics }) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h3 className="text-2xl font-title text-ink mb-2">Systemic Performance Indicators</h3>
                <p className="text-ink/40 text-xs uppercase tracking-[0.2em]">Diagnostic Neural Evaluation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(Object.entries(metrics) as [string, SystemMetric][]).map(([key, metric]) => (
                    <div key={key} className="bg-white/50 border border-ink/5 p-6 rounded-sm hover:border-seal/20 transition-all group">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 group-hover:text-seal transition-colors">
                                {metric.label}
                            </span>
                            <span className="font-mono text-xl text-ink font-light">{metric.value}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-ink transition-all duration-1000 ease-out rounded-full group-hover:bg-seal"
                                style={{ width: `${metric.value}%` }}
                            ></div>
                        </div>

                        <p className="text-xs text-ink/60 leading-relaxed italic">
                            "{metric.description}"
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 border border-dashed border-ink/10 rounded-sm bg-stone-50/50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-ink/20 flex items-center justify-center shrink-0">
                        <span className="text-ink/40 text-[10px] font-bold uppercase tracking-tighter">AI</span>
                    </div>
                    <p className="text-[11px] text-ink/50 uppercase tracking-widest leading-relaxed">
                        These metrics quantify the interaction between your <span className="text-ink font-bold">Initial conditions</span> and core <span className="text-ink font-bold">logic architecture</span>. Consult the AI Strategist below for energy allocation pathways.
                    </p>
                </div>
            </div>
        </div>
    );
};
