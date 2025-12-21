import React, { useState } from 'react';
import { BaziChart } from '../types';
import { calculateCoreGenome } from '../utils/roleMapping';
import { calculateIdealPartner } from '../utils/compatibility';
import { analyzeSystemicFriction, FrictionProtocol } from '../utils/conflictProtocols';
import { RELATIONSHIP_LEXICON } from '../utils/constants';
import { ContextualLock } from './ContextualLock';

interface TeamDynamicsProps {
    chart: BaziChart;
}

type ScenarioMode = 'team' | 'intimate';

export const TeamDynamics: React.FC<TeamDynamicsProps> = ({ chart }) => {
    const [mode, setMode] = useState<ScenarioMode>('team');

    // Safety check: existing code might render this without chart initially
    if (!chart || !chart.systemMetrics) return null;

    const genome = calculateCoreGenome(chart, chart.systemMetrics);
    const idealPartner = calculateIdealPartner(chart);
    const frictions = analyzeSystemicFriction(chart, chart.systemMetrics);

    const teamFriction = frictions.find(f => f.type === 'team') || {
        title: 'Nominal State', diagnosis: 'System balanced.', actionProtocol: 'Maintain flow.', severity: 'Low'
    };
    const intimateFriction = frictions.find(f => f.type === 'intimate') || {
        title: 'Nominal State', diagnosis: 'System balanced.', actionProtocol: 'Maintain flow.', severity: 'Low'
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-4 bg-midnight border border-gold/20 rounded-full px-2 py-2 mb-8 relative z-10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(218,165,32,0.2)]">
                    <button
                        onClick={() => setMode('team')}
                        className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${mode === 'team' ? 'bg-gold text-midnight shadow-gold/20 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Team Dynamics
                    </button>
                    <button
                        onClick={() => setMode('intimate')}
                        className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${mode === 'intimate' ? 'bg-pink-500 text-white shadow-pink-500/20 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Intimate Resonance
                    </button>
                </div>

                <h2 className="text-4xl font-serif text-slate-100 mb-4 tracking-tight">
                    {mode === 'team' ? 'Collective Resonance' : 'The Alchemy of Two Systems'}
                </h2>
                <div className={`w-24 h-px mx-auto ${mode === 'team' ? 'bg-gold/30' : 'bg-pink-500/30'}`}></div>
                <p className="mt-8 text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.2em]">
                    {mode === 'team'
                        ? 'Build teams based on energy architecture, not just resumes.'
                        : 'Decipher the hidden operating language of your relationship.'}
                </p>
            </div>

            {/* 1. Core Genome & Perspectives Section */}
            <div className="mb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Genetic Blueprint */}
                <div className="bg-white/2 border border-white/5 p-8 rounded-sm lg:col-span-1">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-4">Genetic Blueprint // 01</div>
                    <div className="mb-6">
                        <div className="text-gold/60 text-[10px] uppercase mb-1">Primary Nature</div>
                        <h3 className="text-xl font-serif text-slate-200 mb-2">{genome.primaryNature.name}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">{genome.primaryNature.description}</p>
                    </div>
                    <div>
                        <div className="text-gold/60 text-[10px] uppercase mb-1">Functional Node</div>
                        <h3 className="text-xl font-serif text-slate-200 mb-2">{genome.functionalNode.name}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">{genome.functionalNode.description}</p>
                    </div>
                </div>

                {/* Perspective Switch */}
                <div className="bg-white/2 border border-white/5 p-8 rounded-sm lg:col-span-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/20 blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-8">The Perspectives // 02</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Job Perspective */}
                        <div className={`transition-opacity duration-500 ${mode === 'team' ? 'opacity-100' : 'opacity-40 blur-[1px]'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/10 rounded-full text-blue-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-slate-400">Work Mode</span>
                            </div>
                            <h3 className="text-2xl font-serif text-slate-100 mb-2">{genome.workPerspective.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-blue-500/30 pl-4">
                                {genome.workPerspective.description}
                            </p>
                        </div>

                        {/* Love Perspective */}
                        <div className={`transition-opacity duration-500 ${mode === 'intimate' ? 'opacity-100' : 'opacity-40 blur-[1px]'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-pink-500/10 rounded-full text-pink-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-slate-400">Love Mode</span>
                            </div>
                            <h3 className="text-2xl font-serif text-slate-100 mb-2">{genome.lovePerspective.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-pink-500/30 pl-4">
                                {genome.lovePerspective.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Scenario Specific Content */}
            {mode === 'team' ? (
                // TEAM SCENARIO (Updated with Conflict Protocols)
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                    {/* Role Card */}
                    <div className="glass-midnight border-gold/10 p-12 rounded-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors"></div>
                        <h3 className="text-[10px] uppercase tracking-[0.5em] text-gold mb-8 font-bold">Your System Role</h3>

                        <div className="flex items-start gap-6 mb-8">
                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={genome.teamRole.icon} />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-3xl font-serif text-slate-100 mb-1">{genome.teamRole.title}</h4>
                                <span className="text-[10px] uppercase tracking-widest text-gold/60 block mb-4">{genome.teamRole.chinese}</span>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                    {genome.teamRole.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Synergy Logic - Dynamic Procotols (LOCKED TIER 3) */}
                    <div className="flex flex-col justify-center p-6 space-y-8">
                        <ContextualLock
                            message="High-Entropy Collision Detected. This system has identified critical friction points."
                            buttonText="Decrypt Mitigation Strategy"
                            isBlurred={true} // Hardcoded for demo
                        >
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-slate-200 font-bold text-sm uppercase tracking-widest">Protocol Identified</span>
                                    <span className={`text-[10px] uppercase font-bold text-${teamFriction.severity === 'Critical' ? 'red-500' : 'gold'}`}>
                                        Severity: {teamFriction.severity}
                                    </span>
                                </div>
                                <div className="p-6 bg-white/2 border border-white/10 rounded-sm relative overflow-hidden">
                                    {teamFriction.severity === 'High' || teamFriction.severity === 'Critical' ? (
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                    ) : null}
                                    <h4 className="text-slate-100 font-serif mb-2">{teamFriction.title}</h4>
                                    <p className="text-xs text-slate-400 font-mono mb-4 border-b border-white/5 pb-4">
                                        {teamFriction.diagnosis}
                                    </p>
                                    <p className="text-sm text-gold/80 italic">
                                        {teamFriction.actionProtocol}
                                    </p>
                                </div>
                            </div>
                        </ContextualLock>
                    </div>
                </div>
            ) : (
                // INTIMATE SCENARIO (Updated with Protocols)
                <div>
                    {/* Resonance Matrix / Ideal Partner Profiler (LOCKED TIER 3) */}
                    <ContextualLock
                        message="Resonance Core Encrypted. Decode the hidden operating language of this union."
                        buttonText="Unlock Alchemical Analysis"
                        title="Resonance Matrix"
                        isBlurred={true}
                    >
                        <div className="glass-midnight border-pink-500/20 p-8 md:p-12 rounded-sm relative overflow-hidden mb-16">
                            <div className="absolute -left-10 -bottom-10 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-end mb-12">
                                    <div>
                                        <h3 className="text-[10px] uppercase tracking-[0.5em] text-pink-400 mb-2 font-bold">Resonance Scoring Matrix</h3>
                                        <h4 className="text-2xl font-serif text-slate-100">The Alchemical Union Target</h4>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <div className="text-4xl font-mono text-pink-500/80">{idealPartner.totalScore}%</div>
                                        <div className="text-[9px] uppercase tracking-widest text-slate-500">Match Potential</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                    {/* 1. Core Resonance */}
                                    <div className="border-l border-pink-500/20 pl-6">
                                        <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">01 Core Resonance</div>
                                        <div className="text-lg font-serif text-pink-200 mb-1">{idealPartner.coreResonance.targetDayMaster}</div>
                                        <div className="text-[10px] bg-pink-500/10 text-pink-300 inline-block px-2 py-0.5 rounded mb-3">{idealPartner.coreResonance.relationType}</div>
                                        <p className="text-xs text-slate-400 leading-relaxed">{idealPartner.coreResonance.description}</p>
                                    </div>
                                    {/* 2. Functional Comp */}
                                    <div className="border-l border-pink-500/20 pl-6">
                                        <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">02 Complementarity</div>
                                        <div className="text-lg font-serif text-pink-200 mb-1">{idealPartner.functionalComplementarity.missingArchetype}</div>
                                        <p className="text-xs text-slate-400 leading-relaxed mt-2">{idealPartner.functionalComplementarity.why}</p>
                                    </div>
                                    {/* 3. Elemental Healing */}
                                    <div className="border-l border-pink-500/20 pl-6">
                                        <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">03 Systemic Healing</div>
                                        <div className="text-lg font-serif text-pink-200 mb-1">High {idealPartner.elementalRebalancing.targetElement}</div>
                                        <p className="text-xs text-slate-400 leading-relaxed mt-2">{idealPartner.elementalRebalancing.benefit}</p>
                                    </div>
                                    {/* 4. Temporal Sync */}
                                    <div className="border-l border-pink-500/20 pl-6">
                                        <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">04 Temporal Sync</div>
                                        <div className="text-lg font-serif text-pink-200 mb-1">{idealPartner.temporalSync.currentPhase}</div>
                                        <p className="text-xs text-slate-400 leading-relaxed mt-2">{idealPartner.temporalSync.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ContextualLock>

                    <h3 className="text-center text-[10px] uppercase tracking-[0.6em] text-pink-500/40 mb-12 font-bold">The Alchemy of Friction</h3>

                    {/* Synergy Protocol Cards - Dynamic (LOCKED TIER 3) */}
                    <ContextualLock
                        message="Systemic Friction Analysis Encrypted."
                        buttonText="Decrypt Friction Protocols"
                        isBlurred={true}
                    >
                        <div className="grid grid-cols-1 mb-16">
                            <div className="bg-white/2 border border-white/5 p-8 rounded-sm hover:border-pink-500/20 transition-colors group relative overflow-hidden">
                                {intimateFriction.severity === 'High' && <div className="absolute top-0 right-0 p-2 bg-red-500/20 text-red-300 text-[10px] font-bold uppercase">High Friction Alert</div>}
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-slate-100 font-serif">{intimateFriction.title}</h4>
                                    <span className="text-pink-400 text-xs">▲</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed font-mono mb-4">
                                    {intimateFriction.diagnosis}
                                </p>
                                <p className="text-pink-200 text-sm leading-relaxed italic border-l-2 border-pink-500/50 pl-4">
                                    {intimateFriction.actionProtocol}
                                </p>
                            </div>
                        </div>
                    </ContextualLock>
                </div>
            )}
        </div>
    );
};
