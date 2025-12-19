import React from 'react';

export const LockedContent: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 mt-24 mb-32 relative">
            {/* Section Header */}
            <div className="text-center mb-16">
                <h2 className="text-3xl font-serif text-slate-100 mb-4 tracking-tight">Deep Strategy Layer</h2>
                <p className="text-gold/60 font-serif italic">Unlock Macro-Temporal Cycles and Venture Aggression metrics</p>
            </div>

            {/* Locked Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative p-4">
                {/* Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center bg-midnight/80 backdrop-blur-[8px] rounded-sm border border-white/5 shadow-2xl">
                    <div className="w-20 h-20 bg-gold text-midnight rounded-full flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-slate-100 mb-4">Scale Your Infrastructure</h3>
                    <p className="text-slate-400 max-w-sm mb-10 text-sm leading-relaxed">
                        You've mapped the baseline. Now optimize the output. Get detailed Macro-Cycle analysis, systemic wealth capacity, and high-fidelity synergy mapping.
                    </p>
                    <button className="bg-gold hover:bg-gold-light text-midnight px-12 py-5 rounded-sm font-bold uppercase tracking-[0.2em] shadow-xl hover:shadow-gold/20 hover:scale-105 transition-all duration-500">
                        Unlock Full Report • $19.99
                    </button>
                </div>

                {/* Blurred Mock Content Card 1 */}
                <div className="bg-white/2 p-10 rounded-sm h-72 flex flex-col items-center justify-center opacity-30 blur-[3px] border border-white/5">
                    <div className="text-[10px] uppercase font-sans tracking-[0.3em] text-gold mb-3">Macro-Temporal Cycles</div>
                    <div className="text-4xl font-serif text-slate-100">2026 - 2035</div>
                    <div className="w-16 h-px bg-gold/20 mt-6"></div>
                </div>

                {/* Blurred Mock Content Card 2 */}
                <div className="bg-white/2 p-10 rounded-sm h-72 flex flex-col items-center justify-center opacity-30 blur-[3px] border border-white/5">
                    <div className="text-[10px] uppercase font-sans tracking-[0.3em] text-gold mb-3">Resource Scaling Capacity</div>
                    <div className="text-4xl font-serif text-slate-100">Capital Flow</div>
                    <div className="w-16 h-px bg-gold/20 mt-6"></div>
                </div>
                {/* Blurred Mock Content Card 3 */}
                <div className="bg-white/2 p-10 rounded-sm h-72 flex flex-col items-center justify-center opacity-30 blur-[3px] border border-white/5">
                    <div className="text-[10px] uppercase font-sans tracking-[0.3em] text-gold mb-3">Relational Synergy Nodes</div>
                    <div className="text-4xl font-serif text-slate-100">Synchronicity</div>
                    <div className="w-16 h-px bg-gold/20 mt-6"></div>
                </div>
                {/* Blurred Mock Content Card 4 */}
                <div className="bg-white/2 p-10 rounded-sm h-72 flex flex-col items-center justify-center opacity-30 blur-[3px] border border-white/5">
                    <div className="text-[10px] uppercase font-sans tracking-[0.3em] text-gold mb-3">Strategic Architecture</div>
                    <div className="text-4xl font-serif text-slate-100">Optimization</div>
                    <div className="w-16 h-px bg-gold/20 mt-6"></div>
                </div>
            </div>

            {/* Social Proof Teaser */}
            <div className="mt-16 flex justify-center opacity-40">
                <div className="flex -space-x-3 mr-6">
                    {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-midnight"></div>)}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center uppercase tracking-widest">
                    Joined by 1,200+ strategists this week
                </div>
            </div>
        </div>
    );
};
