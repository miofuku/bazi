import React from 'react';
import { PrismLens } from '../utils/lensTranslations';

interface LensToggleProps {
    activeLens: PrismLens;
    onLensChange: (lens: PrismLens) => void;
}

const LENSES: { id: PrismLens; label: string; icon: string; desc: string }[] = [
    {
        id: 'genesis',
        label: 'Genesis',
        icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
        desc: 'The Blueprint'
    },
    {
        id: 'synergy',
        label: 'Synergy',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        desc: 'The Machine'
    },
    {
        id: 'resonance',
        label: 'Resonance',
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        desc: 'The Alchemy'
    },
    {
        id: 'temporal',
        label: 'Temporal',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        desc: 'The Current'
    },
];

export const LensToggle: React.FC<LensToggleProps> = ({ activeLens, onLensChange }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto mb-12">
            <h3 className="text-[9px] uppercase tracking-[0.6em] text-slate-500 mb-6">Multi-Lens Toggle System</h3>
            <div className="flex w-full bg-midnight-light/50 p-1 rounded-full border border-white/5 relative backdrop-blur-md">
                {/* Animated Background Indicator - Simplified for React without heavy animation lib */}
                {/* We use basic conditional classes for indicator simulation */}

                {LENSES.map((lens) => {
                    const isActive = activeLens === lens.id;
                    return (
                        <button
                            key={lens.id}
                            onClick={() => onLensChange(lens.id)}
                            className={`relative flex-1 flex flex-col items-center justify-center py-4 rounded-full transition-all duration-300 group
                                ${isActive ? 'bg-white/5 border border-white/10 shadow-lg' : 'hover:bg-white/2'}
                            `}
                        >
                            <div className={`flex items-center gap-2 mb-1 transition-colors duration-300 ${isActive ? 'text-gold' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={lens.icon} />
                                </svg>
                                <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-slate-100' : ''}`}>{lens.label}</span>
                            </div>
                            <span className={`text-[9px] uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-gold/60' : 'text-slate-600'}`}>
                                {lens.desc}
                            </span>

                            {/* Active Glow/Indicator at bottom */}
                            {isActive && (
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-px bg-gold blur-[2px]"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
