import { BaziChart, SystemMetric, ElementType } from '../types';
import { calculateDeity } from './baziCalculator';

// Helper to determine status and dynamic text based on score
const getDynamicContent = (score: number, dimension: string, chart: BaziChart) => {
    let status = "";
    let description = "";
    let insight = "";

    if (dimension === 'Cognitive Exploration Index') {
        const egEnergy = getDeityEnergyStrength(chart, 'Eating God');
        const hoEnergy = getDeityEnergyStrength(chart, 'Hurting Officer');
        const irEnergy = getDeityEnergyStrength(chart, 'Indirect Resource');

        // Intensity Logic for Eating God (Natural Alchemist)
        if (egEnergy > hoEnergy) {
            const isCompromised = irEnergy > egEnergy * 1.5; // Optimized for "Xiao Shen Duo Shi"

            if (isCompromised) {
                status = "Internal Blockage / Logic Suppression";
                description = "Your 'Natural Alchemist' (Eating God) engine is currently experiencing a system override by Abstract Logic (Indirect Resource). This 'Internal Blockage' prevents smooth creative flow.";
                insight = "System Protocol: Use 'Structured Writing' or linear logic to force-clear the creative bottleneck.";
            } else if (score >= 70) {
                status = "The Prolific Alchemist / Gourmet of Ideas";
                description = "You possess high-bandwidth Intellectual Fluidity. Your core is wired for 'Organic Evolution'—growing and refining data without depleting reserves.";
                insight = "High-Entropy Warning: Beware of 'Perfecting to Stagnation.' Deploy your output before it reaches absolute zero.";
            } else {
                status = "The Hidden Catalyst / Latent Creativity";
                description = "Your alchemical engine operates in a 'Low-Current' mode. You have deep qualitative potential that is currently internal or reserved.";
                insight = "Strategy: Activate your expression modules through 'Deliberate Iteration' sessions.";
            }
        } else {
            // Hurting Officer (The Disruptive Innovator)
            if (score >= 70) {
                status = "The Explosive Disruptor / Iconoclastic";
                description = "Your system thrives on Structural Defiance. You possess a hyper-active Disruptive Innovator node, designed to identify and exploit cracks in existing hierarchies.";
                insight = "High-Entropy Warning: Guard against 'Disruption for Disruption\'s Sake'—ensure your output remains constructive.";
            } else {
                status = "The Measured Rebel / Latent Brilliance";
                description = "Your disruptive energy is controlled and strategic. You identify unconventional paths but prioritize systemic stability until the point of breakthrough.";
                insight = "Strategy: Select high-leverage specific domains for deep breakthrough rather than general resistance.";
            }
        }
    } else if (score >= 70) {
        status = "High Output / High Entropy"; // Default high status
        if (dimension === 'Visionary Obsession') {
            status = "The Mystic Strategist / Pattern Master";
            description = "Driven by a strong Transcendental Visionary (Indirect Resource) archetype, your mind operates beyond the visible spectrum. You decode 'Esoteric Logic' that others overlook.";
            insight = "Visionary Warning: Avoid 'Mental Seclusion.' Ensure your deep-link insights are anchored to observable data for your team.";
        } else if (dimension === 'Psychological Fortitude') {
            status = "Structural Integrity / High Pressure";
            description = "Your Grounding Matrix (Earth) provides significant structural integrity. You have a high threshold for 'Social Friction' and 'Market Turbulence.' You don't break under pressure; you crystallize.";
            insight = "Use this resilience to stabilize your team during 'Funding Winters.'";
        } else if (dimension === 'Systemic Analytical Rigor') {
            status = "Foundational / Logic-Driven";
            description = "Your system relies on Foundational Logic (Direct Resource). You are not satisfied with surface-level metrics; you demand to understand the 'First Principles' of your technology stack and business model.";
            insight = "This rigor ensures product-market fit but may slow down initial speed-to-market.";
        } else if (dimension === 'Strategic Risk Agility') {
            status = "The SUPREME Commando / Implacable";
            description = "You carry the Strategic Aggressor (Seven Killings) signature. You possess an innate 'Crisis Instinct,' allowing you to remain hyper-focused when external environments collapse.";
            insight = "Surgical Warning: Beware of 'Defense Fatigue.' Prolonged hyper-vigilance can lead to systemic exhaustion.";
        } else if (dimension === 'Relational Resonance') {
            status = "High Impact / Sharp Edge";
            description = "Your Peer Resonance (Friend/Rob Wealth) is intense and singular. You don't 'manage' people; you 'polarize' them into believers or skeptics. Your communication is a high-frequency vibration that demands alignment.";
            insight = "Complement your intensity with an 'Operator' who can handle the harmonic lubrication of the team.";
        }
    } else {
        // Lower score variants (simplified for now, using a general fallback or 'Latent' status)
        status = "Latent / Developing";
        if (dimension === 'Visionary Obsession') {
            status = "Intuitive Observer / Quiet Decoder";
            description = "Your strength lies in tactical execution and reading the immediate landscape rather than distant pattern deciphering.";
            insight = "Pair with a visionary strategist to calibrate your deep-link intuition with long-range signals.";
        } else if (dimension === 'Psychological Fortitude') {
            status = "Adaptive / Fluid";
            description = "Your system is flexible rather than rigid. You adapt to market changes by flowing around obstacles rather than withstanding direct pressure.";
            insight = "Building structural buffers (cash flow, legal contracts) is critical for your peace of mind.";
        } else if (dimension === 'Systemic Analytical Rigor') {
            description = "You prioritize speed and intuition over deep structural analysis. You build the plane while flying it.";
            insight = "Hire a CTO or CFO early to handle the 'First Principles' while you drive growth.";
        } else if (dimension === 'Strategic Risk Agility') {
            status = "Reserved Force / Reactive Guard";
            description = "Your aggressive potential is内敛 (internalized). You prefer calculated, reactive measures rather than proactive territorial conquest.";
            insight = "Strategy: At key decision points, proactively manifest your authority to prevent territorial erosion.";
        } else if (dimension === 'Relational Resonance') {
            status = "Harmonic / Collaborative";
            description = "Your leadership style is consensus-driven. You build bridges and maintain high team cohesion.";
            insight = "Ensure your desire for harmony doesn't prevent you from making tough personnel decisions.";
        }
    }
    return { status, description, insight };
};

// Helper to get the energy strength of a specific Deity
// Logic: Find the element associated with the Deity relative to Day Master, then get that Element's score.
const getDeityEnergyStrength = (chart: BaziChart, deity: string): number => {
    // 1. Identify the Element of this Deity
    // We iterate through Stems to find which Stem produces this Deity for this Day Master.
    // Optimization: We can map Day Master Element + Deity Name -> Target Element.
    // Or simpler: Check Element Scores directly if we know the mapping.

    // Let's deduce target element from Day Master and Deity.
    const dmElement = chart.dayMaster.element;
    // Map: DM(Wood) + Eating God -> Fire.
    // This requires a reverse lookup or a smart element cycle checker.

    // Simpler Approach for V1:
    // Iterate through all 10 Stems. If calculateDeity(DM, Stem) === Deity, then that Stem's Element is the target.
    // However, stems don't cover all elements if polarity differs?
    // Actually, Element Score is aggregate of Wood, Fire etc.
    // Eating God & Hurting Officer -> Output Element.
    // Direct/Indirect Wealth -> Wealth Element.
    // Direct/7K -> Power Element.
    // Resource -> Resource Element.
    // Friend/RW -> Parallel Element.

    const elements = [ElementType.WOOD, ElementType.FIRE, ElementType.EARTH, ElementType.METAL, ElementType.WATER];
    const elementCycle = {
        [ElementType.WOOD]: { output: ElementType.FIRE, wealth: ElementType.EARTH, power: ElementType.METAL, resource: ElementType.WATER, parallel: ElementType.WOOD },
        [ElementType.FIRE]: { output: ElementType.EARTH, wealth: ElementType.METAL, power: ElementType.WATER, resource: ElementType.WOOD, parallel: ElementType.FIRE },
        [ElementType.EARTH]: { output: ElementType.METAL, wealth: ElementType.WATER, power: ElementType.WOOD, resource: ElementType.FIRE, parallel: ElementType.EARTH },
        [ElementType.METAL]: { output: ElementType.WATER, wealth: ElementType.WOOD, power: ElementType.FIRE, resource: ElementType.EARTH, parallel: ElementType.METAL },
        [ElementType.WATER]: { output: ElementType.WOOD, wealth: ElementType.FIRE, power: ElementType.EARTH, resource: ElementType.METAL, parallel: ElementType.WATER },
    };

    const relations = elementCycle[dmElement];
    let targetElement: ElementType | null = null;

    if (['Eating God', 'Hurting Officer'].includes(deity)) targetElement = relations.output;
    else if (['Direct Wealth', 'Indirect Wealth'].includes(deity)) targetElement = relations.wealth;
    else if (['Direct Officer', 'Seven Killings'].includes(deity)) targetElement = relations.power;
    else if (['Direct Resource', 'Indirect Resource'].includes(deity)) targetElement = relations.resource;
    else if (['Friend', 'Rob Wealth'].includes(deity)) targetElement = relations.parallel;

    if (!targetElement) return 0;

    // Now, do we split by Polarity?
    // The current ElementScore is Aggregated (Wood Total). It doesn't split Yin Wood vs Yang Wood strengths.
    // For V1 Approx: We assign the TOTAL element score to the deity. 
    // This is "Systemic Energy" - if you have strong Fire, both EG and HO are powered.
    // To distinguish EG vs HO, we can use the ratio of Counts.
    // Energy = TotalElementScore * (CountDeity / TotalCountOfThatElement'sDeities)
    // If Count is 0 but Score > 0 (hidden?), we assume latent.

    const totalScore = chart.elementScores?.[targetElement] || 0;
    const count = countDeity(chart, deity);

    // Find sibling deity to normalize
    let sibling = "";
    if (deity === 'Eating God') sibling = 'Hurting Officer';
    else if (deity === 'Hurting Officer') sibling = 'Eating God';
    else if (deity === 'Direct Wealth') sibling = 'Indirect Wealth';
    else if (deity === 'Indirect Wealth') sibling = 'Direct Wealth';
    else if (deity === 'Direct Officer') sibling = 'Seven Killings';
    else if (deity === 'Seven Killings') sibling = 'Direct Officer';
    else if (deity === 'Direct Resource') sibling = 'Indirect Resource';
    else if (deity === 'Indirect Resource') sibling = 'Direct Resource';
    else if (deity === 'Friend') sibling = 'Rob Wealth';
    else if (deity === 'Rob Wealth') sibling = 'Friend';

    const siblingCount = countDeity(chart, sibling);
    const totalCount = count + siblingCount;

    if (totalCount === 0) return 0; // Or return totalScore if we assume pure element presence implies deity? Let's stick to counts redistributing energy.

    return totalScore * (count / totalCount);
};

const countDeity = (chart: BaziChart, deity: string): number => {
    let count = 0;
    // Check Stems (Year, Month, Hour) - exclude Day Master as it is the reference
    [chart.yearPillar, chart.monthPillar, chart.hourPillar].forEach(pillar => {
        if (pillar.stem.deity === deity) count += 1;
    });
    // Check Branches
    [chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar].forEach(pillar => {
        if (pillar.branch.deity === deity) count += 1;
    });
    return count;
};

const getElementScore = (chart: BaziChart, element: ElementType): number => {
    return (chart.elementScores?.[element] || 0);
};

export const calculateSystemMetrics = (chart: BaziChart): Record<string, SystemMetric> => {
    const metrics: Record<string, SystemMetric> = {};

    // Calculate Total System Energy for Normalization
    let totalEnergy = 0;
    if (chart.elementScores) {
        totalEnergy = Object.values(chart.elementScores).reduce((a, b) => a + b, 0);
    }
    if (totalEnergy === 0) totalEnergy = 1; // Prevent div by zero

    // Helper to normalize energy to 0-100 Scale relative to system
    // A single element can be max ~40-50% of chart usually. 
    // Let's say 40% energy = 100 Score. Multiplier = 2.5
    const normalize = (val: number) => Math.min(100, Math.round((val / totalEnergy) * 250));

    // 1. Cognitive Exploration Index (Curiosity)
    const egEnergy = getDeityEnergyStrength(chart, 'Eating God');
    const hoEnergy = getDeityEnergyStrength(chart, 'Hurting Officer');
    // Formula: Weighted Sum
    const rawCognitive = (egEnergy * 0.6) + (hoEnergy * 0.4);
    const cognitiveVal = normalize(rawCognitive);
    const cognitiveContent = getDynamicContent(cognitiveVal, 'Cognitive Exploration Index', chart);
    metrics['Cognitive Exploration Index'] = {
        label: 'Cognitive Exploration Index',
        value: cognitiveVal,
        ...cognitiveContent
    };

    // 2. Visionary Obsession (Insight)
    const irEnergy = getDeityEnergyStrength(chart, 'Indirect Resource');
    const rawVision = (irEnergy * 0.7) + (hoEnergy * 0.3);
    const visionVal = normalize(rawVision);
    const visionContent = getDynamicContent(visionVal, 'Visionary Obsession', chart);
    metrics['Visionary Obsession'] = {
        label: 'Visionary Obsession',
        value: visionVal,
        ...visionContent
    };

    // 3. Psychological Fortitude (Resilience)
    // Formula: DM Strength (Element) + Friend Energy + Earth Energy (Grounding)
    const dmElemScore = getElementScore(chart, chart.dayMaster.element);
    const friendEnergy = getDeityEnergyStrength(chart, 'Friend');
    const earthScore = getElementScore(chart, ElementType.EARTH);
    const rawFortitude = (dmElemScore * 0.4) + (friendEnergy * 0.3) + (earthScore * 0.3);
    const fortitudeVal = normalize(rawFortitude);
    const fortitudeContent = getDynamicContent(fortitudeVal, 'Psychological Fortitude', chart);
    metrics['Psychological Fortitude'] = {
        label: 'Psychological Fortitude',
        value: fortitudeVal,
        ...fortitudeContent
    };

    // 4. Systemic Analytical Rigor (Logic)
    const drEnergy = getDeityEnergyStrength(chart, 'Direct Resource');
    const doEnergy = getDeityEnergyStrength(chart, 'Direct Officer');
    const rawRigor = (drEnergy * 0.6) + (doEnergy * 0.4);
    const rigorVal = normalize(rawRigor);
    const rigorContent = getDynamicContent(rigorVal, 'Systemic Analytical Rigor', chart);
    metrics['Systemic Analytical Rigor'] = {
        label: 'Systemic Analytical Rigor',
        value: rigorVal,
        ...rigorContent
    };

    // 5. Strategic Risk Agility (Risk)
    const k7Energy = getDeityEnergyStrength(chart, 'Seven Killings');
    const iwEnergy = getDeityEnergyStrength(chart, 'Indirect Wealth');
    const rawRisk = (k7Energy * 0.5) + (iwEnergy * 0.5);
    const riskVal = normalize(rawRisk);
    const riskContent = getDynamicContent(riskVal, 'Strategic Risk Agility', chart);
    metrics['Strategic Risk Agility'] = {
        label: 'Strategic Risk Agility',
        value: riskVal,
        ...riskContent
    };

    // 6. Relational Resonance (Communication)
    const peerEnergy = getDeityEnergyStrength(chart, 'Friend') + getDeityEnergyStrength(chart, 'Rob Wealth');
    const metalScore = getElementScore(chart, ElementType.METAL);
    const rawRelation = (peerEnergy * 0.6) + (metalScore * 0.4);
    const relationVal = normalize(rawRelation);
    const relationContent = getDynamicContent(relationVal, 'Relational Resonance', chart);
    metrics['Relational Resonance'] = {
        label: 'Relational Resonance',
        value: relationVal,
        ...relationContent
    };

    return metrics;
};

export const generateSynergyOptimization = (metrics: Record<string, SystemMetric>): string => {
    // Determine lowest metric to give advice
    const sorted = Object.values(metrics).sort((a, b) => a.value - b.value);
    const lowest = sorted[0];

    if (lowest.label === 'Cognitive Exploration Index') {
        return "Your Creative Output (Wood/Water) is currently low. Suggest increasing 'Divergent Thinking' sessions or partnering with a 'Natural Alchemist'.";
    }
    if (lowest.label === 'Visionary Obsession') {
        return "Your Long-Wave Vision (Fire/Resource) needs modulation. Suggest 'Decadal Planning Consolidations' or strategic retreats.";
    }
    if (lowest.label === 'Psychological Fortitude') {
        return "Your Structural Integrity (Earth) is under load. Suggest increasing 'Grounding Protocols'—meditation, physical resistance training, or operational buffers.";
    }
    if (lowest.label === 'Systemic Analytical Rigor') {
        return "Your Foundational Logic (Metal) is active but could be sharper. Suggest audit of 'First Principles' documents or hiring a 'Structural Precision' consultant.";
    }
    if (lowest.label === 'Strategic Risk Agility') {
        return "Your Asymmetric Drive is conservative. Suggest running small 'High-Entropy' experiments to re-calibrate risk tolerance.";
    }
    if (lowest.label === 'Relational Resonance') {
        return "Your Fluid Intelligence (Water) is relatively low in the social sphere. Suggest deep dialogue with a 'Resonant Lubricant' partner to improve team harmonics.";
    }
    return "Maintain current system equilibrium. Continue monitoring core indices.";
};
