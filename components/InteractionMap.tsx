import React from 'react';
import { BaziChart } from '../types';
import { getInternalInteractions } from '../utils/interactions';

interface InteractionMapProps {
    chart: BaziChart;
}

export const InteractionMap: React.FC<InteractionMapProps> = ({ chart }) => {
    // 1. Define Nodes (Pillars)
    const pillars = [
        { id: 'Year', label: 'Year', sub: 'Social', ...chart.yearPillar, x: 100, y: 150 },
        { id: 'Month', label: 'Month', sub: 'Career', ...chart.monthPillar, x: 300, y: 150 },
        { id: 'Day', label: 'Day', sub: 'Self', ...chart.dayPillar, x: 500, y: 150 },
        { id: 'Hour', label: 'Hour', sub: 'Ambition', ...chart.hourPillar, x: 700, y: 150 }
    ];

    // 2. Prepare Data for Interactions
    // Flatten pillars into stem/branch nodes for detailed checking
    const nodes = [
        ...pillars.map(p => ({ ...p, type: 'Stem', val: p.stem.chinese, nodeId: `${p.id}-Stem`, y: 100 })),
        ...pillars.map(p => ({ ...p, type: 'Branch', val: p.branch.chinese, nodeId: `${p.id}-Branch`, y: 200 }))
    ];

    // Get relationships
    const interactions = getInternalInteractions(nodes.map(n => ({ stem: n.type === 'Stem' ? n.val : '', branch: n.type === 'Branch' ? n.val : '', id: n.id })));

    // For specific Node-to-Node visualization, we might need a more granular check or just map pillar-to-pillar lines.
    // Let's keep it simple: Lines between Pillars based on Stem or Branch interaction.
    // We will draw curves.

    const getCurve = (start: { x: number, y: number }, end: { x: number, y: number }, offset: number) => {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2 - offset; // Curvature
        return `M ${start.x},${start.y} Q ${midX},${midY} ${end.x},${end.y}`;
    };

    // Filter valid interactions and map to coordinates
    const links = interactions.map((interaction, i) => {
        // Parse "Year-Stem" vs "Month-Stem" etc from interaction participants?
        // The utils returns simplified interactions. Let's re-run a simple local check or assume utils returns indices/ids if we upgrade it.
        // For now, let's just mock the visualization logic based on pillars for the MVP visual using the utils output as a "List" and visual lines if possible.
        // Actually, let's do a direct calculation here for the visual lines to ensure coordinate accuracy.
        return null; // Placeholder logic until we refine utils for coordinations
    }).filter(Boolean);

    // Re-implement simple specific link finder for visualization
    const visualLinks: any[] = [];

    // Check every pair of pillars
    for (let i = 0; i < pillars.length; i++) {
        for (let j = i + 1; j < pillars.length; j++) {
            const p1 = pillars[i];
            const p2 = pillars[j];

            // Stem Inter
            const stemInt = getInternalInteractions([{ stem: p1.stem.chinese, branch: '', id: p1.id }, { stem: p2.stem.chinese, branch: '', id: p2.id }]);
            if (stemInt.length > 0) {
                visualLinks.push({ start: { x: p1.x, y: 80 }, end: { x: p2.x, y: 80 }, type: stemInt[0].type, label: stemInt[0].label, offset: 60 * (j - i) });
            }

            // Branch Inter
            const branchInt = getInternalInteractions([{ stem: '', branch: p1.branch.chinese, id: p1.id }, { stem: '', branch: p2.branch.chinese, id: p2.id }]);
            if (branchInt.length > 0) {
                visualLinks.push({ start: { x: p1.x, y: 220 }, end: { x: p2.x, y: 220 }, type: branchInt[0].type, label: branchInt[0].label, offset: -60 * (j - i) });
            }
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto overflow-hidden">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-serif text-slate-100 mb-3 tracking-tight">Elemental Interaction Map</h2>
                <p className="text-gold/60 text-[10px] uppercase font-sans tracking-[0.4em]">Resonant Fusion & Systemic Conflict</p>
            </div>

            <div className="relative h-[400px] w-full bg-midnight/30 border border-white/5 rounded-sm select-none">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                        </marker>
                    </defs>

                    {/* Links */}
                    {visualLinks.map((link, i) => (
                        <g key={i} className="group hover:opacity-100 opacity-60 transition-opacity">
                            <path d={getCurve(link.start, link.end, link.offset)}
                                fill="none"
                                stroke={link.type.includes('Clash') ? '#ef4444' : '#C5A059'}
                                strokeWidth="2"
                                strokeDasharray={link.type.includes('Clash') ? '4 4' : '0'}
                                className="drop-shadow-md"
                            />
                            {/* Label on path middle */}
                            <text x={(link.start.x + link.end.x) / 2} y={(link.start.y + link.end.y) / 2 - link.offset / 1.5}
                                textAnchor="middle"
                                className={`text-[10px] uppercase font-bold tracking-widest fill-slate-300 bg-midnight px-2 ${link.type.includes('Clash') ? 'fill-red-400' : 'fill-gold'}`}>
                                {link.label.split(' ')[0]}
                            </text>
                        </g>
                    ))}

                    {/* Concept Line - Center */}
                    <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </svg>

                {/* Nodes (HTML Layer for better text rendering) */}
                <div className="absolute inset-0 pointer-events-none">
                    {pillars.map((p) => (
                        <div key={p.id} className="absolute top-[150px] -translate-y-1/2 -translate-x-1/2 w-24 text-center group pointer-events-auto cursor-pointer" style={{ left: `${(p.x / 800) * 100}%` }}>
                            {/* Stem */}
                            <div className="w-12 h-12 mx-auto mb-4 bg-midnight border border-white/10 rounded-full flex items-center justify-center text-xl font-serif text-slate-200 group-hover:border-gold/50 group-hover:bg-gold/10 transition-all shadow-lg z-10 relative">
                                {p.stem.chinese}
                            </div>

                            {/* Central Axis Label */}
                            <div className="py-2">
                                <div className="text-[10px] uppercase tracking-widest text-gold font-bold">{p.label}</div>
                                <div className="text-[9px] uppercase tracking-widest text-slate-600">{p.sub}</div>
                            </div>

                            {/* Branch */}
                            <div className="w-12 h-12 mx-auto mt-4 bg-midnight border border-white/10 rounded-full flex items-center justify-center text-xl font-serif text-slate-200 group-hover:border-gold/50 group-hover:bg-gold/10 transition-all shadow-lg z-10 relative">
                                {p.branch.chinese}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex justify-center gap-12">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-0.5 bg-gold"></div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Resonant Fusion (Synergy)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-0.5 bg-red-400 border-b border-dashed"></div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Systemic Conflict (Friction)</span>
                </div>
            </div>
        </div>
    );
};
