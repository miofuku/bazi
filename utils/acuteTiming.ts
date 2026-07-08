import { BaziChart, Pillar, ElementType } from '../types';
import { stageOf, LifeStage } from './twelveStage';
import { pillarFavor } from './timeFavor';

// 应期精修 — an acute-danger score for a specific 流年, given the active 大运.
// Grounded in docs/dangerousdayun.md: the day master's 十二长生 配伍 across 大运×流年
// (弱命 死墓绝, 强命 旺禄生 — rules 1–6), 天克地冲 日/年/月柱 (rules 11–12), 岁运并临,
// and 仇忌冒头 (rule 10). This is the layer that turns broad 顺涩 into acute years —
// still fuzzy (external accidents may not show), so it's a RANKING signal, not a verdict.

const SIX_CHONG: Record<string, string> = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅',
  卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
};
const CONTROLS: Record<ElementType, ElementType> = {
  [ElementType.WOOD]: ElementType.EARTH, [ElementType.EARTH]: ElementType.WATER,
  [ElementType.WATER]: ElementType.FIRE, [ElementType.FIRE]: ElementType.METAL,
  [ElementType.METAL]: ElementType.WOOD,
};
const stemKe = (a: ElementType, b: ElementType) => CONTROLS[a] === b || CONTROLS[b] === a;

// 天克地冲 (反吟): stem 克 + branch 冲 between two pillars.
const fanyin = (a: Pillar, b: Pillar) =>
  stemKe(a.stem.element, b.stem.element) && SIX_CHONG[a.branch.chinese] === b.branch.chinese;

const DEATH_STAGES = new Set<LifeStage>(['死', '墓', '绝']);
const PEAK_STAGES = new Set<LifeStage>(['帝旺', '临官', '长生']);

export interface AcuteDanger {
  score: number;
  flags: string[];
}

export const acuteDanger = (chart: BaziChart, daYun: Pillar, liuNian: Pillar): AcuteDanger => {
  const dm = chart.dayPillar.stem.chinese;
  const cat = chart.strength?.category ?? 'balanced';
  const weak = cat === 'weak' || cat === 'follow-weak';
  const strong = cat === 'strong' || cat === 'follow-strong';
  const balanced = cat === 'balanced';

  let score = 0;
  const flags: string[] = [];

  // ── 十二长生 配伍 (rules 1–6): the day master's phase at 大运 AND 流年 ──
  const sDY = stageOf(dm, daYun.branch.chinese);
  const sLN = stageOf(dm, liuNian.branch.chinese);
  const bothDeath = DEATH_STAGES.has(sDY) && DEATH_STAGES.has(sLN);
  const bothPeak = PEAK_STAGES.has(sDY) && PEAK_STAGES.has(sLN);
  if (weak && bothDeath) {
    score += 2.5 + (sDY === '绝' || sLN === '绝' ? 0.5 : 0);
    flags.push(`弱命${sDY}${sLN}`);
  } else if (strong && bothPeak) {
    score += 2.5;
    flags.push(`强命${sDY}${sLN}`);
  } else if (balanced && (bothDeath || bothPeak)) {
    // a 中和 chart is destabilised by either extreme, but less acutely.
    score += 1.2;
    flags.push(`中和${sDY}${sLN}`);
  }

  // ── 天克地冲 日/年/月柱 (rules 11–12) ──
  if (fanyin(liuNian, chart.dayPillar)) { score += 2; flags.push('流年反吟日柱'); }
  if (fanyin(daYun, chart.dayPillar)) { score += 1.5; flags.push('大运反吟日柱'); }
  if (fanyin(liuNian, chart.yearPillar)) { score += 1; flags.push('流年反吟年柱'); }
  if (fanyin(liuNian, chart.monthPillar)) { score += 1; flags.push('流年反吟提纲'); }
  if (fanyin(daYun, chart.monthPillar)) { score += 1; flags.push('大运反吟提纲'); }

  // ── 岁运并临 / 岁运反吟 (大运 vs 流年) ──
  if (daYun.stem.chinese === liuNian.stem.chinese && daYun.branch.chinese === liuNian.branch.chinese) {
    score += 2; flags.push('岁运并临');
  } else if (fanyin(daYun, liuNian)) {
    score += 1.5; flags.push('岁运反吟');
  }

  // ── 仇忌冒头 (rule 10): 用神 deeply against in BOTH layers ──
  if (chart.yongshen) {
    const f = pillarFavor(chart.yongshen.favor, daYun) + pillarFavor(chart.yongshen.favor, liuNian);
    if (f <= -1.3) { score += 1; flags.push('用忌叠加'); }
  }

  return { score, flags };
};
