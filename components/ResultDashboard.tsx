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
        <div className="min-h-screen bg-white">
            {/* 1. Hero Section (Identity) */}
            <ResultHero chart={chart} structure={structure} />

            {/* 2. Systemic Performance (Metrics) */}
            {chart.systemMetrics && (
                <section className="py-20 px-4 bg-stone-50/30 border-y border-ink/5">
                    <SystemPerformance metrics={chart.systemMetrics} />
                </section>
            )}

            {/* 3. Infrastructure Layer (DNA/Data) */}
            <section className="py-20 px-4 bg-white">
                <ElementBalance counts={chart.elementCounts} scores={chart.elementScores} dayMaster={chart.dayMaster} />
            </section>

            {/* 3. Personality Blueprint (Validation) */}
            <section className="py-10 bg-stone-50/50 border-t border-stone-100">
                <ArchetypeCards structure={structure} />
            </section>

            {/* 4. The Cliffhanger (Paywall) */}
            <section className="py-10 bg-gradient-to-b from-white to-stone-50">
                <LockedContent />
            </section>

            {/* 5. Legacy Chart Display (For Verification/Hardcore users - Tucked away at bottom or optional) */}
            <div className="border-t border-stone-200 py-20 bg-stone-100">
                <div className="max-w-5xl mx-auto px-4 opacity-70 hover:opacity-100 transition-opacity">
                    <h4 className="text-center text-xs uppercase tracking-widest text-ink/30 mb-8">Technical Chart View</h4>
                    <BaziChartDisplay chart={chart} />
                </div>
            </div>
        </div>
    );
};
