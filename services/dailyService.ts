import { SolarTime } from 'tyme4ts';
import { BaziChart, Pillar, ElementType, Favor } from '../types';
import { STEMS, BRANCHES } from '../utils/constants';
import { calculateDeity } from '../utils/baziCalculator';
import { pillarFavor } from '../utils/timeFavor';
import { structuralFavor } from '../utils/structural';
import { vitalityMatch } from '../utils/twelveStage';
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
  favor?: number;             // overall 顺涩 of the day, −1..1 (undefined if no 用神)
  structuralEvents?: string[];// the day pillar's 冲/合/刑/害 with the natal chart
  layers?: DayFavorLayers;    // the day / year / decade favor that compose `favor`
}

export interface DayFavorLayers {
  day: number;
  year: number;
  daYun: number;
}

export interface DayFavor {
  favor: number;
  structuralEvents: string[];
  layers: DayFavorLayers;
}

const clamp1 = (n: number) => Math.max(-1, Math.min(1, n));

// The 立春-based 流年 pillar for a date (八字 year rolls at 立春, not Jan 1).
const getYearPillar = (date: Date): Pillar | null => {
  if (!SafeSolarTime) return null;
  try {
    const hour = SafeSolarTime.fromYmdHms(
      date.getFullYear(), date.getMonth() + 1, date.getDate(), 12, 0, 0,
    ).getSixtyCycleHour();
    const gz = hour.getYear().getName();
    const stem = STEMS[gz.charAt(0)];
    const branch = BRANCHES[gz.charAt(1)];
    if (!stem || !branch) return null;
    return { stem, branch, name: 'Year' };
  } catch {
    return null;
  }
};

// The 大运 a calendar year falls in (same year-boundary rule as LifeSeasons).
const currentDaYun = (chart: BaziChart, year: number) => {
  const list = chart.daYun ?? [];
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    const next = list[i + 1];
    if (year >= c.year && (!next || year < next.year)) return c;
  }
  return null;
};

// The favor of one time pillar against the 用忌: element supply (pillarFavor) +
// structural 冲/合/刑/害 vs the natal chart. −1..1.
const timePillarFavor = (
  pillar: Pillar,
  chart: BaziChart,
  favor: Record<ElementType, Favor>,
) => clamp1(pillarFavor(favor, pillar) + structuralFavor(pillar, chart, favor).delta);

/**
 * The day's overall weather (顺涩) = climate-bounded weather. The 大运/流年 are the
 * CLIMATE, the 流日 the WEATHER: like an ice age where even summer is "less cold,"
 * a bad 大运 caps how high a good day can reach, and a good 大运 floors how low a
 * bad day can sink. Modeled as a weighted sum + clamp — the day contributes at most
 * ±0.4, so it can't overcome a deep climate, only shift within it. Returns the
 * blended `favor` plus the raw `day`/`year`/`daYun` layers. Null if no 用神.
 */
export const computeDayFavor = (chart: BaziChart, date: Date): DayFavor | null => {
  const favor = chart.yongshen?.favor;
  const dayPillar = getDayPillar(date);
  if (!favor || !dayPillar) return null;

  const dayStruct = structuralFavor(dayPillar, chart, favor);
  const day = clamp1(pillarFavor(favor, dayPillar) + dayStruct.delta);

  const yp = getYearPillar(date);
  const year = yp ? timePillarFavor(yp, chart, favor) : 0;

  const cyc = currentDaYun(chart, date.getFullYear());
  const daYun = cyc
    ? clamp1(
        pillarFavor(favor, cyc.pillar) +
          structuralFavor(cyc.pillar, chart, favor).delta +
          vitalityMatch(chart.dayMaster.chinese, cyc.pillar.branch.chinese, cyc.startAge) * 0.35,
      )
    : 0;

  return {
    // Climate (大运 0.35 + 流年 0.25) bounds weather (流日 0.4): the day shifts within
    // the climate but can't escape it — good day in bad 运 = "less bad," not "the top."
    favor: clamp1(0.4 * day + 0.35 * daYun + 0.25 * year),
    structuralEvents: dayStruct.events,
    layers: { day, year, daYun },
  };
};

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

  const df = computeDayFavor(chart, date);

  return {
    date,
    dayPillar,
    element,
    deity,
    mode,
    content: DAILY_MODES[mode],
    balance,
    balanceNote: balanceNote(balance, element),
    favor: df?.favor,
    structuralEvents: df?.structuralEvents,
    layers: df?.layers,
  };
};
