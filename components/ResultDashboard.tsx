import React from 'react';
import { BaziChart } from '../types';
import { mapChartToStructure } from '../utils/structureMapping';
import { ResultHero } from './ResultHero';
import { ElementBalance } from './ElementBalance';
import { ArchetypeCards } from './ArchetypeCards';
import { LockedContent } from './LockedContent';
import { BaziChartDisplay } from './BaziChartDisplay';
import { SystemPerformance } from './SystemPerformance';

interface ResultDashboardProps {
    chart: BaziChart;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({ chart }) => {
    const structure = mapChartToStructure(chart);

    return (
        <div className="min-h-screen bg-midnight text-slate-200">
            {/* 1. Hero Section (Identity) */}
            <ResultHero chart={chart} structure={structure} />

            {/* 2. Systemic Performance (Metrics) */}
            {chart.systemMetrics && (
                <section className="py-24 px-4 bg-midnight border-b border-white/5">
                    <SystemPerformance metrics={chart.systemMetrics} />
                </section>
            )}

            {/* 3. Infrastructure Layer (DNA/Data) */}
            <section className="py-24 px-4 bg-white/2 backdrop-blur-sm border-b border-white/5">
                <ElementBalance counts={chart.elementCounts} scores={chart.elementScores} dayMaster={chart.dayMaster} />
            </section>

            {/* 4. Personality Blueprint (Validation) */}
            <section className="py-24 border-b border-white/5">
                <ArchetypeCards structure={structure} />
            </section>

            {/* 5. The Cliffhanger (Paywall) */}
            <section className="py-24 bg-gradient-to-b from-midnight to-midnight-light">
                <LockedContent />
            </section>

            {/* 6. Technical Chart View (Optional/Legacy) */}
            <div className="border-t border-white/5 py-32 bg-midnight-light/50">
                <div className="max-w-5xl mx-auto px-4 opacity-40 hover:opacity-100 transition-all duration-700">
                    <h4 className="text-center text-[10px] uppercase font-sans tracking-[0.5em] text-gold/60 mb-12">Technical Chart View</h4>
                    <div className="bg-midnight/40 p-12 rounded-sm border border-white/5">
                        <BaziChartDisplay chart={chart} />
                    </div>
                </div>
            </div>
        </div>
    );
};
