import { BaziChart } from '../types';

export interface ArchetypeResult {
    title: string;
    tagline: string;
    description: string;
}

// Map the "Ten Deities" (Shi Shen) to modern Archetypes
// Based on the 'deity' string calculated in baziCalculator (e.g., '七杀', '正官')
const ARCHETYPE_MAP: Record<string, ArchetypeResult> = {
    '七杀': {
        title: 'The Strategic Warrior',
        tagline: 'Resilient. Decisive. Transformative.',
        description: 'You thrive under pressure and possess the courage to break boundaries. You are not afraid of chaos; you master it.'
    },
    '正官': {
        title: 'The Noble Guardian',
        tagline: 'Principled. Reliable. Diplomatic.',
        description: 'You are the pillar of society. Your integrity and sense of duty inspire trust and bring order to any situation.'
    },
    '食神': {
        title: 'The Creative Nurturer',
        tagline: 'Artistic. Thoughtful. Expressive.',
        description: 'You see the beauty in the world and have a gift for creation. Your gentle intelligence flows like a river.'
    },
    '伤官': {
        title: 'The Charismatic Maverick',
        tagline: 'Bold. Innovative. Unconventional.',
        description: 'You challenge the status quo. Your sharp wit and talent for performance make you a natural spotlight magnet.'
    },
    '偏财': {
        title: 'The Opportunity Hunter',
        tagline: 'Dynamic. Generous. Entrepreneurial.',
        description: 'You have an eye for value and a talent for seizing the moment. You play the game of life with flair and big vision.'
    },
    '正财': {
        title: 'The Architect of Abundance',
        tagline: 'Diligent. Prudent. Builder.',
        description: 'You build lasting wealth effectively. Your practicality and persistence ensure that every step you take leads to solid ground.'
    },
    '偏印': {
        title: 'The Mystic Intuitive',
        tagline: 'Unconventional. Deep. Insightful.',
        description: 'You perceive what others miss. Your mind operates on a different frequency, capable of profound and unique breakthroughs.'
    },
    '正印': {
        title: 'The Wise Sage',
        tagline: 'Knowledgeable. Caring. Mentor.',
        description: 'You are a seeker of truth and a protector of wisdom. Your presence provides comfort and guidance to those around you.'
    },
    '比肩': {
        title: 'The Collaborative Connector',
        tagline: 'Loyal. Social. Steadfast.',
        description: 'You value equality and friendship. Your strength lies in your ability to stand shoulder-to-shoulder with your peers.'
    },
    '劫财': {
        title: 'The Competitive Trailblazer',
        tagline: 'Ambitious. Daring. Charismatic.',
        description: 'You have a drive to win and the charisma to lead. You are at your best when you are pushing limits and rallying a team.'
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
