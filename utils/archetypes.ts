import { BaziChart } from '../types';

export interface ArchetypeResult {
    title: string;
    tagline: string;
    description: string;
}

// Map the "Ten Deities" (Shi Shen) to modern Archetypes
// Based on the 'deity' string calculated in baziCalculator (e.g., '七杀', '正官')
const ARCHETYPE_MAP: Record<string, ArchetypeResult> = {
    '比肩': {
        title: 'The Peer',
        tagline: 'Identity & Independence',
        description: 'You value equality and friendship. Your strength lies in your ability to stand shoulder-to-shoulder with your peers.'
    },
    '劫财': {
        title: 'The Charmer',
        tagline: 'Ambition & Social Leverage',
        description: 'You have a drive to win and the charisma to lead. You are at your best when you are pushing limits and rallying a team.'
    },
    '食神': {
        title: 'The Artist',
        tagline: 'Creativity & Enjoyment',
        description: 'You see the beauty in the world and have a gift for creation. Your gentle intelligence flows like a river.'
    },
    '伤官': {
        title: 'The Innovator',
        tagline: 'Rebellion & Brilliance',
        description: 'You challenge the status quo. Your sharp wit and talent for performance make you a natural spotlight magnet.'
    },
    '正财': {
        title: 'The Manager',
        tagline: 'Hard Work & Stability',
        description: 'You build lasting wealth effectively. Your practicality and persistence ensure that every step you take leads to solid ground.'
    },
    '偏财': {
        title: 'The Entrepreneur',
        tagline: 'Opportunity & Flow',
        description: 'You have an eye for value and a talent for seizing the moment. You play the game of life with flair and big vision.'
    },
    '正官': {
        title: 'The Diplomat',
        tagline: 'Order & Reputation',
        description: 'You are the pillar of society. Your integrity and sense of duty inspire trust and bring order to any situation.'
    },
    '七杀': {
        title: 'The Warrior',
        tagline: 'Action & Resilience',
        description: 'You thrive under pressure and possess the courage to break boundaries. You are not afraid of chaos; you master it.'
    },
    '正印': {
        title: 'The Guardian',
        tagline: 'Knowledge & Support',
        description: 'You are a seeker of truth and a protector of wisdom. Your presence provides comfort and guidance to those around you.'
    },
    '偏印': {
        title: 'The Philosopher',
        tagline: 'Intuition & Mystery',
        description: 'You perceive what others miss. Your mind operates on a different frequency, capable of profound and unique breakthroughs.'
    },
    // Fallbacks
    '': {
        title: 'The Balanced Seeker',
        tagline: 'Harmonious. Adaptable. Center-Seeking.',
        description: 'Your chart shows a unique balance. You are on a journey to define your own path.'
    }
};

export const getArchetype = (chart: BaziChart): ArchetypeResult => {
    // Logic: The Month Branch Main Qi (Month Decree) is the strongest indicator of "Ge Ju" (Pattern/Structure)
    // We check pillar.monthPillar.branch.deity
    const monthDeity = chart.monthPillar.branch.deity;

    // If month deity is not found (e.g. empty or error), fallback.
    // Note: Our baziCalculator returns Chinese short names mapped to full names (e.g. '杀' -> '七杀')
    // We need to ensure consistency. In baziCalculator we used DEITY_FULL_NAMES.

    if (monthDeity && ARCHETYPE_MAP[monthDeity]) {
        return ARCHETYPE_MAP[monthDeity];
    }

    // Fallback if Main Qi calculation fails: Check Day Stem (Day Master) for a "Self Element" archetype?
    // For now, return default.
    return ARCHETYPE_MAP[''] || { title: 'Unknown', tagline: '', description: '' };
};
