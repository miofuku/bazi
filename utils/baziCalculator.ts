import { Stem, Branch, ElementType, Polarity } from '../types';
import { STEMS, BRANCHES } from './constants';

// Type definitions for internal use
type HiddenStem = {
    stem: string; // Chinese character
    days: number; // Duration/Weight
};

// Branch Hidden Stems (Zhi5 from ganzhi.py)
export const HIDDEN_STEMS: Record<string, HiddenStem[]> = {
    // 子: 癸 (8) - Note: Original python code has weights that don't always sum to 30, we keep proportional logic
    '子': [{ stem: '癸', days: 30 }],
    // 丑: 己(18), 癸(9), 辛(3) - Approximate from standard 18/9/3 or 18/8/4 or similar. Python code has 5/2/1. Let's use proportional 5:2:1
    '丑': [{ stem: '己', days: 18 }, { stem: '癸', days: 9 }, { stem: '辛', days: 3 }],
    // 寅: 甲(18), 丙(9), 戊(3) - Python has 5:2:1
    '寅': [{ stem: '甲', days: 18 }, { stem: '丙', days: 9 }, { stem: '戊', days: 3 }],
    '卯': [{ stem: '乙', days: 30 }],
    '辰': [{ stem: '戊', days: 18 }, { stem: '乙', days: 9 }, { stem: '癸', days: 3 }],
    '巳': [{ stem: '丙', days: 18 }, { stem: '戊', days: 9 }, { stem: '庚', days: 3 }],
    '午': [{ stem: '丁', days: 20 }, { stem: '己', days: 10 }], // Python has 5:3
    '未': [{ stem: '己', days: 18 }, { stem: '丁', days: 9 }, { stem: '乙', days: 3 }],
    '申': [{ stem: '庚', days: 18 }, { stem: '壬', days: 9 }, { stem: '戊', days: 3 }],
    '酉': [{ stem: '辛', days: 30 }],
    '戌': [{ stem: '戊', days: 18 }, { stem: '辛', days: 9 }, { stem: '丁', days: 3 }],
    '亥': [{ stem: '壬', days: 20 }, { stem: '甲', days: 10 }], // Python has 5:3
};

// Ten Deities Mapping (Based on Relationship to Day Master)
// Key: Day Master's Element + Polarity vs Target's Element + Polarity
// Format: [Master Element][Target Element][Master Polarity][Target Polarity] -> Deity Name
// Actually, it's easier to map based on the 10 Stems directly like the python code.

const TEN_DEITIES_MAP: Record<string, Record<string, string>> = {
    '甲': { '甲': '比', '乙': '劫', '丙': '食', '丁': '伤', '戊': '才', '己': '财', '庚': '杀', '辛': '官', '壬': '枭', '癸': '印' },
    '乙': { '甲': '劫', '乙': '比', '丙': '伤', '丁': '食', '戊': '财', '己': '才', '庚': '官', '辛': '杀', '壬': '印', '癸': '枭' },
    '丙': { '丙': '比', '丁': '劫', '戊': '食', '己': '伤', '庚': '才', '辛': '财', '壬': '杀', '癸': '官', '甲': '枭', '乙': '印' },
    '丁': { '丙': '劫', '丁': '比', '戊': '伤', '己': '食', '庚': '财', '辛': '才', '壬': '官', '癸': '杀', '甲': '印', '乙': '枭' },
    '戊': { '戊': '比', '己': '劫', '庚': '食', '辛': '伤', '壬': '才', '癸': '财', '甲': '杀', '乙': '官', '丙': '枭', '丁': '印' },
    '己': { '戊': '劫', '己': '比', '庚': '伤', '辛': '食', '壬': '财', '癸': '才', '甲': '官', '乙': '杀', '丙': '印', '丁': '枭' },
    '庚': { '庚': '比', '辛': '劫', '壬': '食', '癸': '伤', '甲': '才', '乙': '财', '丙': '杀', '丁': '官', '戊': '枭', '己': '印' },
    '辛': { '庚': '劫', '辛': '比', '壬': '伤', '癸': '食', '甲': '财', '乙': '才', '丙': '官', '丁': '杀', '戊': '印', '己': '枭' },
    '壬': { '壬': '比', '癸': '劫', '甲': '食', '乙': '伤', '丙': '才', '丁': '财', '戊': '杀', '己': '官', '庚': '枭', '辛': '印' },
    '癸': { '壬': '劫', '癸': '比', '甲': '伤', '乙': '食', '丙': '财', '丁': '才', '戊': '官', '己': '杀', '庚': '印', '辛': '枭' },
};

export const DEITY_FULL_NAMES: Record<string, string> = {
    '比': 'Internal Equilibrium (比)',
    '劫': 'Resonance Impact (劫)',
    '食': 'Cognitive Fluidity (食)',
    '伤': 'Systemic Innovation (伤)',
    '才': 'Strategic Agility (才)',
    '财': 'Resource Scaling (财)',
    '杀': 'Asymmetric Conquering (杀)',
    '官': 'Foundational Logic (官)',
    '枭': 'Transcendental Insight (枭)',
    '印': 'Hierarchical Mastery (印)',
};

/**
 * Calculates the Ten Deity (Shi Shen) for a target Stem relative to the Day Master.
 * @param dayMaster The Day Master Chinese Character (e.g., '甲')
 * @param targetStem The Target Stem Chinese Character (e.g., '乙')
 * @returns Short name of the deity (e.g., '劫')
 */
export const calculateDeity = (dayMaster: string, targetStem: string): string => {
    if (!dayMaster || !targetStem) return '';
    const map = TEN_DEITIES_MAP[dayMaster];
    if (!map) return '';
    return map[targetStem] || '';
};

/**
 * Retrieves the hidden stems for a given branch.
 * @param branchChar The Branch Chinese Character (e.g., '子')
 * @returns Array of hidden stems with their weights
 */
export const getHiddenStemsForBranch = (branchChar: string): HiddenStem[] => {
    return HIDDEN_STEMS[branchChar] || [];
};
