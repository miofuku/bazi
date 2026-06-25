import { BaziChart, ElementType } from '../../types';
import { StemChar, BranchChar, ThriveNeed, StemImageProfile, SeasonalModifier } from './types';
import { STEM_PROFILES } from './stems';
import { resolveSeasonalModifier } from './seasons';

export * from './types';
export { STEM_PROFILES } from './stems';
export { BRANCH_SEASON } from './seasons';

// A need scored against the actual chart: is the element that supplies it
// already abundant, present, or scarce in this person's makeup?
export interface NeedStatus {
  need: ThriveNeed;
  status: 'abundant' | 'present' | 'scarce';
  share: number; // 0–1 share of this element among all five
}

export interface XiangfaReading {
  stem: StemImageProfile;
  season: SeasonalModifier;
  // needs reordered so the season's emphasized needs come first
  prioritizedNeeds: ThriveNeed[];
  needStatus: NeedStatus[];
  // element climate, read from the chart's element scores
  elementShare: Record<ElementType, number>; // 0–1 per element
  dominantElement: ElementType;
  weakestElement: ElementType;
}

// Below this share of the whole, an element (and the need it supplies) is
// "scarce" — the actionable "what would help you grow". Above the upper bound it
// is "abundant". Even split across five elements is 0.20.
const SCARCE_BELOW = 0.12;
const ABUNDANT_ABOVE = 0.30;

const elementShares = (chart: BaziChart): Record<ElementType, number> => {
  const scores = chart.elementScores ?? chart.elementCounts;
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  return {
    [ElementType.WOOD]: scores[ElementType.WOOD] / total,
    [ElementType.FIRE]: scores[ElementType.FIRE] / total,
    [ElementType.EARTH]: scores[ElementType.EARTH] / total,
    [ElementType.METAL]: scores[ElementType.METAL] / total,
    [ElementType.WATER]: scores[ElementType.WATER] / total,
  };
};

export function buildXiangfaReading(chart: BaziChart): XiangfaReading {
  const stemChar = chart.dayMaster.chinese as StemChar;
  const branchChar = chart.monthPillar.branch.chinese as BranchChar;

  const stem = STEM_PROFILES[stemChar];
  const season = resolveSeasonalModifier(stemChar, branchChar);
  const share = elementShares(chart);

  // Reorder needs so the season's emphasized ones lead.
  const emphasized = new Set(season.emphasizedNeedIds);
  const prioritizedNeeds = [...stem.needs].sort((a, b) => {
    const ae = emphasized.has(a.id) ? 0 : 1;
    const be = emphasized.has(b.id) ? 0 : 1;
    return ae - be;
  });

  const needStatus: NeedStatus[] = prioritizedNeeds.map((need) => {
    const s = share[need.element];
    const status: NeedStatus['status'] =
      s < SCARCE_BELOW ? 'scarce' : s > ABUNDANT_ABOVE ? 'abundant' : 'present';
    return { need, status, share: s };
  });

  const ordered = (Object.entries(share) as [ElementType, number][]).sort((a, b) => b[1] - a[1]);
  const dominantElement = ordered[0][0];
  const weakestElement = ordered[ordered.length - 1][0];

  return {
    stem,
    season,
    prioritizedNeeds,
    needStatus,
    elementShare: share,
    dominantElement,
    weakestElement,
  };
}
