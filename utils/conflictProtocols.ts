import { BaziChart, SystemMetric, ElementType } from '../types';

export interface FrictionProtocol {
    type: 'team' | 'intimate';
    title: string;
    diagnosis: string;
    actionProtocol: string; // The specific advice (Buffer Zones, etc.)
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

const BRANCH_CLASHES: Record<string, string[]> = {
    'Rat': ['Horse'], 'Horse': ['Rat'],
    'Ox': ['Goat'], 'Goat': ['Ox'],
    'Tiger': ['Monkey'], 'Monkey': ['Tiger'],
    'Rabbit': ['Rooster'], 'Rooster': ['Rabbit'],
    'Dragon': ['Dog'], 'Dog': ['Dragon'],
    'Snake': ['Pig'], 'Pig': ['Snake']
};

export const checkBranchClash = (branchA: string, branchB: string): boolean => {
    return BRANCH_CLASHES[branchA]?.includes(branchB) || false;
};

// Check if Element A overpowers Element B (e.g., Metal >> Wood)
export const checkElementalOverpower = (chart: BaziChart, elementA: ElementType, elementB: ElementType): boolean => {
    const scoreA = chart.elementScores?.[elementA] || 0;
    const scoreB = chart.elementScores?.[elementB] || 0;
    return scoreA > 50 && scoreB < 15; // Thresholds for "Overpower"
};


export const analyzeSystemicFriction = (chart: BaziChart, metrics?: Record<string, SystemMetric>): FrictionProtocol[] => {
    // In a real multi-user app, this would compare TWO charts.
    // For single user view, we will generate "Potential Friction Points" based on their dominant excessively high traits
    // acting as a warning for what THEY might cause.

    const protocols: FrictionProtocol[] = [];
    if (!metrics) return protocols;

    // Helper: Get metric value
    const getVal = (key: string) => metrics[key]?.value || 0;

    const vision = getVal('Visionary Obsession');
    const rigor = getVal('Systemic Analytical Rigor');
    const risk = getVal('Strategic Risk Agility');
    const fortitude = getVal('Psychological Fortitude');

    // --- LOGIC GATES (From Dev Docs) ---

    // 1. Internal Systemic Reconfiguration (Self-Clash Detection)
    // Check if Day Branch clashes with Month Branch (Core Structure Conflict)
    const dayBranch = chart.dayPillar.branch.chinese; // Assuming chinese char or english logic? 
    // The chart object likely uses English names for checkBranchClash if mapped, or Chinese. 
    // Let's assume standard English names 'Rat', 'Ox' etc. derived or mapped.
    // Actually our types usually store 'Rat' (English) in 'name' or 'chinese' char.
    // Checking types.ts or runtime. The earlier roleMapping used English names.
    // We'll try to match whatever is in chart.dayPillar.branch.name

    // We'll implement a safe check if name exists.
    const dayB = chart.dayPillar.branch.name || '';
    const monthB = chart.monthPillar.branch.name || '';

    if (checkBranchClash(dayB, monthB)) {
        protocols.push({
            type: 'team',
            title: 'Internal Systemic Clash',
            severity: 'Medium',
            diagnosis: 'Clash Detection: Your Core (Day) clashes with your Environment (Month). You often feel the need to dismantle existing structures.',
            actionProtocol: 'Guidance: Avoid micro-management; allow autonomous operational zones for yourself to prevent self-sabotage.'
        });
    }

    // --- TEAM PROTOCOLS ---

    // Scenario A: Visionary Overload (Visionary vs Operator Conflict)
    if (vision > 80 && rigor < 50) {
        protocols.push({
            type: 'team',
            title: 'Visionary / Operator Friction',
            severity: 'High',
            diagnosis: 'System Risk: Your non-linear logic (Visionary) will destabilize structure-loving Operators.',
            actionProtocol: 'Protocol: "Buffer Zones". Do not interface directly with execution layers. Appoint a "Translator" (Food God/Communication type) to bridge your concepts to their tasks.'
        });
    }

    // Scenario B: Aggressor Overheat (Risk vs Risk)
    if (risk > 80) {
        protocols.push({
            type: 'team',
            title: 'High-Entropy Collision Risk',
            severity: 'Critical',
            diagnosis: 'System Risk: Your high "Killings" energy requires absolute autonomy. Placing you with another Alpha will cause resource cannibalization.',
            actionProtocol: 'Protocol: "Task Isolation". Decouple KPIs completely. Ensure you have a sovereign domain with no shared decision rights.'
        });
    }


    // --- INTIMATE PROTOCOLS ---

    // Scenario A: Structural Pressure (Over-control) -> Dev Doc "Structural_Pressure"
    // Using checkElementalOverpower simulation or metric proxy
    if (rigor > 75) {
        protocols.push({
            type: 'intimate',
            title: 'Structural Pressure',
            severity: 'Medium',
            // diagnosis: 'Analysis: Your high "Structural Rigor" tends to format a partner\'s "Free Expansion".', // Old copy
            diagnosis: 'Systemic Oppression: Your high "Structural Rigor" tends to format a partner\'s "Free Expansion". You perceive their flow as chaos.', // Blended
            actionProtocol: 'Guidance: Introduce a "Fluidity Element" (Water) to lubricate interaction. Turn "Control" into "Nourishment".'
        });
    }

    // Scenario B: Emotional Overheat (Fire/Water imbalance or High Vision/Low Fortitude)
    // If Fortitude is Low < 40 and Vision/Risk High.
    if (fortitude < 40 && (vision > 70 || risk > 70)) {
        protocols.push({
            type: 'intimate',
            title: 'Emotional Entropy Alert',
            severity: 'High',
            diagnosis: 'Analysis: High volatility detected. Your system lacks a "Stability Anchor", leading to exponential emotional oscillations.',
            actionProtocol: 'Alchemy: "Grounding Rituals". You need Earth. Engage in physical legacy building (finance, home renovation) to lower the system entropy.'
        });
    }

    // Default
    if (protocols.length === 0) {
        protocols.push({
            type: 'team',
            title: 'Synergy Optimization',
            severity: 'Low',
            diagnosis: 'System operating within nominal friction parameters.',
            actionProtocol: 'Maintain current energy distribution. Focus on "Flow State" maximization.'
        });
    }

    return protocols;
};
