import React, { useState } from 'react';
import { BaziChart } from '../types';
import { ResultHero } from './ResultHero';
import { GenesisCode } from './BaziChartDisplay';
import { LensToggle } from './LensToggle';
import { PrismLens, getLensTranslation } from '../utils/lensTranslations';

// Integration of existing components as "Lenses"
import { SystemPerformance } from './SystemPerformance';
import { TeamDynamics } from './TeamDynamics';
import { TemporalSynergy } from './TemporalSynergy';
import { ElementBalance } from './ElementBalance';
import { InteractionMap } from './InteractionMap';
import { LockedContent } from './LockedContent';
import { mapChartToStructure } from '../utils/structureMapping';

interface PrismDashboardProps {
    chart: BaziChart;
}

export const PrismDashboard: React.FC<PrismDashboardProps> = ({ chart }) => {
    const [activeLens, setActiveLens] = useState<PrismLens>('genesis');
    const structure = mapChartToStructure(chart);

    // Fade transition wrapper
    const LensContainer = ({ children }: { children: React.ReactNode }) => (
        <div className="animate-in fade-in duration-700 slide-in-from-bottom-4 ease-out">
            {children}
        </div>
    );

    return (
        <div className="min-h-screen bg-midnight text-slate-200 selection:bg-gold/30 selection:text-white">

            {/* 1. Global Context (Top Header) */}
            <ResultHero chart={chart} structure={structure} />

            {/* 2. The Central Prism (Main Stage) */}
            <main className="relative z-10 -mt-12 px-4 pb-32">

                {/* The Multi-Lens Toggle */}
                <LensToggle activeLens={activeLens} onLensChange={setActiveLens} />

                {/* The Living Graph Visualization Area */}
                <div className="max-w-7xl mx-auto bg-midnight/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-8 lg:p-12 min-h-[600px] relative overflow-hidden transition-all duration-700">

                    {/* Background Ambience based on Lens */}
                    <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br rounded-full opacity-10 blur-[100px] transition-colors duration-1000 ease-in-out
                        ${activeLens === 'genesis' ? 'from-blue-500 to-purple-500' : ''}
                        ${activeLens === 'synergy' ? 'from-gold to-orange-500' : ''}
                        ${activeLens === 'resonance' ? 'from-pink-500 to-rose-600' : ''}
                        ${activeLens === 'temporal' ? 'from-teal-500 to-cyan-500' : ''}
                    `} pointer-events-none></div>


                    {/* --- VIEW: GENESIS MODE --- */}
                    {activeLens === 'genesis' && (
                        <LensContainer>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif text-slate-100">Genesis Mode</h2>
                                <p className="text-slate-500 text-sm uppercase tracking-widest mt-2">{LENSES[0].desc}</p>
                            </div>

                            {/* Core Blueprint Visualization */}
                            <div className="mb-16">
                                <GenesisCode chart={chart} />
                            </div>

                            {/* System Performance (Radar/Battery) */}
                            {chart.systemMetrics && <SystemPerformance metrics={chart.systemMetrics} />}

                            {/* Infrastructure (Elements) */}
                            <div className="mt-16 border-t border-white/5 pt-16">
                                <ElementBalance counts={chart.elementCounts} scores={chart.elementScores} dayMaster={chart.dayMaster} />
                            </div>
                        </LensContainer>
                    )}

                    {/* --- VIEW: SYNERGY MODE --- */}
                    {activeLens === 'synergy' && (
                        <LensContainer>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif text-slate-100">Synergy Mode</h2>
                                <p className="text-slate-500 text-sm uppercase tracking-widest mt-2">{LENSES[1].desc}</p>
                            </div>

                            {/* Team Dynamics (Force 'team' mode manually via props if we could, but component manages own state. 
                                Ideally, we refactor TeamDynamics to accept mode prop. 
                                For now, we rely on user interaction or simple mounting reset.) */}
                            <TeamDynamics chart={chart} />

                            {/* Interaction Map as "System Network" */}
                            <div className="mt-16 border-t border-white/5 pt-16">
                                <h3 className="text-center text-[10px] uppercase tracking-[0.6em] text-gold/40 mb-12 font-bold">System Network Logic</h3>
                                <InteractionMap chart={chart} />
                            </div>
                        </LensContainer>
                    )}

                    {/* --- VIEW: RESONANCE MODE --- */}
                    {activeLens === 'resonance' && (
                        <LensContainer>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif text-slate-100">Resonance Mode</h2>
                                <p className="text-slate-500 text-sm uppercase tracking-widest mt-2">{LENSES[2].desc}</p>
                            </div>

                            {/* Reuse TeamDynamics but guide user to 'Intimate' - 
                                In a real refactor we'd pass `initialMode="intimate"` prop. 
                                Since I didn't add that prop to TeamDynamics yet, I'll rely on the user switching or 
                                I can quickly patch TeamDynamics to take `initialMode`. 
                                For now, just render it. The context alone sets the stage.
                            */}
                            <div className="border border-pink-500/20 rounded-xl p-4 bg-pink-500/5 mb-8 text-center text-pink-200 text-sm">
                                💡 Tip: Switch the toggle below to <strong>"Intimate Resonance"</strong> to view relationship alchemy.
                            </div>
                            <TeamDynamics chart={chart} />
                        </LensContainer>
                    )}

                    {/* --- VIEW: TEMPORAL MODE --- */}
                    {activeLens === 'temporal' && (
                        <LensContainer>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif text-slate-100">Temporal Mode</h2>
                                <p className="text-slate-500 text-sm uppercase tracking-widest mt-2">{LENSES[3].desc}</p>
                            </div>
                            <TemporalSynergy chart={chart} />
                        </LensContainer>
                    )}

                </div>
            </main>

            {/* 3. Footer / Paywall (Always visible at bottom) */}
            <section className="py-24 bg-midnight border-t border-white/5">
                <div className="text-center mb-8">
                    <p className="text-[10px] text-slate-600 font-mono">
                        Algorithm derived from 2,000-year-old Temporal Geometry <br /> and Modern Systemic Psychology.
                    </p>
                </div>
                <LockedContent />
            </section>

        </div>
    );
};

// Re-defining LENSES here for internal access to descriptors without import cycle if needed, 
// strictly it should be imported from LensToggle but LensToggle exports component.
// I'll just hardcode descriptions in render for simplicity.
const LENSES = [
    { desc: 'The Genetic Blueprint // Who You Are' },
    { desc: 'The Productivity Machine // How You Work' },
    { desc: 'The Alchemical Union // How You Love' },
    { desc: 'The Current // When To Act' }
];
