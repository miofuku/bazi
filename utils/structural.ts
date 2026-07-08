import { BaziChart, ElementType, Pillar, Favor } from '../types';
import { STEMS, BRANCHES } from './constants';

// Phase 6 — structural interactions between a time pillar (大运/流年) and the
// natal chart: 天克地冲 (反吟), 六冲, 六合/半合. These modulate the raw element
// favorability: a 忌 that gets 合去 is milder; a 用神 whose root is 冲 is worse;
// 天克地冲 the 提纲/日柱 is a jolt regardless of element. Grounded in
// docs/dangerousdayun.md (rules 11–12 名 天克地冲 as the danger marker).

const SIX_CHONG: Record<string, string> = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅',
  卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
};

// 六合 → combined element.
const SIX_HE: Record<string, [string, ElementType]> = {
  子: ['丑', ElementType.EARTH], 丑: ['子', ElementType.EARTH],
  寅: ['亥', ElementType.WOOD], 亥: ['寅', ElementType.WOOD],
  卯: ['戌', ElementType.FIRE], 戌: ['卯', ElementType.FIRE],
  辰: ['酉', ElementType.METAL], 酉: ['辰', ElementType.METAL],
  巳: ['申', ElementType.WATER], 申: ['巳', ElementType.WATER],
  // 午未 合而不化 — omitted (no clean 化神).
};

// 三合局 & 三会方 trios → element. A full trio (target + two natal) is stronger
// than a 半合 and supersedes it.
const TRIOS: { branches: string[]; el: ElementType; name: string }[] = [
  { branches: ['寅', '卯', '辰'], el: ElementType.WOOD, name: '三会木' },
  { branches: ['巳', '午', '未'], el: ElementType.FIRE, name: '三会火' },
  { branches: ['申', '酉', '戌'], el: ElementType.METAL, name: '三会金' },
  { branches: ['亥', '子', '丑'], el: ElementType.WATER, name: '三会水' },
  { branches: ['申', '子', '辰'], el: ElementType.WATER, name: '三合水' },
  { branches: ['亥', '卯', '未'], el: ElementType.WOOD, name: '三合木' },
  { branches: ['寅', '午', '戌'], el: ElementType.FIRE, name: '三合火' },
  { branches: ['巳', '酉', '丑'], el: ElementType.METAL, name: '三合金' },
];

// 半合 pairs (target + one natal branch) → local element.
const HALF_HE: Record<string, [string, ElementType][]> = {
  申: [['子', ElementType.WATER], ['辰', ElementType.WATER]],
  子: [['申', ElementType.WATER], ['辰', ElementType.WATER]],
  辰: [['申', ElementType.WATER], ['子', ElementType.WATER]],
  亥: [['卯', ElementType.WOOD], ['未', ElementType.WOOD]],
  卯: [['亥', ElementType.WOOD], ['未', ElementType.WOOD]],
  未: [['亥', ElementType.WOOD], ['卯', ElementType.WOOD]],
  寅: [['午', ElementType.FIRE], ['戌', ElementType.FIRE]],
  午: [['寅', ElementType.FIRE], ['戌', ElementType.FIRE]],
  戌: [['寅', ElementType.FIRE], ['午', ElementType.FIRE]],
  巳: [['酉', ElementType.METAL], ['丑', ElementType.METAL]],
  酉: [['巳', ElementType.METAL], ['丑', ElementType.METAL]],
  丑: [['巳', ElementType.METAL], ['酉', ElementType.METAL]],
};

// 相刑 / 相害 (data: 十二地支關係表, zm-sz.kvov.com/sswzx.php?id=5323333666655550379).
const SAN_XING: string[][] = [['寅', '巳', '申'], ['丑', '戌', '未']]; // 无恩之刑 / 持势之刑
const ZI_MAO = ['子', '卯'];                                          // 无礼之刑
const SELF_XING = ['辰', '午', '酉', '亥'];                            // 自刑
const LIU_HAI: Record<string, string> = {
  子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅',
  卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉',
};

const CONTROLS: Record<ElementType, ElementType> = {
  [ElementType.WOOD]: ElementType.EARTH, [ElementType.EARTH]: ElementType.WATER,
  [ElementType.WATER]: ElementType.FIRE, [ElementType.FIRE]: ElementType.METAL,
  [ElementType.METAL]: ElementType.WOOD,
};
const stemKe = (a: ElementType, b: ElementType) => CONTROLS[a] === b || CONTROLS[b] === a;

const FW: Record<Favor, number> = { favorable: 1, neutral: 0, unfavorable: -1 };
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export interface StructuralResult {
  delta: number;       // favor adjustment, roughly [−0.6, +0.4]
  events: string[];    // human-readable interaction notes
}

// mainQi element of a branch (first hidden stem).
const mainQi = (branchChar: string): ElementType =>
  BRANCHES[branchChar]?.hiddenStems?.[0]?.element ?? BRANCHES[branchChar]?.element;

/**
 * Structural favor adjustment of `target` (a 大运/流年 pillar) against the natal
 * chart, given the person's 用忌 favor map.
 */
export const structuralFavor = (
  target: Pillar,
  chart: BaziChart,
  favor: Record<ElementType, Favor>,
): StructuralResult => {
  const events: string[] = [];
  let delta = 0;

  const tStemEl = target.stem.element;
  const tBranch = target.branch.chinese;

  const natal: { pillar: Pillar; label: string; weight: number }[] = [
    { pillar: chart.yearPillar, label: '年柱', weight: 0.2 },
    { pillar: chart.monthPillar, label: '月柱(提纲)', weight: 0.35 },
    { pillar: chart.dayPillar, label: '日柱', weight: 0.35 },
    { pillar: chart.hourPillar, label: '时柱', weight: 0.15 },
  ].filter((n) => n.pillar); // hour absent when the birth time is unknown

  const natalBranches = natal.map((n) => n.pillar.branch.chinese);

  // Combination first: 三会/三合 局 (target + two natal) supersedes 半合, which
  // supersedes 六合. A full 局 also *binds* the target branch — 贪合忘冲/刑/害
  // (docs/hechong.md): a branch committed to a 三合/三会 局 releases its 冲/刑/害
  // on others (user-validated: 寅卯辰三会 → no 卯辰相害). 半合/六合 力弱, don't bind.
  const trio = TRIOS.find((t) => {
    if (!t.branches.includes(tBranch)) return false;
    const others = [...t.branches];
    others.splice(others.indexOf(tBranch), 1);
    return others.every((b) => natalBranches.includes(b));
  });
  const half = (HALF_HE[tBranch] ?? []).find(([nb]) => natalBranches.includes(nb));
  const six = SIX_HE[tBranch] && natalBranches.includes(SIX_HE[tBranch][0]) ? SIX_HE[tBranch] : null;
  const bound = !!trio; // only a full 局 truly 牵绊 the branch (贪合忘冲)

  if (trio) {
    delta += FW[favor[trio.el]] * 0.3;
    events.push(`${trio.branches.join('')}${trio.name}${favor[trio.el] === 'favorable' ? '(用神局)' : favor[trio.el] === 'unfavorable' ? '(忌局)' : ''}`);
  } else if (half) {
    delta += FW[favor[half[1]]] * 0.2;
    events.push(`${tBranch}${half[0]}半合${favor[half[1]] === 'favorable' ? '用神局' : favor[half[1]] === 'unfavorable' ? '忌局' : ''}`);
  } else if (six) {
    delta += FW[favor[six[1]]] * 0.2;
    events.push(`${tBranch}${six[0]}合${favor[six[1]] === 'favorable' ? '起用神' : favor[six[1]] === 'unfavorable' ? '化忌' : ''}`);
  }

  // Disruptive interactions (天克地冲 / 冲 / 刑 / 害) — all released when the target
  // is 贪合 (bound in a full 局). Otherwise scored here.
  if (!bound) {
    // 天克地冲 with a natal pillar — a jolt (反吟), negative by position weight.
    for (const n of natal) {
      const chong = SIX_CHONG[tBranch] === n.pillar.branch.chinese;
      const ke = stemKe(tStemEl, n.pillar.stem.element);
      if (chong && ke) { delta -= n.weight; events.push(`天克地冲${n.label}`); }
    }

    // Branch 冲 with each natal branch (unique — a repeated branch is one root,
    // not two; the per-pillar jolt is already counted in 天克地冲 above).
    for (const nb of [...new Set(natalBranches)]) {
      if (SIX_CHONG[tBranch] === nb) {
        const el = mainQi(nb);
        if (favor[el] === 'favorable') { delta -= 0.2; events.push(`冲动${nb}中用神根`); }
        else if (favor[el] === 'unfavorable') { delta += 0.1; events.push(`冲开${nb}中忌`); }
      }
    }

    // 三刑 / 自刑 / 六害 — disruption (伤灾/是非/官非). Pairs that are actually 六冲
    // (寅申, 丑未) belong to 冲 above, not 刑, so they're excluded here.
    for (const trioX of SAN_XING) {
      if (!trioX.includes(tBranch)) continue;
      const others = trioX.filter((b) => b !== tBranch);
      const present = others.filter((b) => natalBranches.includes(b) && SIX_CHONG[tBranch] !== b);
      if (others.every((b) => natalBranches.includes(b))) { delta -= 0.25; events.push(`${trioX.join('')}三刑`); }
      else if (present.length) { delta -= 0.12; events.push(`${tBranch}${present[0]}相刑`); }
    }
    if (ZI_MAO.includes(tBranch)) {
      const other = ZI_MAO.find((b) => b !== tBranch)!;
      if (natalBranches.includes(other)) { delta -= 0.12; events.push(`${tBranch}${other}相刑`); }
    }
    if (SELF_XING.includes(tBranch) && natalBranches.includes(tBranch)) {
      delta -= 0.1; events.push(`${tBranch}${tBranch}自刑`);
    }
    const hai = LIU_HAI[tBranch];
    if (hai && natalBranches.includes(hai) && SIX_CHONG[tBranch] !== hai && !events.some((e) => e.includes(`${tBranch}${hai}相刑`) || e.includes(`${hai}${tBranch}相刑`))) {
      delta -= 0.1; events.push(`${tBranch}${hai}相害`);
    }
  }

  return { delta: clamp(delta, -0.6, 0.4), events };
};
