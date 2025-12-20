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

export const calculateSystemMetrics = (chart: BaziChart): Record<string, SystemMetric> => {
    const { yearPillar, monthPillar, dayPillar, hourPillar, elementScores, dayMaster } = chart;
    const dmChar = dayMaster.chinese;
    const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];

    // Helper to count occurrences of short deity names in the 8 characters
    const countDeity = (deityShort: string): number => {
        let count = 0;
        pillars.forEach(p => {
            if (calculateDeity(dmChar, p.stem.chinese) === deityShort) count++;
            if (p.branch.hiddenStems && p.branch.hiddenStems.length > 0) {
                if (calculateDeity(dmChar, p.branch.hiddenStems[0].chinese) === deityShort) count++;
            }
        });
        return count;
    };

    const getElementScore = (type: ElementType): number => {
        return elementScores?.[type] || 0;
    };

    // Base scaling
    const scale = (deityCount: number, elementScore: number, weightDeity = 0.7, weightElement = 0.3): number => {
        const deityPoints = Math.min(deityCount * 25, 100);
        const score = (deityPoints * weightDeity) + (elementScore * weightElement);
        // Normalize slightly high to ensure 'Tech Founders' feel capable
        return Math.round(Math.min(score * 1.2, 98));
    };

    // Calculate raw values first
    const rawValues = {
        curiosity: scale(countDeity('食') + countDeity('伤'), (getElementScore(ElementType.WOOD) + getElementScore(ElementType.WATER)) / 2),
        vision: scale(countDeity('枭'), getElementScore(ElementType.FIRE)),
        resilience: scale(countDeity('比') + countDeity('劫'), getElementScore(ElementType.EARTH)), // Fixed: Combined Friend/Rob Wealth
        logic: scale(countDeity('印') + countDeity('官'), getElementScore(ElementType.METAL)),
        venture: scale(countDeity('杀') + countDeity('才'), (getElementScore(ElementType.FIRE) + getElementScore(ElementType.METAL)) / 2),
        impact: scale(countDeity('劫'), getElementScore(ElementType.METAL))
    };

    // Construct metrics with dynamic content
    const metrics: Record<string, SystemMetric> = {};

    // 1. Cognitive Exploration Index (Curiosity)
    const curiosityContent = getDynamicContent(rawValues.curiosity, 'Cognitive Exploration Index');
    metrics.curiosity = {
        label: 'Cognitive Exploration Index',
        value: rawValues.curiosity,
        description: curiosityContent.description,
        founderInsight: curiosityContent.insight,
        status: curiosityContent.status
    };

    // 2. Visionary Obsession (Vision)
    const visionContent = getDynamicContent(rawValues.vision, 'Visionary Obsession');
    metrics.vision = {
        label: 'Visionary Obsession',
        value: rawValues.vision,
        description: visionContent.description,
        founderInsight: visionContent.insight,
        status: visionContent.status
    };

    // 3. Psychological Fortitude (Resilience)
    const resilienceContent = getDynamicContent(rawValues.resilience, 'Psychological Fortitude');
    metrics.resilience = {
        label: 'Psychological Fortitude',
        value: rawValues.resilience,
        description: resilienceContent.description,
        founderInsight: resilienceContent.insight,
        status: resilienceContent.status
    };

    // 4. Systemic Analytical Rigor (Logic)
    const logicContent = getDynamicContent(rawValues.logic, 'Systemic Analytical Rigor');
    metrics.logic = {
        label: 'Systemic Analytical Rigor',
        value: rawValues.logic,
        description: logicContent.description,
        founderInsight: logicContent.insight,
        status: logicContent.status
    };

    // 5. Strategic Risk Agility (Venture)
    const ventureContent = getDynamicContent(rawValues.venture, 'Strategic Risk Agility');
    metrics.venture = {
        label: 'Strategic Risk Agility',
        value: rawValues.venture,
        description: ventureContent.description,
        founderInsight: ventureContent.insight,
        status: ventureContent.status
    };

    // 6. Relational Resonance (Impact)
    const impactContent = getDynamicContent(rawValues.impact, 'Relational Resonance');
    metrics.impact = {
        label: 'Relational Resonance',
        value: rawValues.impact,
        description: impactContent.description,
        founderInsight: impactContent.insight,
        status: impactContent.status
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
