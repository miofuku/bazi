import React from 'react';
import { BaziChart } from '../types';

interface TemporalSynergyProps {
    chart: BaziChart;
}

export const TemporalSynergy: React.FC<TemporalSynergyProps> = ({ chart }) => {
    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-serif text-slate-100 mb-4 tracking-tight">Navigating Your Personal Seasons</h2>
                <div className="w-24 h-px bg-gold/30 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
                {/* Past Reflect */}
                <div className="glass-midnight border-white/5 p-10 rounded-sm relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-800 group-hover:bg-gold/40 transition-colors"></div>
                    <h3 className="text-xs uppercase tracking-[0.4em] text-gold/60 mb-6 font-bold">Past Reflect</h3>
                    <p className="text-slate-300 font-serif italic text-lg leading-relaxed mb-6">
                        "Decipher the frictions that shaped your evolution."
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
                        解析那些塑造你进化的磨损与压力。
                    </p>
                </div>

                {/* Present Alignment */}
                <div className="glass-midnight border-gold/20 p-10 rounded-sm relative group overflow-hidden shadow-[0_0_30px_rgba(197,160,89,0.05)]">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
                    <h3 className="text-xs uppercase tracking-[0.4em] text-gold mb-6 font-bold">Present Alignment</h3>
                    <p className="text-slate-100 font-serif italic text-xl leading-relaxed mb-6">
                        "Understand the current atmospheric pressure of your career and spirit."
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
                        理解你目前职场与心性的“大气压”。
                    </p>
                </div>

                {/* Future Projection */}
                <div className="glass-midnight border-white/5 p-10 rounded-sm relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-800 group-hover:bg-gold/40 transition-colors"></div>
                    <h3 className="text-xs uppercase tracking-[0.4em] text-gold/60 mb-6 font-bold">Future Projection</h3>
                    <p className="text-slate-300 font-serif italic text-lg leading-relaxed mb-6">
                        "Anticipate the next Window of Opportunity."
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
                        预测下一个机会窗口期。
                    </p>
                </div>
            </div>

            {/* Friction Report Concept */}
            <div className="bg-white/2 border border-white/10 rounded-sm p-12 md:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -mr-32 -mt-32"></div>
                <div className="max-w-3xl">
                    <h4 className="text-[10px] uppercase tracking-[0.6em] text-gold mb-8 font-bold">The Friction Report</h4>
                    <p className="text-2xl md:text-3xl font-serif text-slate-100 leading-tight mb-8">
                        "Success is not just effort; it’s the reduction of systemic friction."
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-2xl">
                        We show you when to accelerate <span className="text-gold italic">(Synergy)</span> and when to consolidate <span className="text-gold italic">(Friction)</span>.
                        Your timeline is not a straight line, but a series of atmospheric shifts.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="h-px w-12 bg-gold/40"></div>
                        <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500 italic">Temporal Efficiency Audit</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
