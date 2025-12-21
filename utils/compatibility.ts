import { BaziChart, ElementType, SystemMetric, Polarity } from '../types';
import { STEMS, BRANCHES, FIVE_ELEMENTS_INFO } from './constants';
import { calculateCoreGenome } from './roleMapping';

export interface IdealPartnerProfile {
    coreResonance: {
        targetDayMaster: string; // e.g., "Yin Earth"
        relationType: 'Harmonic Loop (Combine)' | 'Productive Tension (Control)' | 'Neutral Flow (Same)';
        description: string;
    };
    functionalComplementarity: {
        missingArchetype: string; // e.g., "The Executor"
        why: string;
    };
    elementalRebalancing: {
        targetElement: ElementType;
        benefit: string;
    };
    temporalSync: {
        currentPhase: 'Expansion' | 'Consolidation' | 'Transformation';
        idealPartnerPhase: 'Expansion' | 'Consolidation';
        description: string;
    };
    totalScore: number; // Hypothetical "Potential" Score
}

export const calculateIdealPartner = (chart: BaziChart): IdealPartnerProfile => {
    // 1. Core Resonance (Day Master Logic)
    const dm = chart.dayMaster; // { element: ElementType, polarity: Polarity }

    // Simplified logic for "Combine" (Harmonic Loop)
    // Wood & Earth, Fire & Metal, Earth & Water, Metal & Wood, Water & Fire (Traditionally Stems Combine)
    // For now, we'll implement a simplified "Opposite Polarity + Controlling Relationship" approximation for "Combine"
    // or just hardcode the 5 Stem Combinations if we had Stem info.
    // Let's use Element logic:
    // Ideal: The element that Controlling the DM (Official) or DM Controls (Wealth) with opposite polarity is often "Combine" or "Strong Attraction"

    let targetElement = ElementType.METAL;
    let targetParity = dm.polarity === Polarity.YANG ? Polarity.YIN : Polarity.YANG;
    let relationType: 'Harmonic Loop (Combine)' | 'Productive Tension (Control)' | 'Neutral Flow (Same)' = 'Harmonic Loop (Combine)';
    let resonanceDesc = "Your core frequencies create a Harmonic Loop.";

    // Simple look-up for Stem Combinations (Yang + Yin)
    // 甲(Wood+) + 己(Earth-)
    // 庚(Metal+) + 乙(Wood-)
    // 丙(Fire+) + 辛(Metal-)
    // 壬(Water+) + 丁(Fire-)
    // 戊(Earth+) + 癸(Water-)

    // Control / Combine Logic Approximation
    if (dm.element === ElementType.WOOD) { targetElement = dm.polarity === Polarity.YANG ? ElementType.EARTH : ElementType.METAL; }
    else if (dm.element === ElementType.FIRE) { targetElement = dm.polarity === Polarity.YANG ? ElementType.METAL : ElementType.WATER; }
    else if (dm.element === ElementType.EARTH) { targetElement = dm.polarity === Polarity.YANG ? ElementType.WATER : ElementType.WOOD; }
    else if (dm.element === ElementType.METAL) { targetElement = dm.polarity === Polarity.YANG ? ElementType.WOOD : ElementType.FIRE; }
    else if (dm.element === ElementType.WATER) { targetElement = dm.polarity === Polarity.YANG ? ElementType.FIRE : ElementType.EARTH; }

    const targetDmName = (targetParity === Polarity.YANG ? 'Yang ' : 'Yin ') + targetElement;


    // 2. Functional Complementarity (Missing Archetype)
    // Based on what Metric/Role is dominant vs weakest.
    if (!chart.systemMetrics) {
        // Fallback
        return {
            coreResonance: { targetDayMaster: "Unknown", relationType: 'Neutral Flow (Same)', description: "" },
            functionalComplementarity: { missingArchetype: "Unknown", why: "" },
            elementalRebalancing: { targetElement: ElementType.WOOD, benefit: "" },
            temporalSync: { currentPhase: 'Transformation', idealPartnerPhase: 'Expansion', description: "" },
            totalScore: 0
        };
    }

    const metrics = Object.values(chart.systemMetrics).sort((a, b) => b.value - a.value);
    const dominantMetric = metrics[0];
    const weakestMetric = metrics[metrics.length - 1];

    let missingArchetype = "The Stabilizer";
    let compWhy = "To ground your energy.";

    // Roles: Visionary (Vision), Operator (Logic), Catalyst (Risk/Network), Buffer (Stability)
    // If Visionary -> Needs Operator
    // If Operator -> Needs Visionary
    // If Catalyst -> Needs Buffer
    // If Buffer -> Needs Catalyst

    if (dominantMetric.label === 'Visionary Obsession') {
        missingArchetype = "The Operator";
        compWhy = "Your 'Visionary Output' needs a 'Structural Stability Matrix' for grounding.";
    } else if (dominantMetric.label === 'Systemic Analytical Rigor') {
        missingArchetype = "The Visionary";
        compWhy = "Your 'Structural Logic' needs 'Disruptive Input' to prevent stagnation.";
    } else if (dominantMetric.label === 'Strategic Risk Agility') {
        missingArchetype = "The Buffer";
        compWhy = "Your 'Kinetic Drive' needs an 'Absorptive Layer' to manage system friction.";
    } else {
        missingArchetype = "The Catalyst";
        compWhy = "Your 'Harmonic Stability' needs 'Kinetic Injection' for growth.";
    }


    // 3. Elemental Rebalancing (Weakest Element)
    // Find weakest element score
    const elementScores = chart.elementScores || {};
    const sortedElements = (Object.entries(elementScores) as [ElementType, number][]).sort((a, b) => a[1] - b[1]);
    const weakestElement = sortedElements[0] ? sortedElements[0][0] : ElementType.WATER; // Default

    let healingBenefit = "Provides systemic equilibrium.";
    if (weakestElement === ElementType.WATER) healingBenefit = "Injects Fluid Intelligence to cool high-friction overheat.";
    if (weakestElement === ElementType.FIRE) healingBenefit = "Provides Radiant Energy to illuminate structural blind spots.";
    if (weakestElement === ElementType.WOOD) healingBenefit = "Offers Growth Potential to expand static systems.";
    if (weakestElement === ElementType.METAL) healingBenefit = "Adds Axiomatic Precision to define loose boundaries.";
    if (weakestElement === ElementType.EARTH) healingBenefit = "Creates Gravitational Stability for grounding.";


    // 4. Temporal Sync (Mock Logic based on Year Pillar for simplicity or random for demo)
    // In a real app, this would check 10-year luck pillar.
    // For demo, we'll assume a fixed logic or randomize based on Branch.
    const currentPhase = 'Expansion';
    const idealPartnerVar = 'Expansion';
    const temporalDesc = "You are entering a 'High Vitality' window. An aligned partner catalyzes exponential growth.";


    return {
        coreResonance: {
            targetDayMaster: targetDmName,
            relationType: relationType,
            description: resonanceDesc
        },
        functionalComplementarity: {
            missingArchetype: missingArchetype,
            why: compWhy
        },
        elementalRebalancing: {
            targetElement: weakestElement,
            benefit: healingBenefit
        },
        temporalSync: {
            currentPhase: currentPhase,
            idealPartnerPhase: idealPartnerVar,
            description: temporalDesc
        },
        totalScore: 94 // Hypothetical "Alchemical Union" potential
    };
};
