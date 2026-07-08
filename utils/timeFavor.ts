import { ElementType, Favor, Pillar } from '../types';

// Favorability of a time-layer pillar (大运 / 流年 / 流月 / 流日) against a
// person's 用忌: does its 干支 supply 喜用 or 忌神? Stem weighted 2, branch 1.
// Range −1..1. The seed of Phase 3 (temporal 顺逆).

const FW: Record<Favor, number> = { favorable: 1, neutral: 0, unfavorable: -1 };

export const pillarFavor = (favor: Record<ElementType, Favor>, pillar: Pillar): number =>
  (FW[favor[pillar.stem.element]] * 2 + FW[favor[pillar.branch.element]] * 1) / 3;
