import { BaziChart, SystemMetric, ElementType } from '../types';
import { calculateDeity } from './baziCalculator';

export const calculateSystemMetrics = (chart: BaziChart): Record<string, SystemMetric> => {
    const { yearPillar, monthPillar, dayPillar, hourPillar, elementScores, dayMaster } = chart;
    const dmChar = dayMaster.chinese;
    const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];

    // Helper to count occurrences of short deity names in the 8 characters (4 stems + 4 main branches)
    const countDeity = (deityShort: string): number => {
        let count = 0;
        pillars.forEach(p => {
            if (calculateDeity(dmChar, p.stem.chinese) === deityShort) count++;
            // For branches, we look at the main hidden stem (first one)
            if (p.branch.hiddenStems && p.branch.hiddenStems.length > 0) {
                if (calculateDeity(dmChar, p.branch.hiddenStems[0].chinese) === deityShort) count++;
            }
        });
        return count;
    };

    const getElementScore = (type: ElementType): number => {
        return elementScores?.[type] || 0;
    };

    // Base scaling: each deity occurrence gives ~20 points, element strength (0-100) gives proportion
    const scale = (deityCount: number, elementScore: number, weightDeity = 0.7, weightElement = 0.3): number => {
        const deityPoints = Math.min(deityCount * 25, 100);
        const score = (deityPoints * weightDeity) + (elementScore * weightElement);
        return Math.round(Math.min(score, 98)); // Keep it under 100 for "optimization room"
    };

    const metrics: Record<string, SystemMetric> = {
        curiosity: {
            label: 'Cognitive Exploration Index',
            value: scale(countDeity('食') + countDeity('伤'), (getElementScore(ElementType.WOOD) + getElementScore(ElementType.WATER)) / 2),
            description: 'Your system is wired for Intellectual Fluidity, constantly seeking to decode the unknown through creative output.'
        },
        vision: {
            label: 'Visionary Obsession',
            value: scale(countDeity('枭'), getElementScore(ElementType.FIRE)),
            description: 'An innate capacity for Transcendental Insight, allowing you to fixate on future realities long before they manifest.'
        },
        resilience: {
            label: 'Psychological Fortitude',
            value: scale(countDeity('比'), getElementScore(ElementType.EARTH)),
            description: 'The structural integrity to maintain Internal Equilibrium amidst high-friction environments and external turbulence.'
        },
        logic: {
            label: 'Systemic Analytical Rigor',
            value: scale(countDeity('印') + countDeity('官'), getElementScore(ElementType.METAL)),
            description: 'A deep-seated drive for Foundational Logic and the mastery of complex, hierarchical knowledge systems.'
        },
        venture: {
            label: 'Strategic Risk Agility',
            value: scale(countDeity('杀') + countDeity('才'), (getElementScore(ElementType.FIRE) + getElementScore(ElementType.METAL)) / 2),
            description: 'A high-intensity drive to conquer Asymmetric Opportunities with a laser-focused allocation of personal energy.'
        },
        impact: {
            label: 'Resonance & Interpersonal Impact',
            value: scale(countDeity('劫'), getElementScore(ElementType.METAL)),
            description: 'The power of your Relational Frequency—how your core intensity shapes the collective field of a team.'
        }
    };

    return metrics;
};
