import { BaziChart, Stem, Branch, ElementType } from '../types';
import { BAZI_STRUCTURES, StructureResult } from './structures';

/**
 * Counts the occurrences of Ten Deities (Shi Shen) in the chart
 * Focuses on visible stems (Year, Month, Hour) and Branch Main Qi
 * Day Master is excluded from the count of deities
 */
const countDeities = (chart: BaziChart): Record<string, number> => {
    const counts: Record<string, number> = {};

    const processDeity = (deity: string | undefined) => {
        if (!deity) return;
        counts[deity] = (counts[deity] || 0) + 1;
    };

    // Stems: Year, Month, Hour
    processDeity(chart.yearPillar.stem.deity);
    processDeity(chart.monthPillar.stem.deity);
    processDeity(chart.hourPillar.stem.deity);

    // Branches: Main Qi (represented by the deity field on the branch)
    // Note: branch.deity is set to the Main Qi deity in baziService
    processDeity(chart.yearPillar.branch.deity);
    processDeity(chart.monthPillar.branch.deity);
    processDeity(chart.dayPillar.branch.deity); // Day Branch controls marriage/inner self, valid for structure
    processDeity(chart.hourPillar.branch.deity);

    return counts;
};

export const mapChartToStructure = (chart: BaziChart): StructureResult => {
    const counts = countDeities(chart);
    const elements = chart.elementCounts;
    const dayMasterElement = chart.dayMaster.element;

    // 1. Check for SPECIAL FLOWS (Intensity & Flow)
    // Zhuan Wang (Dominant): Self element is extremely strong (e.g. > 50% or > 4 count)
    // Cong Ge (Follow): Self element is extremely weak, another is dominant
    const totalElements = Object.values(elements).reduce((a, b) => a + b, 0);
    const selfStrength = elements[dayMasterElement] || 0;

    // Simple heuristic for domination: > 50% of chart
    if (selfStrength / totalElements > 0.6) {
        return BAZI_STRUCTURES['ZhuanWang'];
    }

    // Heuristic for Follow: Very weak (< 10%)
    if (selfStrength / totalElements < 0.15) {
        return BAZI_STRUCTURES['CongGe'];
    }

    // 2. Check for CREATORS & BUILDERS (Output + Wealth)
    // Eating God (食神) or Hurting Officer (伤官) + Wealth (正财/偏财)
    const outputCount = (counts['食神'] || 0) + (counts['伤官'] || 0);
    const wealthCount = (counts['正财'] || 0) + (counts['偏财'] || 0);

    if (outputCount >= 2 && wealthCount >= 1) {
        // Distinguish between Eating God and Hurting Officer dominance
        if ((counts['伤官'] || 0) > (counts['食神'] || 0)) {
            return BAZI_STRUCTURES['ShangGuanShengCai']; // Disruptive
        } else {
            return BAZI_STRUCTURES['ShiShenShengCai']; // Creative
        }
    }

    // 3. Check for LEADERS & STRATEGISTS (Power + Resource)
    // Officer (正官) or Seven Killings (七杀) + Resource (正印/偏印)
    const powerCount = (counts['正官'] || 0) + (counts['七杀'] || 0);
    const resourceCount = (counts['正印'] || 0) + (counts['偏印'] || 0);

    if (powerCount >= 2 && resourceCount >= 1) {
        if ((counts['七杀'] || 0) > (counts['正官'] || 0)) {
            return BAZI_STRUCTURES['ShaYinXiangSheng']; // Iron Strategist
        } else {
            return BAZI_STRUCTURES['GuanYinXiangSheng']; // Architect of Order
        }
    }

    // 4. Check for SOLVERS (Output + Power/Resource interaction)
    // Eating God Controlling Killing (ShiShenZhiSha) -> Output + 7K
    if ((counts['食神'] || 0) >= 1 && (counts['七杀'] || 0) >= 1) {
        return BAZI_STRUCTURES['ShiShenZhiSha'];
    }

    // Hurting Officer Paired with Resource (ShangGuanPeiYin) -> HO + Resource
    if ((counts['伤官'] || 0) >= 1 && resourceCount >= 1) {
        return BAZI_STRUCTURES['ShangGuanPeiYin'];
    }

    // 5. Fallback: Determine based on Strongest Deity
    // Find the max count
    let maxDeity = '';
    let maxCount = 0;

    for (const [deity, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count;
            maxDeity = deity;
        }
    }

    // Map dominant deity to a structure if no complex pattern found
    switch (maxDeity) {
        case '食神': return BAZI_STRUCTURES['ShiShenShengCai'];
        case '伤官': return BAZI_STRUCTURES['ShangGuanShengCai'];
        case '正财':
        case '偏财': return BAZI_STRUCTURES['ShiShenShengCai']; // Wealth dominant -> Creative/Business
        case '正官': return BAZI_STRUCTURES['GuanYinXiangSheng'];
        case '七杀': return BAZI_STRUCTURES['ShaYinXiangSheng'];
        case '正印':
        case '偏印': return BAZI_STRUCTURES['GuanYinXiangSheng']; // Resource dominant -> Leader/Thinker
        default: return BAZI_STRUCTURES['ShiShenShengCai']; // Safe default (Creative)
    }
};
