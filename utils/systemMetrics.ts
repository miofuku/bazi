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
            label: 'Cognitive Exploration',
            value: scale(countDeity('食') + countDeity('伤'), (getElementScore(ElementType.WOOD) + getElementScore(ElementType.WATER)) / 2),
            description: 'Measures your drive for intellectual novelty and creative output. Are you a source of original light or a refiner of existing wisdom?'
        },
        vision: {
            label: 'Visionary Obsession',
            value: scale(countDeity('枭'), getElementScore(ElementType.FIRE)),
            description: "Your capacity for long-term anticipation. Defines the intensity of your focus and the clarity of your 'Inner Eye.'"
        },
        resilience: {
            label: 'Psychological Fortitude',
            value: scale(countDeity('比'), getElementScore(ElementType.EARTH)),
            description: 'The structural integrity of your system under pressure. Your ability to maintain equilibrium in high-entropy environments.'
        },
        logic: {
            label: 'Systemic Logic',
            value: scale(countDeity('印') + countDeity('官'), getElementScore(ElementType.METAL)),
            description: 'The density of your analytical framework. It dictates how you categorize reality and build scalable structures.'
        },
        venture: {
            label: 'Venture Drive',
            value: scale(countDeity('杀') + countDeity('才'), (getElementScore(ElementType.FIRE) + getElementScore(ElementType.METAL)) / 2),
            description: 'Your innate appetite for asymmetric stakes. It measures the alignment between your ambition and your execution energy.'
        },
        impact: {
            label: 'Relational Resonance',
            value: scale(countDeity('劫'), getElementScore(ElementType.METAL)),
            description: 'How your core energy impacts the collective field. It defines whether you lead through sharp authority or harmonic influence.'
        }
    };

    return metrics;
};
