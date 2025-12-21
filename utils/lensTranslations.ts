export type PrismLens = 'genesis' | 'synergy' | 'resonance' | 'temporal';

interface TranslationEntry {
    keyword: string;
    genesis: string; // The Blueprint (Who I am)
    synergy: string; // The Machine (Role/Function)
    resonance: string; // The Alchemy (Love/Feeling)
    temporal: string; // The Current (Timing/Strategy)
}

export const LENS_TRANSLATIONS: Record<string, TranslationEntry> = {
    // Aggressive Archetypes
    'Seven Killings': {
        keyword: 'High Intensity',
        genesis: 'The Disruptor / High-Stakes Operator',
        synergy: 'Wartime Leadership / Crisis Management',
        resonance: 'Protective Passion / Intense Devotion',
        temporal: 'Conquest Phase / Break-Point'
    },
    'Direct Officer': {
        keyword: 'Order & Discipline',
        genesis: 'The Magistrate / Structural Pillar',
        synergy: 'Chief Operations Officer / Governance',
        resonance: 'Reliable Guardian / Loyal Commitment',
        temporal: 'Establishment Phase / Standardization'
    },

    // Intellectual Archetypes
    'Indirect Resource': {
        keyword: 'Abstract Insight',
        genesis: 'The Mystic / Pattern Decoder',
        synergy: 'Visionary Strategist / R&D Lead',
        resonance: 'Soul Connection / Intuitive Empathy',
        temporal: 'Hibernation Phase / Deep Research'
    },
    'Direct Resource': {
        keyword: 'Systemic Support',
        genesis: 'The Scholar / Knowledge Repository',
        synergy: 'Infrastructure Architect / QA Lead',
        resonance: 'Nurturing Sanctuary / Caregiver',
        temporal: 'Integration Phase / Validation'
    },

    // Expression Archetypes
    'Hurting Officer': {
        keyword: 'Performative Brilliance',
        genesis: 'The Performer / Brand Icon',
        synergy: 'Chief Marketing Officer / Publicist',
        resonance: 'Romantic Idealist / Dramatic Expression',
        temporal: 'Spotlight Phase / Virality'
    },
    'Eating God': {
        keyword: 'Creative Genius',
        genesis: 'The Artist / Product Designer',
        synergy: 'Innovation Lead / Creator',
        resonance: 'Sensual Connoisseur / Gentle Romance',
        temporal: 'Creation Phase / Iteration'
    },

    // Wealth Archetypes
    'Indirect Wealth': {
        keyword: 'Opportunity Hunter',
        genesis: 'The Entrepreneur / Risk Taker',
        synergy: 'Venture Capitalist / Sales Hunter',
        resonance: 'Dynamic Adventure / Generosity',
        temporal: 'Harvest Phase / Windfall'
    },
    'Direct Wealth': {
        keyword: 'Asset Manager',
        genesis: 'The Steward / Resource Planner',
        synergy: 'CFO / Resource Allocation',
        resonance: 'Stable Provider / Practical Care',
        temporal: 'Accumulation Phase / Stewardship'
    },

    // Peer Archetypes
    'Friend': {
        keyword: 'Social Gravity',
        genesis: 'The Connector / Trust Agent',
        synergy: 'Community Manager / Partnership Lead',
        resonance: 'Equal Partner / Best Friend',
        temporal: 'Networking Phase / Alliance'
    },
    'Rob Wealth': {
        keyword: 'Competitive Drive',
        genesis: 'The Amplifier / Social Leader',
        synergy: 'Growth Hacker / Network Effect',
        resonance: 'Charismatic Leader / Power Couple',
        temporal: 'Leverage Phase / Scaling'
    }
};

export const getLensTranslation = (deity: string | undefined): TranslationEntry => {
    if (!deity) {
        return {
            keyword: 'Balanced System',
            genesis: 'Balanced Core',
            synergy: 'Adaptive Role',
            resonance: 'Harmonic Flow',
            temporal: 'Steady State'
        };
    }
    // Attempt to match input (often comes as 'Seven Killings (7K)' or similar) to key
    // Simplified matching logic
    const key = Object.keys(LENS_TRANSLATIONS).find(k => deity.includes(k));
    return key ? LENS_TRANSLATIONS[key] : {
        keyword: 'System Node',
        genesis: deity || 'Unknown Node',
        synergy: 'Specialist',
        resonance: 'Partner',
        temporal: 'Transition'
    };
};
