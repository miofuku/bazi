import React from 'react';

export const TeamDynamics: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-serif text-slate-100 mb-4 tracking-tight">Collective Resonance</h2>
                <div className="w-24 h-px bg-gold/30 mx-auto"></div>
                <p className="mt-8 text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.2em]">
                    Build teams based on energy architecture, not just resumes.
                </p>
            </div>

            {/* Founder-Partner Fit */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                <div className="glass-midnight border-gold/10 p-12 rounded-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors"></div>
                    <h3 className="text-[10px] uppercase tracking-[0.5em] text-gold mb-8 font-bold">Founder-Partner Fit</h3>
                    <div className="space-y-10">
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-slate-100 font-serif text-xl">Complementary Loop</span>
                                <span className="text-gold font-bold text-[10px] uppercase tracking-widest">(互补环)</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                A self-sustaining feedback loop where one system's drainage is another's input. Ideal for long-term scaling and operational stability.
                            </p>
                        </div>
                        <div className="h-px w-full bg-white/5"></div>
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-slate-100 font-serif text-xl">Collision Course</span>
                                <span className="text-gold/50 font-bold text-[10px] uppercase tracking-widest">(冲突向)</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                High-intensity overlap of similar architectural nodes. Causes rapid acceleration but risks system burnout without external grounding.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center p-6">
                    <p className="text-2xl font-serif text-slate-300 leading-relaxed mb-8">
                        "Ensure your core circle has the elemental balance to survive the <span className="text-slate-100 italic">'Long Winter'</span> and thrive in the <span className="text-gold italic">'High Heat'</span>."
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="h-px w-8 bg-gold/40"></div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold italic text-gold/60">Team Architecture Logic</span>
                    </div>
                </div>
            </div>

            {/* The Archetype Map */}
            <div>
                <h3 className="text-center text-[10px] uppercase tracking-[0.6em] text-gold/40 mb-16 font-bold">The Archetype Map</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Expansive Pioneer',
                            zh: '发散型拓荒者',
                            desc: 'Driven by high-output creativity and novelty. The system\'s growth engine, optimized for Day 0 to Day 1.',
                            icon: 'M13 10V3L4 14h7v7l9-11h-7z'
                        },
                        {
                            title: 'Structural Anchor',
                            zh: '收敛型守成者',
                            desc: 'Provides systemic stability and process integrity. The grounding node that prevents entropic collapse during scaling.',
                            icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                        },
                        {
                            title: 'Strategic Lubricant',
                            zh: '战略润滑剂',
                            desc: 'Harmonizes relational friction and translates high-level vision into tactical resonance across the collective field.',
                            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        }
                    ].map((role, idx) => (
                        <div key={idx} className="bg-white/2 border border-white/5 p-10 rounded-sm hover:border-gold/30 transition-all duration-500 group">
                            <div className="w-12 h-12 bg-white/5 flex items-center justify-center mb-8 rounded-full group-hover:bg-gold group-hover:text-midnight transition-all duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={role.icon} />
                                </svg>
                            </div>
                            <h4 className="text-slate-100 font-serif text-lg mb-2">{role.title}</h4>
                            <span className="text-[10px] uppercase tracking-widest text-gold/50 mb-6 block">{role.zh}</span>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                {role.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
