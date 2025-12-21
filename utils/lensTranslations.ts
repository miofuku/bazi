export type PrismLens = 'genesis' | 'resonance' | 'temporal';

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
        keyword: 'Crisis Mastery',
        genesis: 'The Strategic Aggressor / Kinetic Force',
        synergy: 'The Wartime CEO / Surgical Execution',
        resonance: 'The Protective Alliance / Absolute Loyalty',
        temporal: 'Conquest Phase / Strategic Pivot'
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
        keyword: 'Non-linear Insight',
        genesis: 'The Transcendental Visionary / Decoding Matrix',
        synergy: 'Guardian of the Secret Moat / R&D Seclusion',
        resonance: 'Soul-Level Sync / Intellectual Solitude',
        temporal: 'Deep-Link Phase / Pattern Synthesis'
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
        keyword: 'Paradigm Shift',
        genesis: 'The Disruptive Innovator / Structural Defiance',
        synergy: 'Visionary Provocateur / Branding Engine',
        resonance: 'Intellectual Adventure / Evolutionary Lab',
        temporal: 'Spotlight Phase / Paradigm Shift'
    },
    'Eating God': {
        keyword: 'Intellectual Fluidity',
        genesis: 'The Natural Alchemist / Creative Flow',
        synergy: 'Strategic Refiner / Innovation Engine',
        resonance: 'Harmonic Nourisher / Emotional Generosity',
        temporal: 'Refinement Phase / Quality Control'
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
