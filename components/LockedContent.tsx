import React from 'react';

export const LockedContent: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 mt-20 mb-32 relative">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-title text-ink mb-4">Deep Strategy Layer</h2>
                <p className="text-ink/60 font-serif italic">Unlock Macro-Temporal Cycles and Venture Aggression metrics</p>
            </div>

            {/* Locked Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-white/60 backdrop-blur-[6px] rounded-xl border border-white/50 shadow-2xl">
                    <div className="w-16 h-16 bg-ink text-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold font-title text-ink mb-2">Scale Your Infrastructure</h3>
                    <p className="text-ink/60 max-w-sm mb-8">
                        You've mapped the baseline. Now optimize the output. Get detailed Macro-Cycle analysis, systemic wealth capacity, and high-fidelity synergy mapping.
                    </p>
                    <button className="bg-gradient-to-r from-ink to-seal text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform">
                        Unlock Full Report • $19.99
                    </button>
                </div>

                {/* Blurred Mock Content Card 1 */}
                <div className="bg-stone-100 p-8 rounded-xl h-64 flex flex-col items-center justify-center opacity-50 blur-[2px]">
                    <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Macro-Temporal Cycles</div>
                    <div className="text-3xl font-serif text-stone-300">2026 - 2035</div>
                    <div className="w-12 h-1 bg-stone-200 mt-4"></div>
                </div>

                {/* Blurred Mock Content Card 2 */}
                <div className="bg-stone-100 p-8 rounded-xl h-64 flex flex-col items-center justify-center opacity-50 blur-[2px]">
                    <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Resource Scaling Capacity</div>
                    <div className="text-3xl font-serif text-stone-300">Entrepreneurial</div>
                    <div className="w-12 h-1 bg-stone-200 mt-4"></div>
                </div>
                {/* Blurred Mock Content Card 3 */}
                <div className="bg-stone-100 p-8 rounded-xl h-64 flex flex-col items-center justify-center opacity-50 blur-[2px]">
                    <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Relational Synergy Nodes</div>
                    <div className="text-3xl font-serif text-stone-300">Patterns</div>
                    <div className="w-12 h-1 bg-stone-200 mt-4"></div>
                </div>
                {/* Blurred Mock Content Card 4 */}
                <div className="bg-stone-100 p-8 rounded-xl h-64 flex flex-col items-center justify-center opacity-50 blur-[2px]">
                    <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Core Shadow</div>
                    <div className="text-3xl font-serif text-stone-300">Blind Spots</div>
                    <div className="w-12 h-1 bg-stone-200 mt-4"></div>
                </div>
            </div>

            {/* Social Proof Teaser */}
            <div className="mt-12 flex justify-center opacity-60">
                <div className="flex -space-x-2 mr-4">
                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-stone-300 border-2 border-white"></div>)}
                </div>
                <div className="text-xs text-stone-400 flex items-center">
                    Joined by 1,200+ members this week
                </div>
            </div>
        </div>
    );
};
