import React, { useState } from 'react';
import { BaziChart } from '../types';
import { ResultHero } from './ResultHero';
import { GenesisCode } from './BaziChartDisplay';
import { LensToggle, LENSES } from './LensToggle';
import { PrismLens, getLensTranslation } from '../utils/lensTranslations';
import { useMemo } from 'react';

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
    const structure = useMemo(() => mapChartToStructure(chart), [chart]);

    // Fade transition wrapper
    const LensContainer = ({ children }: { children: React.ReactNode }) => (
        <div className="animate-in fade-in duration-700 slide-in-from-bottom-4 ease-out">
            {children}
        </div>
    );

    return (
        <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-midnight text-slate-200 selection:bg-gold/30 selection:text-white no-scrollbar">

            {/* 1. Global Context (Top Header) - FULL PAGE SECTION */}
            <section className="h-screen w-full snap-start shrink-0">
                <ResultHero chart={chart} structure={structure} />
            </section>

            {/* 2. The Central Prism (Main Stage) - SECOND PAGE SECTION */}
            <section id="dashboard-main" className="snap-start min-h-screen relative z-10 px-4 pb-32 pt-20">

                {/* The Multi-Lens Toggle */}
                <LensToggle activeLens={activeLens} onLensChange={setActiveLens} />

                {/* The Living Graph Visualization Area */}
                <div className="max-w-7xl mx-auto bg-midnight/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl p-8 lg:p-12 min-h-[600px] relative overflow-hidden transition-all duration-700">

                    {/* Background Ambience based on Lens */}
                    <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br rounded-full opacity-10 blur-[100px] transition-colors duration-1000 ease-in-out
                        ${activeLens === 'genesis' ? 'from-blue-500 to-purple-500' : ''}
                        ${activeLens === 'resonance' ? 'from-pink-500 to-rose-600' : ''}
                        ${activeLens === 'temporal' ? 'from-teal-500 to-cyan-500' : ''}
                    `} pointer-events-none></div>


                    {/* --- VIEW: GENESIS MODE --- */}
                    {activeLens === 'genesis' && (
                        <LensContainer>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif text-slate-100">Genesis Mode</h2>
                                <p className="text-slate-500 text-sm uppercase tracking-widest mt-2">{LENSES.find(l => l.id === 'genesis')?.desc}</p>
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


                    {/* --- VIEW: RESONANCE MODE --- */}
                    {activeLens === 'resonance' && (
                        <LensContainer>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif text-slate-100">Resonance Mode</h2>
                                <p className="text-slate-500 text-sm uppercase tracking-widest mt-2">{LENSES.find(l => l.id === 'resonance')?.desc}</p>
                            </div>

                            <TeamDynamics chart={chart} />
                        </LensContainer>
                    )}

                    {/* --- VIEW: TEMPORAL MODE --- */}
                    {activeLens === 'temporal' && (
                        <LensContainer>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif text-slate-100">Temporal Mode</h2>
                                <p className="text-slate-500 text-sm uppercase tracking-widest mt-2">{LENSES.find(l => l.id === 'temporal')?.desc}</p>
                            </div>
                            <TemporalSynergy chart={chart} />
                        </LensContainer>
                    )}

                </div>
            </section>

            {/* 3. Footer / Paywall (Exit State) - THIRD PAGE SECTION */}
            <section className="h-screen w-full snap-start flex flex-col justify-center items-center bg-midnight border-t border-white/5 px-4">
                <div className="text-center mb-12">
                    <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                        Protocol: Genesis Code Decryption Active
                    </p>
                </div>
                <div className="w-full max-w-4xl">
                    <LockedContent />
                </div>
                <div className="mt-16 text-center">
                    <p className="text-[9px] text-slate-700 font-mono italic">
                        Algorithm derived from 2,000-year-old Temporal Geometry and Modern Systemic Psychology.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default PrismDashboard;
