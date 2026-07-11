import { ElementType, Polarity, Pillar, StrengthCategory, StrengthReading } from '../types';
import { STEMS } from './constants';
import { STEM_MONTH_STRENGTH, STRENGTH_HIDDEN_WEIGHTS } from './strengthTables';

// Day-master strength (日干旺衰) via the multiplier method — docs/wangshuai.md.
//
// Every stem contributes its element's month multiplier; every hidden stem
// contributes base share × month multiplier. 同党 = the day master's element
// plus the element that generates it (印). Thresholds follow wangshuai.md §二.6
// (同党 share of the whole): >52% strong, 48–52% balanced, otherwise weak.
//
// 从格 (following) is decided structurally, not by percentage alone: per
// wangshuai.md §一, 从弱 requires the day master's roots to be uprooted
// (猛冲二次以上). 六冲 between branches weakens them, and a root clashed twice
// is treated as uprooted; a rootless, unsupported day master then follows.

const GENERATED_BY: Record<ElementType, ElementType> = {
  [ElementType.WOOD]: ElementType.WATER,
  [ElementType.FIRE]: ElementType.WOOD,
  [ElementType.EARTH]: ElementType.FIRE,
  [ElementType.METAL]: ElementType.EARTH,
  [ElementType.WATER]: ElementType.METAL,
};

// 地支六冲.
const SIX_CHONG: Record<string, string> = {
  '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳',
};

// 冲 reduction by distance between pillars, split into 主冲 (active, lighter) and
// 被冲 (passive, heavier). The weaker branch is the 被冲 side — 旺者冲衰衰者拔.
const CHONG_FACTORS: Record<number, { active: number; passive: number }> = {
  1: { active: 0.30, passive: 0.70 }, // 临支
  2: { active: 0.15, passive: 0.35 }, // 隔支
  3: { active: 0.075, passive: 0.175 }, // 远支
};

const UPROOT_REDUCTION = 0.85; // a root reduced this much (≈ two clashes) is 拔
const FOLLOW_WEAK_SHARE = 0.3; // rootless day master under this 同党 share 从弱
const PENG_CHONG_SCALE = 0.35; // 辰戌丑未 朋冲 — same-earth clash stirs, not destroys

// 天干五合 + 化神 — used for the 合绊破从 gate below.
const STEM_HE: Record<string, string> = {
  '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙',
  '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊',
};
const STEM_HE_HUA: Record<string, ElementType> = {
  '甲': ElementType.EARTH, '己': ElementType.EARTH,
  '乙': ElementType.METAL, '庚': ElementType.METAL,
  '丙': ElementType.WATER, '辛': ElementType.WATER,
  '丁': ElementType.WOOD, '壬': ElementType.WOOD,
  '戊': ElementType.FIRE, '癸': ElementType.FIRE,
};

const emptyScores = (): Record<ElementType, number> => ({
  [ElementType.WOOD]: 0,
  [ElementType.FIRE]: 0,
  [ElementType.EARTH]: 0,
  [ElementType.METAL]: 0,
  [ElementType.WATER]: 0,
});

// 司令 weight: the month branch's ruling hidden stem holds 月令司权, so it acts
// roughly as strong as a heavenly stem (base 1) plus a margin, rather than as a
// buried hidden stem. Applied only when the ruling stem is known (needs a date).
const SILING_WEIGHT = 1.2;

interface HiddenContribution {
  branchIndex: number;
  stemChar: string;
  element: ElementType;
  power: number; // after 司令, before 冲
}

export const calculateStrength = (
  yearPillar: Pillar,
  monthPillar: Pillar,
  dayPillar: Pillar,
  hourPillar: Pillar | null, // null when the birth hour is unknown → read from 三柱
  rulingStem?: string, // 司令 hidden stem of the month branch (from getRulingStem)
): StrengthReading => {
  const monthBranch = monthPillar.branch.chinese;
  const monthFactor = (el: ElementType) => STEM_MONTH_STRENGTH[el][monthBranch] ?? 1.0;

  // Order preserved (year=0, month=1, day=2); hour dropped when unknown.
  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar].filter(
    (p): p is Pillar => p !== null,
  );
  const n = pillars.length;
  const monthIndex = 1;

  // ── pass 1: base power per stem and per hidden stem (with 司令) ──────────────
  const power = emptyScores();
  const hiddenByBranch: HiddenContribution[][] = Array.from({ length: n }, () => []);
  const branchPower = new Array(n).fill(0); // total hidden power per branch, for 冲 direction

  pillars.forEach((p, i) => {
    power[p.stem.element] += monthFactor(p.stem.element);

    const hidden = STRENGTH_HIDDEN_WEIGHTS[p.branch.chinese] ?? {};
    Object.entries(hidden).forEach(([stemChar, base]) => {
      const el = STEMS[stemChar].element;
      const inCommand = i === monthIndex && rulingStem === stemChar;
      const weight = inCommand ? SILING_WEIGHT : base;
      const hp = weight * monthFactor(el);
      power[el] += hp;
      hiddenByBranch[i].push({ branchIndex: i, stemChar, element: el, power: hp });
      branchPower[i] += hp;
    });
  });

  // ── pass 2: 六冲 reduces clashed branches; track uprooting ───────────────────
  const reduction = new Array(n).fill(0);
  const passiveClashes = new Array(n).fill(0); // times this branch is the 被冲 (heavier) side
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (SIX_CHONG[pillars[i].branch.chinese] !== pillars[j].branch.chinese) continue;
      const f = CHONG_FACTORS[j - i];
      const iWeaker = branchPower[i] <= branchPower[j];
      // 辰戌丑未 同为土 = 朋冲: 同气相激、开库不摧根，削力远小于正冲，且不拔根。
      const pengChong =
        pillars[i].branch.element === ElementType.EARTH &&
        pillars[j].branch.element === ElementType.EARTH;
      const scale = pengChong ? PENG_CHONG_SCALE : 1;
      reduction[i] += (iWeaker ? f.passive : f.active) * scale;
      reduction[j] += (iWeaker ? f.active : f.passive) * scale;
      if (!pengChong) {
        if (iWeaker) passiveClashes[i]++;
        else passiveClashes[j]++;
      }
    }
  }

  hiddenByBranch.forEach((contribs, i) => {
    const keep = Math.max(0, 1 - reduction[i]);
    if (keep === 1) return;
    contribs.forEach((c) => {
      power[c.element] -= c.power * (1 - keep);
      c.power *= keep;
    });
  });

  // ── classify ────────────────────────────────────────────────────────────────
  const total = Object.values(power).reduce((a, b) => a + b, 0) || 1;
  const dayElement = dayPillar.stem.element;
  const resourceElement = GENERATED_BY[dayElement];
  const supportShare = (power[dayElement] + power[resourceElement]) / total;

  // A root = branch hidden stem of 比劫/印 (day or resource element). It is
  // living unless its branch is 拔 (clashed twice, or reduced past UPROOT).
  const rooted = hiddenByBranch.some((contribs, i) => {
    const uprooted = passiveClashes[i] >= 2 || reduction[i] >= UPROOT_REDUCTION;
    if (uprooted) return false;
    return contribs.some(
      (c) => c.power > 0 && (c.element === dayElement || c.element === resourceElement),
    );
  });

  const isYang = dayPillar.stem.polarity === Polarity.YANG;

  // 合绊破从: 从 means the day master abandons its own camp — but a day master
  // held in a 天干五合 that does NOT transform is 绊住 (tied), and 有情不从.
  //   · 争合 (two-plus stems contending for the day master) never transforms —
  //     the tie holds, follow is broken. Case #9 of docs/命理分析.csv
  //     (戊子戊午癸未戊午, 三戊争合癸) reads as plain weak in real life, while
  //     the structurally identical 命例四 (丙子甲午壬寅丙午, no 合) follows.
  //   · A clean 1-1 合 whose 化神 rules the month (化神当令) transforms — the
  //     day master goes WITH the dominant camp, so 从 stands (wangshuai's
  //     丙申 case: 丙辛合化水于子月 → still 从). Otherwise 合而不化 = tied.
  // Scoped to follow-WEAK only; same 争合/化 doctrine as the stem layer in
  // content/xiangfa/interactions.ts.
  const dayStemChar = dayPillar.stem.chinese;
  const partners = pillars.filter(
    (p, i) => i !== 2 && p.stem.chinese === STEM_HE[dayStemChar],
  ).length;
  const huaInCommand =
    STEM_HE_HUA[dayStemChar] === monthPillar.branch.element;
  const heldByCombine = partners >= 2 || (partners === 1 && !huaInCommand);

  let category: StrengthCategory;
  if (supportShare > (isYang ? 0.95 : 0.9)) category = 'follow-strong';
  else if (!rooted && !heldByCombine && supportShare < FOLLOW_WEAK_SHARE) category = 'follow-weak';
  else if (supportShare > 0.52) category = 'strong';
  else if (supportShare >= 0.48) category = 'balanced';
  else category = 'weak';

  return {
    elementPower: power,
    totalPower: total,
    dayElement,
    resourceElement,
    supportShare,
    rooted,
    category,
  };
};
