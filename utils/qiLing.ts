import { ElementType } from '../types';
import { STEMS } from './constants';

// 人元司令分野 — which hidden stem of the month branch is "in command" (司令)
// on a given day within the month. The month branch dominates strength
// assessment (月令司权), and its ruling stem shifts day by day: 余气 → 中气 →
// 本气. Classic 30-day day-counts (渊海子平 / 三命通会 常见版).
//
// Phases are listed in order from the start of the governing 节. daysIntoMonth
// is the 0-based offset from that 节.

interface Phase {
  stem: string;
  days: number;
}

const FENYE: Record<string, Phase[]> = {
  '寅': [{ stem: '戊', days: 7 }, { stem: '丙', days: 7 }, { stem: '甲', days: 16 }],
  '卯': [{ stem: '甲', days: 10 }, { stem: '乙', days: 20 }],
  '辰': [{ stem: '乙', days: 9 }, { stem: '癸', days: 3 }, { stem: '戊', days: 18 }],
  '巳': [{ stem: '戊', days: 7 }, { stem: '庚', days: 7 }, { stem: '丙', days: 16 }],
  '午': [{ stem: '丙', days: 10 }, { stem: '己', days: 9 }, { stem: '丁', days: 11 }],
  '未': [{ stem: '丁', days: 9 }, { stem: '乙', days: 3 }, { stem: '己', days: 18 }],
  '申': [{ stem: '戊', days: 7 }, { stem: '壬', days: 7 }, { stem: '庚', days: 16 }],
  '酉': [{ stem: '庚', days: 10 }, { stem: '辛', days: 20 }],
  '戌': [{ stem: '辛', days: 9 }, { stem: '丁', days: 3 }, { stem: '戊', days: 18 }],
  '亥': [{ stem: '戊', days: 7 }, { stem: '甲', days: 7 }, { stem: '壬', days: 16 }],
  '子': [{ stem: '壬', days: 10 }, { stem: '癸', days: 20 }],
  '丑': [{ stem: '癸', days: 9 }, { stem: '辛', days: 3 }, { stem: '己', days: 18 }],
};

export interface QiLing {
  stem: string;         // ruling hidden stem char
  element: ElementType; // its element
}

/**
 * The hidden stem of `monthBranch` in command on the given day.
 * daysIntoMonth is the 0-based day offset from the month's governing 节.
 * Days beyond the tabulated total fall to the last phase (本气).
 */
export const getRulingStem = (monthBranch: string, daysIntoMonth: number): QiLing | null => {
  const phases = FENYE[monthBranch];
  if (!phases) return null;

  let acc = 0;
  for (const p of phases) {
    acc += p.days;
    if (daysIntoMonth < acc) {
      return { stem: p.stem, element: STEMS[p.stem].element };
    }
  }
  const last = phases[phases.length - 1];
  return { stem: last.stem, element: STEMS[last.stem].element };
};
