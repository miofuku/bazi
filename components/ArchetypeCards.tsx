import React from 'react';
import { StructureResult } from '../utils/structures';

interface ArchetypeCardsProps {
    structure: StructureResult;
}

export const ArchetypeCards: React.FC<ArchetypeCardsProps> = ({ structure }) => {
    const { archetype } = structure;

    // Extract keywords based on the profile or hardcode some logic if keywords aren't explicit in StructureResult
    // The user requested 3 positive tags + 1 blind spot.
    // Currently StructureResult has 'superpower' and 'profile'. 
    // We can parse 'superpower' string into tags or just display superpower parts.
    const superpowers = archetype.superpower.split(',').map(s => s.trim());
    const blindSpot = archetype.blindSpot;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 mt-20 mb-24">
            <h3 className="text-center font-serif italic text-gold/60 text-lg mb-12">Cognitive Architecture</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {/* Positive Tags */}
                {superpowers.slice(0, 3).map((power, idx) => (
                    <div key={idx} className="glass-midnight border-white/5 p-8 rounded-sm flex flex-col items-center justify-center text-center group hover:border-gold/30 hover:bg-gold/5 transition-all duration-500 cursor-default">
                        <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-serif text-sm font-bold text-slate-100 uppercase tracking-[0.2em]">{power}</span>
                    </div>
                ))}

                {/* Blind Spot */}
                <div className="bg-white/2 border border-white/5 p-8 rounded-sm flex flex-col items-center justify-center text-center group hover:bg-white/5 hover:border-gold/20 transition-all duration-500 cursor-default">
                    <div className="w-10 h-10 rounded-full bg-white/5 text-slate-500 group-hover:bg-gold/10 group-hover:text-gold transition-all duration-500 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="font-serif text-xs font-bold text-slate-400 group-hover:text-slate-100 uppercase tracking-[0.1em] line-clamp-2 transition-colors" title={blindSpot}>
                        {blindSpot}
                    </span>
                    <div className="text-[10px] text-slate-600 font-bold mt-3 uppercase tracking-[0.3em] group-hover:text-gold/60 transition-colors italic">Blind Spot</div>
                </div>
            </div>
        </div>
    );
};
