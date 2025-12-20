import React from 'react';
import { BaziChart } from '../types';
import { mapChartToStructure } from '../utils/structureMapping';
import { ResultHero } from './ResultHero';
import { ElementBalance } from './ElementBalance';
import { ArchetypeCards } from './ArchetypeCards';
import { LockedContent } from './LockedContent';
import { GenesisCode } from './BaziChartDisplay';
import { SystemPerformance } from './SystemPerformance';
import { TemporalSynergy } from './TemporalSynergy';
import { TeamDynamics } from './TeamDynamics';
import { InteractionMap } from './InteractionMap';

interface ResultDashboardProps {
    chart: BaziChart;
}

import { generateSynergyOptimization } from '../utils/systemMetrics';

export const ResultDashboard: React.FC<ResultDashboardProps> = ({ chart }) => {
    const structure = mapChartToStructure(chart);
    const synergyAdvice = chart.systemMetrics ? generateSynergyOptimization(chart.systemMetrics) : null;

    return (
        <div className="min-h-screen bg-midnight text-slate-200">
            {/* 1. Hero Section (Identity) */}
            <ResultHero chart={chart} structure={structure} />

            {/* 2. The Genesis Code (Geometry) */}
            <section className="py-24 px-4 bg-midnight border-b border-white/5 overflow-hidden">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-slate-100 mb-3 tracking-tight">The Genesis Code</h2>
                    <p className="text-gold/60 text-[10px] uppercase font-sans tracking-[0.4em]">创世代码</p>
                </div>
                <GenesisCode chart={chart} />
            </section>

            {/* 3. The 6 Dimensions of Inner Force (Systemic Metrics) */}
            {chart.systemMetrics && (
                <section className="py-32 px-4 bg-white/2 backdrop-blur-sm border-b border-white/5">
                    <SystemPerformance metrics={chart.systemMetrics} />

                    {/* NEW: Synergy Optimization Actionable Intel */}
                    {synergyAdvice && (
                        <div className="max-w-4xl mx-auto mt-24">
                            <div className="bg-midnight border border-gold/20 p-8 rounded-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gold/50"></div>
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center border border-gold/40">
                                            <span className="text-xl">⚡</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">System Synergy Optimization</h4>
                                        <p className="font-mono text-sm text-slate-300 leading-relaxed">
                                            <span className="text-gold/60 mr-2">{'>'}</span>
                                            {synergyAdvice}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* 4. Temporal Synergy (Navigation) */}
            <section className="py-32 px-4 bg-midnight border-b border-white/5">
                <TemporalSynergy chart={chart} />
            </section>

            {/* 5. Team Dynamics & Synergy (Collective) */}
            <section className="py-32 px-4 bg-white/2 backdrop-blur-sm border-b border-white/5">
                <TeamDynamics chart={chart} />
            </section>

            {/* 6. Infrastructure Layer (DNA/Data) */}
            <section className="py-24 px-4 bg-midnight border-b border-white/5">
                <ElementBalance counts={chart.elementCounts} scores={chart.elementScores} dayMaster={chart.dayMaster} />
            </section>

            {/* 6. Personality Blueprint (Validation) */}
            <section className="py-24 border-b border-white/5">
                <ArchetypeCards structure={structure} />
            </section>

            {/* 7. Elemental Interaction Map (Network) */}
            <section className="py-24 px-4 bg-midnight border-b border-white/5">
                <InteractionMap chart={chart} />
            </section>

            {/* 8. The Cliffhanger (Paywall) */}
            <section className="py-32 bg-gradient-to-b from-midnight to-midnight-light">
                <LockedContent />
            </section>


        </div>
    );
};
