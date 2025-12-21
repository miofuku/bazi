import { BaziChart, SystemMetric, ElementType } from '../types';

export interface FrictionProtocol {
    type: 'team' | 'intimate';
    title: string;
    diagnosis: string;
    actionProtocol: string; // The specific advice (Buffer Zones, etc.)
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

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

    // Scenario A: Control Conflict (Metal/Wood clashes or High Rigor vs Low Rigor)
    // Simulated based on Elements or Metrics.
    // Use Rigor > 75 (Controller) vs hypothetical Partner. 
    if (rigor > 75) {
        protocols.push({
            type: 'intimate',
            title: 'Systemic Oppression Warning',
            severity: 'Medium',
            diagnosis: 'Analysis: Your high "Structural Rigor" tends to format a partner\'s "Free Expansion". You perceive their flow as chaos.',
            actionProtocol: 'Alchemy: "The Missing Element". If you are Metal(Rules) and they are Wood(Growth), introduce Water(Wisdom/Travel) to bridge the gap. Turn "Control" into "Nourishment".'
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

    // Default low-friction protocol if none matched
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
