// 十二长生 — the day master's life-phase in a branch, and whether that phase
// suits the person's stage of life. 经云「老怕帝旺，少怕衰，中年最怕死绝胎」:
// youth wants waxing (长生→冠带), midlife wants peak (临官/帝旺), old age wants
// waning (衰病死墓) — an old person hitting 帝旺 is 昙花一现, a false flourish.
// 古法 阳顺阴逆 (乙木长生在午).

const STAGES = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'] as const;
export type LifeStage = (typeof STAGES)[number];

const BR = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// day stem → 长生 branch index + direction (阳顺 +1 / 阴逆 −1).
const START: Record<string, { i: number; dir: 1 | -1 }> = {
  甲: { i: 11, dir: 1 }, 丙: { i: 2, dir: 1 }, 戊: { i: 2, dir: 1 }, 庚: { i: 5, dir: 1 }, 壬: { i: 8, dir: 1 },
  乙: { i: 6, dir: -1 }, 丁: { i: 9, dir: -1 }, 己: { i: 9, dir: -1 }, 辛: { i: 0, dir: -1 }, 癸: { i: 3, dir: -1 },
};

export const stageOf = (dayStem: string, branchChar: string): LifeStage => {
  const s = START[dayStem];
  const b = BR.indexOf(branchChar);
  const steps = ((((b - s.i) * s.dir) % 12) + 12) % 12;
  return STAGES[steps];
};

// How well a 长生 phase suits a life period, −1..1. Encodes the classic rule.
const MATCH: Record<'youth' | 'mid' | 'old', Record<LifeStage, number>> = {
  youth: { 长生: 1, 沐浴: 0.6, 冠带: 0.8, 临官: 0.5, 帝旺: 0.2, 衰: -0.6, 病: -0.4, 死: -1, 墓: -1, 绝: -0.6, 胎: -0.3, 养: 0.4 },
  mid: { 长生: 0.5, 沐浴: 0.1, 冠带: 0.4, 临官: 1, 帝旺: 1, 衰: -0.3, 病: -0.5, 死: -1, 墓: -0.9, 绝: -0.9, 胎: -0.7, 养: -0.1 },
  old: { 长生: -0.4, 沐浴: -0.1, 冠带: -0.2, 临官: -1, 帝旺: -1, 衰: 0.5, 病: 0.3, 死: 0.1, 墓: 0.2, 绝: 0.1, 胎: 0.3, 养: 0.5 },
};

const periodOf = (startAge: number): 'youth' | 'mid' | 'old' =>
  startAge < 30 ? 'youth' : startAge >= 58 ? 'old' : 'mid';

// The day master's phase in a 大运 branch scored against the life period it falls in.
export const vitalityMatch = (dayStem: string, branchChar: string, startAge: number): number =>
  MATCH[periodOf(startAge)][stageOf(dayStem, branchChar)];
