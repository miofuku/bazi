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
        <div className="w-full max-w-4xl mx-auto px-4 mt-12 mb-20">
            <h3 className="text-center font-serif italic text-seal/60 text-lg mb-8">Cognitive Architecture</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Positive Tags */}
                {superpowers.slice(0, 3).map((power, idx) => (
                    <div key={idx} className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-emerald-50 transition-colors cursor-default">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-title text-sm font-bold text-emerald-900 uppercase tracking-wider">{power}</span>
                    </div>
                ))}

                {/* Blind Spot */}
                <div className="bg-stone-50 border border-stone-200 p-6 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-rose-50 hover:border-rose-100 transition-colors cursor-default">
                    <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 group-hover:bg-rose-100 group-hover:text-rose-500 transition-colors flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="font-title text-xs font-bold text-stone-500 group-hover:text-rose-900 uppercase tracking-wider line-clamp-2" title={blindSpot}>
                        {blindSpot}
                    </span>
                    <div className="text-[10px] text-stone-400 font-bold mt-2 uppercase tracking-widest group-hover:text-rose-400">Blind Spot</div>
                </div>
            </div>
        </div>
    );
};
