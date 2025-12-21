import React from 'react';
import { PrismLens } from '../utils/lensTranslations';

interface LensToggleProps {
    activeLens: PrismLens;
    onLensChange: (lens: PrismLens) => void;
}

export const LENSES: { id: PrismLens; label: string; icon: string; desc: string }[] = [
    {
        id: 'genesis',
        label: 'Genesis',
        icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
        desc: 'The Blueprint // Who You Are'
    },
    {
        id: 'temporal',
        label: 'Temporal',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        desc: 'The Current // When To Act'
    },
    {
        id: 'resonance',
        label: 'Resonance',
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
        desc: 'The Alchemy // How You Love'
    },
];

export const LensToggle: React.FC<LensToggleProps> = ({ activeLens, onLensChange }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto mb-12">
            <h3 className="text-[10px] uppercase tracking-[0.8em] text-gold/60 mb-8 font-bold">Multi-Lens Toggle System</h3>
            <div className="flex w-full bg-midnight-light/50 p-1.5 rounded-full border border-white/5 relative backdrop-blur-md overflow-hidden">
                {/* Fixed Sliding Indicator Pill */}
                <div
                    className="absolute h-[calc(100%-12px)] bg-white/5 border border-white/10 shadow-lg rounded-full transition-all duration-500 ease-in-out pointer-events-none z-0"
                    style={{
                        width: `calc((100% - 12px) / ${LENSES.length})`,
                        left: `calc(6px + ((${LENSES.findIndex(l => l.id === activeLens)} * (100% - 12px)) / ${LENSES.length}))`
                    }}
                />

                {LENSES.map((lens) => {
                    const isActive = activeLens === lens.id;
                    return (
                        <button
                            key={lens.id}
                            onClick={() => onLensChange(lens.id)}
                            className="relative flex-1 flex flex-col items-center justify-center py-4 rounded-full transition-all duration-300 group z-10"
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
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
