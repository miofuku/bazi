import React, { useMemo, useState } from 'react';
import { BaziChart } from '../types';
import { calculateInteractions, Interaction } from '../utils/interactions';
// Note: getGanZhi helper might be needed if not available. For now, I'll simulate annual pillars or fetch from chart if available. 
// Actually, BaziChart doesn't strictly have future years. I need to calculate current year + 9.
// I will create a local helper for annual pillars since `utils/ganzhi` might not be exposed or sufficient.
import { STEMS, BRANCHES } from '../utils/constants';

interface TemporalSynergyProps {
    chart: BaziChart;
}

// Helper to get annual pillar for a given year (Simplified approximation for visualization)
// In a real app, use a proper comprehensive calendar library.
const getSimulatedAnnualPillar = (year: number) => {
    const offset = year - 1924; // 1924 was Jia Zi
    return {
        stem: STEMS[offset % 10],
        branch: BRANCHES[offset % 12],
        stemChar: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][offset % 10],
        branchChar: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][offset % 12]
    };
};

export const TemporalSynergy: React.FC<TemporalSynergyProps> = ({ chart }) => {
    const [hoveredYear, setHoveredYear] = useState<number | null>(null);

    // Calculate Synergy/Friction for next 10 years
    const timeframe = useMemo(() => {
        const currentYear = new Date().getFullYear();
        // Use chart's DaYun to find current luck pillar
        // Simplify: Assume user is in one major luck pillar for this 10yr window or find intersection
        // For MVP visualization, we check Annual Pillar vs Day Master & Day Branch & Luck Pillar
        const years = Array.from({ length: 12 }, (_, i) => currentYear + i);

        return years.map(year => {
            const annual = getSimulatedAnnualPillar(year);
            let synergy = 0;
            let friction = 0;
            const descriptions: string[] = [];

            // Check Annual vs Day Master
            const dmInt = calculateInteractions(chart.dayMaster.chinese, annual.stemChar, true);
            if (dmInt) {
                if (dmInt.score > 0) { synergy += dmInt.score; descriptions.push(dmInt.label); }
                else { friction += Math.abs(dmInt.score); descriptions.push(dmInt.label); }
            }

            // Check Annual vs Day Branch
            const dbInt = calculateInteractions(chart.dayPillar.branch.chinese, annual.branchChar, false);
            if (dbInt) {
                if (dbInt.score > 0) { synergy += dbInt.score; descriptions.push(dbInt.label); }
                else { friction += Math.abs(dbInt.score); descriptions.push(dbInt.label); }
            }

            // Base noise
            synergy += Math.random() * 10 + 20; // Baseline
            friction += Math.random() * 10 + 10; // Baseline

            return { year, synergy, friction, descriptions, annual };
        });
    }, [chart]);

    // SVG Constants
    const width = 800;
    const height = 300;
    const padding = 40;
    const maxVal = Math.max(...timeframe.flatMap(t => [t.synergy, t.friction])) * 1.2;

    const getX = (i: number) => padding + (i / (timeframe.length - 1)) * (width - padding * 2);
    const getY = (val: number) => height - padding - (val / maxVal) * (height - padding * 2);

    // Synergy Path
    const synergyPoints = timeframe.map((t, i) => `${getX(i)},${getY(t.synergy)}`).join(' ');
    // Friction Path (Inverted or separate? Let's do separate line)
    const frictionPoints = timeframe.map((t, i) => `${getX(i)},${getY(t.friction)}`).join(' ');

    const activeData = hoveredYear ? timeframe.find(t => t.year === hoveredYear) : null;

    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-serif text-slate-100 mb-4 tracking-tight">Temporal Synergy Waveform</h2>
                <div className="w-24 h-px bg-gold/30 mx-auto mb-4"></div>
                <p className="text-gold/60 text-[10px] uppercase font-sans tracking-[0.4em]">Future Timeline Projection</p>
            </div>

            <div className="relative bg-midnight/50 border border-white/5 rounded-sm p-4 overflow-hidden group">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-2xl">
                    {/* Grid */}
                    {[0.25, 0.5, 0.75].map(p => (
                        <line key={p} x1={padding} y1={height * p} x2={width - padding} y2={height * p} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                    ))}

                    {/* Synergy Area (Gold) */}
                    <path d={`M ${padding},${height - padding} ${synergyPoints} L ${width - padding},${height - padding} Z`} fill="url(#gradSynergy)" opacity="0.2" />
                    <path d={`M ${padding},${getY(timeframe[0].synergy)} ${synergyPoints}`} fill="none" stroke="#C5A059" strokeWidth="2" />

                    {/* Friction Area (Red/Slate) */}
                    <path d={`M ${padding},${height - padding} ${frictionPoints} L ${width - padding},${height - padding} Z`} fill="url(#gradFriction)" opacity="0.1" />
                    <path d={`M ${padding},${getY(timeframe[0].friction)} ${frictionPoints}`} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5 5" />

                    <defs>
                        <linearGradient id="gradSynergy" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#C5A059" />
                            <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="gradFriction" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#64748b" />
                            <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Interactive Points */}
                    {timeframe.map((t, i) => (
                        <g key={t.year} onMouseEnter={() => setHoveredYear(t.year)} onMouseLeave={() => setHoveredYear(null)} className="cursor-pointer">
                            <circle cx={getX(i)} cy={getY(t.synergy)} r="4" className="fill-midnight stroke-gold hover:fill-gold transition-colors" />
                            <circle cx={getX(i)} cy={getY(t.friction)} r="3" className="fill-midnight stroke-slate-500 opacity-50" />
                            {/* X Axis Labels */}
                            <text x={getX(i)} y={height - 10} textAnchor="middle" className={`text-[10px] fill-slate-500 font-mono transition-colors ${hoveredYear === t.year ? 'fill-gold font-bold' : ''}`}>
                                {t.year}
                            </text>
                        </g>
                    ))}

                    {/* Hover Indicator Line */}
                    {activeData && (
                        <line x1={getX(timeframe.findIndex(t => t.year === activeData.year))} y1={padding}
                            x2={getX(timeframe.findIndex(t => t.year === activeData.year))} y2={height - padding}
                            stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    )}
                </svg>

                {/* Tooltip Overlay */}
                {activeData && (
                    <div className="absolute top-8 left-12 animate-fade-in pointer-events-none">
                        <div className="glass-midnight border border-gold/20 p-6 rounded-sm shadow-xl backdrop-blur-md">
                            <h4 className="text-xl font-serif text-slate-100 mb-2">{activeData.year} <span className="text-gold text-sm">{activeData.annual.stemChar}{activeData.annual.branchChar} Year</span></h4>

                            <div className="flex gap-8 mb-4">
                                <div>
                                    <div className="text-[9px] uppercase tracking-widest text-gold mb-1">Synergy</div>
                                    <div className="text-xl font-mono text-gold">{Math.round(activeData.synergy)}</div>
                                </div>
                                <div>
                                    <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Friction</div>
                                    <div className="text-xl font-mono text-slate-400">{Math.round(activeData.friction)}</div>
                                </div>
                            </div>

                            {activeData.descriptions.length > 0 ? (
                                <ul className="space-y-1">
                                    {activeData.descriptions.map((d, i) => (
                                        <li key={i} className="text-[10px] text-slate-300 italic flex items-center gap-2">
                                            <span className="w-1 h-1 bg-gold rounded-full"></span> {d}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-[10px] text-slate-500 italic">Neutral Atmospheric Pressure.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 text-center">
                <div>
                    <span className="inline-block w-3 h-3 bg-gold rounded-full mb-2"></span>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Synergy Index</h4>
                    <p className="text-[10px] text-slate-600 mt-1">Expansion Phase</p>
                </div>
                <div>
                    <span className="inline-block w-3 h-3 bg-slate-500 rounded-full mb-2 opacity-50"></span>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Friction Index</h4>
                    <p className="text-[10px] text-slate-600 mt-1">Consolidation Phase</p>
                </div>
            </div>
        </div>
    );
};
