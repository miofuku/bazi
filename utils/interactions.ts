
// Basic Interaction Logic for Stems and Branches

export type InteractionType = 'ThreeHarmony' | 'SixHarmony' | 'Directional' | 'Clash' | 'Harm' | 'Punishment' | 'StemCombination' | 'StemClash';

export interface Interaction {
    type: InteractionType;
    label: string; // e.g. "Rat-Horse Clash"
    score: number; // Positive for Synergy, Negative for Friction
    description: string;
    participants: string[]; // Characters involved
}

// Data Tables (Simplified for MVP)

// Stem Combinations (He) - Synergy
const STEM_COMBINATIONS: Record<string, string> = {
    '甲': '己', '己': '甲',
    '乙': '庚', '庚': '乙',
    '丙': '辛', '辛': '丙',
    '丁': '壬', '壬': '丁',
    '戊': '癸', '癸': '戊'
};

// Stem Clashes (Chong) - Friction
const STEM_CLASHES: Record<string, string[]> = {
    '甲': ['庚', '戊'], '乙': ['辛', '己'],
    '丙': ['壬', '庚'], '丁': ['癸', '辛'],
    '戊': ['甲', '壬'], '己': ['乙', '癸'],
    '庚': ['丙', '甲'], '辛': ['丁', '乙'],
    '壬': ['戊', '丙'], '癸': ['己', '丁']
};

// Branch Six Harmony (Liu He) - High Synergy
const SIX_HARMONIES: Record<string, string> = {
    '子': '丑', '丑': '子',
    '寅': '亥', '亥': '寅',
    '卯': '戌', '戌': '卯',
    '辰': '酉', '酉': '辰',
    '巳': '申', '申': '巳',
    '午': '未', '未': '午'
};

// Branch Six Clashes (Liu Chong) - High Friction
const SIX_CLASHES: Record<string, string> = {
    '子': '午', '午': '子',
    '丑': '未', '未': '丑',
    '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰',
    '巳': '亥', '亥': '巳'
};

// Branch Three Harmony (San He) - Very High Synergy (simplified check)
const THREE_HARMONIES = [
    ['申', '子', '辰'], // Water
    ['亥', '卯', '未'], // Wood
    ['寅', '午', '戌'], // Fire
    ['巳', '酉', '丑'], // Metal
];

export const calculateInteractions = (char1: string, char2: string, isStem: boolean): Interaction | null => {
    if (isStem) {
        if (STEM_COMBINATIONS[char1] === char2) {
            return { type: 'StemCombination', label: 'Strategic Alignment', score: 20, description: 'High alignment of core energies (Combination).', participants: [char1, char2] };
        }
        if (STEM_CLASHES[char1]?.includes(char2)) {
            return { type: 'StemClash', label: 'Structural Constraint', score: -15, description: 'Direct opposition requiring energy expenditure (Friction).', participants: [char1, char2] };
        }
    } else {
        if (SIX_HARMONIES[char1] === char2) {
            return { type: 'SixHarmony', label: 'Strategic Alignment', score: 25, description: 'Stabilizing connection (Combination).', participants: [char1, char2] };
        }
        if (SIX_CLASHES[char1] === char2) {
            return { type: 'Clash', label: 'Total Reconfiguration', score: -25, description: 'Transformational friction point (Clash).', participants: [char1, char2] };
        }
    }
    return null;
};

// Check for chart-level interactions (internal)
export const getInternalInteractions = (pillars: { stem: string, branch: string, id: string }[]): Interaction[] => {
    const interactions: Interaction[] = [];

    for (let i = 0; i < pillars.length; i++) {
        for (let j = i + 1; j < pillars.length; j++) {
            const p1 = pillars[i];
            const p2 = pillars[j];

            // Stem Check
            const stemInt = calculateInteractions(p1.stem, p2.stem, true);
            if (stemInt) interactions.push({ ...stemInt, label: `${stemInt.label} (${p1.id}-${p2.id})` });

            // Branch Check
            const branchInt = calculateInteractions(p1.branch, p2.branch, false);
            if (branchInt) interactions.push({ ...branchInt, label: `${branchInt.label} (${p1.id}-${p2.id})` });
        }
    }
    return interactions;
};
