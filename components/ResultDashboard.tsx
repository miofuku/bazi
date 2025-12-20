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

export const ResultDashboard: React.FC<ResultDashboardProps> = ({ chart }) => {
    const structure = mapChartToStructure(chart);

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
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-serif text-slate-100 mb-3 tracking-tight">The 6 Dimensions of Inner Force</h2>
                        <p className="text-gold/60 text-[10px] uppercase font-sans tracking-[0.4em]">核心系统参数</p>
                    </div>
                    <SystemPerformance metrics={chart.systemMetrics} />
                </section>
            )}

            {/* 4. Temporal Synergy (Navigation) */}
            <section className="py-32 px-4 bg-midnight border-b border-white/5">
                <TemporalSynergy chart={chart} />
            </section>

            {/* 5. Team Dynamics & Synergy (Collective) */}
            <section className="py-32 px-4 bg-white/2 backdrop-blur-sm border-b border-white/5">
                <TeamDynamics />
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
