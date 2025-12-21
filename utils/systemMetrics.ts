import { BaziChart, SystemMetric, ElementType } from '../types';
import { calculateDeity } from './baziCalculator';

// Helper to determine status and dynamic text based on score
const getDynamicContent = (score: number, dimension: string) => {
    let status = "";
    let description = "";
    let insight = "";

    if (score >= 70) {
        status = "High Output / High Entropy"; // Default high status
        if (dimension === 'Cognitive Exploration Index') {
            status = "High Output / High Entropy";
            description = "You possess a hyper-active Disruptive Innovator (Hurting Officer) node. Your mind does not just process information; it reconfigures it. You are naturally wired to challenge 'industry standards' and seek the most elegant, albeit radical, solutions to complex problems.";
            insight = "Beware of 'Idea Overload.' Your system generates concepts faster than your team can execute.";
        } else if (dimension === 'Visionary Obsession') {
            status = "Transcendental / Deep Focus";
            description = "Driven by a strong Transcendental Visionary (Indirect Resource) archetype, your focus is non-linear. You have a 'Long-Wave' perception, allowing you to see market shifts 3–5 years before they become consensus.";
            insight = "You may feel isolated in your conviction. Ensure your narrative is translated into 'Short-Wave' milestones for your investors.";
        } else if (dimension === 'Psychological Fortitude') {
            status = "Structural Integrity / High Pressure";
            description = "Your Grounding Matrix (Earth) provides significant structural integrity. You have a high threshold for 'Social Friction' and 'Market Turbulence.' You don't break under pressure; you crystallize.";
            insight = "Use this resilience to stabilize your team during 'Funding Winters.'";
        } else if (dimension === 'Systemic Analytical Rigor') {
            status = "Foundational / Logic-Driven";
            description = "Your system relies on Foundational Logic (Direct Resource). You are not satisfied with surface-level metrics; you demand to understand the 'First Principles' of your technology stack and business model.";
            insight = "This rigor ensures product-market fit but may slow down initial speed-to-market.";
        } else if (dimension === 'Strategic Risk Agility') {
            status = "Asymmetric Drive";
            description = "You carry the Strategic Aggressor (Seven Killings) signature. You are not a gambler; you are a 'Risk Architect.' You look for asymmetric bets where the downside is capped and the upside is systemic.";
            insight = "You are a 'Wartime CEO.' You excel when the stakes are highest.";
        } else if (dimension === 'Relational Resonance') {
            status = "High Impact / Sharp Edge";
            description = "Your Peer Resonance (Friend/Rob Wealth) is intense and singular. You don't 'manage' people; you 'polarize' them into believers or skeptics. Your communication is a high-frequency vibration that demands alignment.";
            insight = "Complement your intensity with an 'Operator' who can handle the harmonic lubrication of the team.";
        }
    } else {
        // Lower score variants (simplified for now, using a general fallback or 'Latent' status)
        status = "Latent / Developing";
        if (dimension === 'Cognitive Exploration Index') {
            description = "Your creative output is measured and deliberate. You prioritize practical implementation over radical disruption.";
            insight = "You may need to consciously force 'divergent thinking' sessions to avoid stagnation.";
        } else if (dimension === 'Visionary Obsession') {
            description = "You focus on the 'immediate horizon.' Your strength lies in tactical execution rather than distant speculation.";
            insight = "Pair with a visionary partner to ensure you aren't optimizing for a local maximum.";
        } else if (dimension === 'Psychological Fortitude') {
            status = "Adaptive / Fluid";
            description = "Your system is flexible rather than rigid. You adapt to market changes by flowing around obstacles rather than withstanding direct pressure.";
            insight = "Building structural buffers (cash flow, legal contracts) is critical for your peace of mind.";
        } else if (dimension === 'Systemic Analytical Rigor') {
            status = "Intuitive / Speed-First";
            description = "You prioritize speed and intuition over deep structural analysis. You build the plane while flying it.";
            insight = "Hire a CTO or CFO early to handle the 'First Principles' while you drive growth.";
        } else if (dimension === 'Strategic Risk Agility') {
            status = "Steady / Calculator";
            description = "You prefer calculated, linear growth. You avoid 'bet the company' moments in favor of compounding gains.";
            insight = "Don't let risk aversion prevent you from seizing asymmetric opportunities.";
        } else if (dimension === 'Relational Resonance') {
            status = "Harmonic / Collaborative";
            description = "Your leadership style is consensus-driven. You build bridges and maintain high team cohesion.";
            insight = "Ensure your desire for harmony doesn't prevent you from making tough personnel decisions.";
        }
    }
    return { status, description, insight };
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

    // 1. Cognitive Exploration Index (Curiosity)
    // Formula: (Eating God * 0.6 + Hurting Officer * 0.4) 
    // Scale: Deity count typically 0-5. Max ~5. Let's scale to 0-100. Multiply raw by ~20.
    const eg = countDeity(chart, 'Eating God');
    const ho = countDeity(chart, 'Hurting Officer');
    const rawCognitive = (eg * 0.6) + (ho * 0.4);
    const cognitiveVal = Math.min(100, Math.round(rawCognitive * 25)); // Scaling factor 25
    const cognitiveContent = getDynamicContent(cognitiveVal, 'Cognitive Exploration Index');
    metrics['Cognitive Exploration Index'] = {
        label: 'Cognitive Exploration Index',
        value: cognitiveVal,
        ...cognitiveContent
    };

    // 2. Visionary Obsession (Insight)
    // Formula: (Indirect Resource * 0.7 + Hurting Officer * 0.3)
    const ir = countDeity(chart, 'Indirect Resource');
    const rawVision = (ir * 0.7) + (ho * 0.3);
    const visionVal = Math.min(100, Math.round(rawVision * 25));
    const visionContent = getDynamicContent(visionVal, 'Visionary Obsession');
    metrics['Visionary Obsession'] = {
        label: 'Visionary Obsession',
        value: visionVal,
        ...visionContent
    };

    // 3. Psychological Fortitude (Resilience)
    // Formula: (Day Master * 0.5 + Friend * 0.3 + Earth * 0.2)
    // DM Strength is complex, usually element score. Let's use ElementScore of DM / 2.
    // Friend count. 
    // Earth Element Score (normalized 0-100).
    const dmElemScore = getElementScore(chart, chart.dayMaster.element);
    const friend = countDeity(chart, 'Friend');
    const earthScore = getElementScore(chart, ElementType.EARTH);

    // Weighted Sum: (DM_Score * 0.5) + (Friend_Count * 15 * 0.3) + (Earth_Score * 0.2)
    // Friend count * 15 to approximate score scale.
    const rawFortitude = (dmElemScore * 0.5) + (friend * 15 * 0.3) + (earthScore * 0.2);
    const fortitudeVal = Math.min(100, Math.round(rawFortitude));
    const fortitudeContent = getDynamicContent(fortitudeVal, 'Psychological Fortitude');
    metrics['Psychological Fortitude'] = {
        label: 'Psychological Fortitude',
        value: fortitudeVal,
        ...fortitudeContent
    };

    // 4. Systemic Analytical Rigor (Logic)
    // Formula: (Direct Resource * 0.6 + Direct Officer * 0.4)
    const dr = countDeity(chart, 'Direct Resource');
    const do_ = countDeity(chart, 'Direct Officer');
    const rawRigor = (dr * 0.6) + (do_ * 0.4);
    const rigorVal = Math.min(100, Math.round(rawRigor * 25));
    const rigorContent = getDynamicContent(rigorVal, 'Systemic Analytical Rigor');
    metrics['Systemic Analytical Rigor'] = {
        label: 'Systemic Analytical Rigor',
        value: rigorVal,
        ...rigorContent
    };

    // 5. Strategic Risk Agility (Risk)
    // Formula: (Seven Killings * 0.5 + Indirect Wealth * 0.5)
    const k7 = countDeity(chart, 'Seven Killings');
    const iw = countDeity(chart, 'Indirect Wealth');
    const rawRisk = (k7 * 0.5) + (iw * 0.5);
    const riskVal = Math.min(100, Math.round(rawRisk * 25));
    const riskContent = getDynamicContent(riskVal, 'Strategic Risk Agility');
    metrics['Strategic Risk Agility'] = {
        label: 'Strategic Risk Agility',
        value: riskVal,
        ...riskContent
    };

    // 6. Relational Resonance (Communication)
    // Formula: (Peer * 0.6 + Metal * 0.4)
    // Peer = Friend + Rob Wealth
    const rw = countDeity(chart, 'Rob Wealth');
    const peers = friend + rw;
    const metalScore = getElementScore(chart, ElementType.METAL);
    const rawRelation = (peers * 15 * 0.6) + (metalScore * 0.4);
    const relationVal = Math.min(100, Math.round(rawRelation));
    const relationContent = getDynamicContent(relationVal, 'Relational Resonance');
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
