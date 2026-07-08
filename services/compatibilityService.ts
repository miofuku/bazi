import { calculateBazi, Geo } from './baziService';
import { getDayPillar } from './dailyService';
import { BaziChart, Gender, ElementType, Favor } from '../types';
import {
  Person,
  RelationLens,
  CompatibilityReading,
  analyzeCompatibility,
} from '../utils/CompatibilityAnalyzer';

export interface Birth {
  label: string;
  year: number;
  month: number;
  day: number;
  hour?: number; // undefined when the birth time is unknown → 三柱 reading
  minute: number;
  gender: Gender;
  geo?: Geo;
}

export interface PersonBundle {
  person: Person;
  chart: BaziChart;
}

export const buildPerson = (b: Birth): PersonBundle => {
  const chart = calculateBazi(b.year, b.month, b.day, b.hour, b.minute, b.gender, b.geo);
  const person: Person = {
    label: b.label,
    strength: chart.strength!,
    yongshen: chart.yongshen!,
    dayBranch: chart.dayPillar.branch.chinese,
  };
  return { person, chart };
};

export interface PairResult {
  reading: CompatibilityReading;
  a: PersonBundle;
  b: PersonBundle;
}

export const analyzePair = (a: Birth, b: Birth, lens: RelationLens): PairResult => ({
  reading: analyzeCompatibility(buildPerson(a).person, buildPerson(b).person, lens),
  a: buildPerson(a),
  b: buildPerson(b),
});

// ── Team daily weather (d) ───────────────────────────────────────────────────
const FAVOR_WEIGHT: Record<Favor, number> = { favorable: 1, neutral: 0, unfavorable: -1 };

export interface TeamDay {
  date: Date;
  chinese: string;      // day pillar 干支
  stemElement: ElementType;
  branchElement: ElementType;
  aScore: number;       // -1..1: how the day's elements meet person A's 用忌
  bScore: number;
  mutual: boolean;      // a good day for BOTH
}

// A day is made mostly of its stem (weight 2) and branch main qi (weight 1).
const dayScoreFor = (favor: Record<ElementType, Favor>, stem: ElementType, branch: ElementType) =>
  (FAVOR_WEIGHT[favor[stem]] * 2 + FAVOR_WEIGHT[favor[branch]] * 1) / 3;

/**
 * Scores each of the next `days` days against both people's 用神, flagging the
 * ones that favor both — good windows for joint decisions.
 */
export const teamDailyWeather = (a: Person, b: Person, days: number, from = new Date()): TeamDay[] => {
  const out: TeamDay[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const pillar = getDayPillar(date);
    if (!pillar) continue;
    const stemEl = pillar.stem.element;
    const branchEl = pillar.branch.element;
    const aScore = dayScoreFor(a.yongshen.favor, stemEl, branchEl);
    const bScore = dayScoreFor(b.yongshen.favor, stemEl, branchEl);
    out.push({
      date,
      chinese: pillar.stem.chinese + pillar.branch.chinese,
      stemElement: stemEl,
      branchElement: branchEl,
      aScore,
      bScore,
      mutual: aScore > 0 && bScore > 0,
    });
  }
  return out;
};
