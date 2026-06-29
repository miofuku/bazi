import { SolarTime } from 'tyme4ts';
import { BaziChart, Pillar, ElementType } from '../types';
import { STEMS, BRANCHES } from '../utils/constants';
import { calculateDeity } from '../utils/baziCalculator';
import {
  DEITY_TO_MODE,
  DAILY_MODES,
  DailyMode,
  DailyModeContent,
  Balance,
  balanceNote,
} from '../content/xiangfa/daily';

const SafeSolarTime = typeof SolarTime !== 'undefined' ? SolarTime : null;

// Same thresholds the main reading uses for scarce / abundant.
const SCARCE_BELOW = 0.12;
const ABUNDANT_ABOVE = 0.3;

export interface DailyReading {
  date: Date;
  dayPillar: Pillar;
  element: ElementType; // today's stem element
  deity: string;        // short 十神 char of today's stem vs the day master
  mode: DailyMode;
  content: DailyModeContent;
  balance: Balance;     // how much of today's element the person already carries
  balanceNote: string;
}

/**
 * The day pillar (GanZhi) for a given calendar day. Read at local noon so the
 * result is stable regardless of the early-morning 子时 boundary.
 */
export const getDayPillar = (date: Date): Pillar | null => {
  if (!SafeSolarTime) return null;
  try {
    const t = SafeSolarTime.fromYmdHms(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      12,
      0,
      0,
    );
    const ganZhi = t.getSixtyCycleHour().getSixtyCycleDay().getName();
    const stem = STEMS[ganZhi.charAt(0)];
    const branch = BRANCHES[ganZhi.charAt(1)];
    if (!stem || !branch) return null;
    return { stem, branch, name: 'Day' };
  } catch (e) {
    console.error('Failed to compute day pillar:', e);
    return null;
  }
};

const elementShareForChart = (chart: BaziChart, element: ElementType): number => {
  const scores = chart.elementScores ?? chart.elementCounts;
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  return scores[element] / total;
};

/**
 * Builds the daily suggestion for a person's chart on a given day. Keys off the
 * day pillar only: today's stem relative to the day master gives the mode, and
 * the person's share of today's element gives the balance note.
 */
export const buildDailyReading = (chart: BaziChart, date: Date): DailyReading | null => {
  const dayPillar = getDayPillar(date);
  if (!dayPillar) return null;

  const deity = calculateDeity(chart.dayMaster.chinese, dayPillar.stem.chinese);
  const mode = DEITY_TO_MODE[deity] ?? 'peer';
  const element = dayPillar.stem.element;

  const share = elementShareForChart(chart, element);
  const balance: Balance =
    share < SCARCE_BELOW ? 'scarce' : share > ABUNDANT_ABOVE ? 'abundant' : 'present';

  return {
    date,
    dayPillar,
    element,
    deity,
    mode,
    content: DAILY_MODES[mode],
    balance,
    balanceNote: balanceNote(balance, element),
  };
};
