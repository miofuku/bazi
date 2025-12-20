import React from 'react';

export const Methodology: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            <div className="text-center mb-24">
                <h2 className="text-[10px] uppercase tracking-[0.6em] text-gold mb-8 font-bold">The Chronosophy Method</h2>
                <h3 className="text-4xl md:text-5xl font-serif text-slate-100 mb-6 tracking-tight">Where Metaphysics Meets Systems Theory</h3>
                <div className="w-24 h-px bg-gold/30 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* The Science of Timing */}
                <div className="glass-midnight border-white/5 p-12 rounded-sm group hover:border-gold/20 transition-all duration-700">
                    <div className="text-gold mb-10 opacity-60 group-hover:opacity-100 transition-opacity">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h4 className="text-xl font-serif text-slate-100 mb-6">The Science of Timing</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Time is not just a linear measurement, but a non-linear existence with specific "textures." We analyze these textures as systemic phases of expansion and consolidation.
                    </p>
                    <div className="h-px w-8 bg-gold/30"></div>
                </div>

                {/* Eastern Wisdom */}
                <div className="glass-midnight border-white/5 p-12 rounded-sm group hover:border-gold/20 transition-all duration-700">
                    <div className="text-gold mb-10 opacity-60 group-hover:opacity-100 transition-opacity">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    <h4 className="text-xl font-serif text-slate-100 mb-6">Infrastructure Logic</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        The 5 Elements are mapped to modern **Feedback Loops** and **Entropy Management**. We decode how your energy source interacts with external environmental variables.
                    </p>
                    <div className="h-px w-8 bg-gold/30"></div>
                </div>

                {/* Mindset Cultivation */}
                <div className="glass-midnight border-white/5 p-12 rounded-sm group hover:border-gold/20 transition-all duration-700">
                    <div className="text-gold mb-10 opacity-60 group-hover:opacity-100 transition-opacity">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <h4 className="text-xl font-serif text-slate-100 mb-6">Strategic Equilibrium</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Knowing your "destiny" is about achieving higher-order freedom. Through systemic clarity, you manifest **Free Will within a Structured Universe**.
                    </p>
                    <div className="h-px w-8 bg-gold/30"></div>
                </div>
            </div>

            <div className="mt-24 text-center">
                <div className="inline-flex items-center gap-6 px-10 py-5 glass-midnight border border-gold/20 rounded-sm">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">The Goal:</span>
                    <span className="text-slate-300 font-serif italic">"Achieve resonance by understanding the architecture of existence."</span>
                </div>
            </div>
        </div>
    );
};
