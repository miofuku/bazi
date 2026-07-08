import { ElementType } from '../types';

// 乘数法强度表 (docs/wangshuai.md 附录).
//
// Source: the 天干强度表 / 地支强度表 screenshots in docs/. The branch table
// is fully derivable: hidden-stem strength = base share × the element's month
// multiplier below. That derivation was used to cross-check every readable
// cell and to reconstruct the few cells hidden by watermark/cropping.
//
// One conflict between the two screenshots: the stem table shows Water in
// 申月 as 1.14, but three independent branch rows (子, 丑藏癸, 亥藏壬) all
// imply 1.2. The branch table wins: Water in 申月 = 1.2.

const { WOOD, FIRE, EARTH, METAL, WATER } = ElementType;

const MONTH_ORDER = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];

const byMonth = (values: number[]): Record<string, number> =>
  Object.fromEntries(MONTH_ORDER.map((b, i) => [b, values[i]]));

// Element strength multiplier by month branch (寅月..丑月).
export const STEM_MONTH_STRENGTH: Record<ElementType, Record<string, number>> = {
  //                寅     卯     辰     巳     午     未     申     酉     戌     亥     子     丑
  [WOOD]:  byMonth([1.14, 1.2,  1.1,  1.0,  1.0,  1.04, 1.06, 1.0,  1.0,  1.2,  1.2,  1.06]),
  [FIRE]:  byMonth([1.2,  1.2,  1.06, 1.14, 1.2,  1.1,  1.0,  1.0,  1.04, 1.0,  1.0,  1.0 ]),
  [EARTH]: byMonth([1.06, 1.0,  1.1,  1.14, 1.2,  1.16, 1.0,  1.0,  1.14, 1.0,  1.0,  1.1 ]),
  [METAL]: byMonth([1.0,  1.0,  1.1,  1.06, 1.0,  1.1,  1.14, 1.2,  1.16, 1.0,  1.0,  1.14]),
  [WATER]: byMonth([1.0,  1.0,  1.04, 1.06, 1.0,  1.0,  1.2,  1.2,  1.06, 1.14, 1.2,  1.1 ]),
};

// Hidden-stem base shares from the book's branch table. Kept for reference /
// comparison: this system drops the Earth hidden stems (寅巳申中的戊, 午中的己),
// which validation charts showed undercounts Earth support (see checkStrength).
export const TABLE_HIDDEN_WEIGHTS: Record<string, Record<string, number>> = {
  '子': { '癸': 1.0 },
  '丑': { '己': 0.5, '癸': 0.3, '辛': 0.2 },
  '寅': { '甲': 0.7, '丙': 0.3 },
  '卯': { '乙': 1.0 },
  '辰': { '戊': 0.5, '乙': 0.3, '癸': 0.2 },
  '巳': { '丙': 0.7, '庚': 0.3 },
  '午': { '丁': 1.0 },
  '未': { '己': 0.5, '丁': 0.3, '乙': 0.2 },
  '申': { '庚': 0.7, '壬': 0.3 },
  '酉': { '辛': 1.0 },
  '戌': { '戊': 0.5, '辛': 0.3, '丁': 0.2 },
  '亥': { '壬': 0.7, '甲': 0.3 },
};

// Active weights: bazi.py's zhi5 (same source as FiveElementScorer), normalized
// by its constant row sum of 8. Unlike the book table it keeps every hidden
// stem, notably the Earth ones the book drops.
import { ZHI_WEIGHTS } from './FiveElementScorer';

export const STRENGTH_HIDDEN_WEIGHTS: Record<string, Record<string, number>> =
  Object.fromEntries(
    Object.entries(ZHI_WEIGHTS).map(([branch, stems]) => [
      branch,
      Object.fromEntries(Object.entries(stems).map(([s, w]) => [s, w / 8])),
    ]),
  );
