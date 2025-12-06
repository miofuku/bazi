import { ElementType, Stem, Branch } from '../types';
import { STEMS, BRANCHES } from './constants';

// Weight definitions extracted from bazi.py / ganzhi.py
const GAN_SCORE = 5;

// Hidden stem weights for Earthly Branches (Zhi)
// Based on 'zhi5' dictionary in ganzhi.py
const ZHI_WEIGHTS: Record<string, Record<string, number>> = {
    '子': { '癸': 8 },
    '丑': { '己': 5, '癸': 2, '辛': 1 },
    '寅': { '甲': 5, '丙': 2, '戊': 1 },
    '卯': { '乙': 8 },
    '辰': { '戊': 5, '乙': 2, '癸': 1 },
    '巳': { '丙': 5, '戊': 2, '庚': 1 },
    '午': { '丁': 5, '己': 3 },
    '未': { '己': 5, '丁': 2, '乙': 1 },
    '申': { '庚': 5, '壬': 2, '戊': 1 },
    '酉': { '辛': 8 },
    '戌': { '戊': 5, '辛': 2, '丁': 1 },
    '亥': { '壬': 5, '甲': 3 }
};

export const calculateFiveElementScores = (
    yearStem: Stem, yearBranch: Branch,
    monthStem: Stem, monthBranch: Branch,
    dayStem: Stem, dayBranch: Branch,
    hourStem: Stem, hourBranch: Branch
): Record<ElementType, number> => {
    const scores: Record<ElementType, number> = {
        [ElementType.WOOD]: 0,
        [ElementType.FIRE]: 0,
        [ElementType.EARTH]: 0,
        [ElementType.METAL]: 0,
        [ElementType.WATER]: 0,
    };

    const stems = [yearStem, monthStem, dayStem, hourStem];
    const branches = [yearBranch, monthBranch, dayBranch, hourBranch];

    // 1. Calculate Stem Scores
    stems.forEach(stem => {
        scores[stem.element] += GAN_SCORE;
    });

    // 2. Calculate Branch Scores (based on hidden stems)
    branches.forEach(branch => {
        const weights = ZHI_WEIGHTS[branch.chinese];
        if (weights) {
            Object.entries(weights).forEach(([stemChar, weight]) => {
                const stem = STEMS[stemChar];
                if (stem) {
                    scores[stem.element] += weight;
                }
            });
        }
    });

    return scores;
};
