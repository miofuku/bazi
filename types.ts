export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum ElementType {
  WOOD = 'Wood',
  FIRE = 'Fire',
  EARTH = 'Earth',
  METAL = 'Metal',
  WATER = 'Water',
}

export enum Polarity {
  YANG = 'Yang',
  YIN = 'Yin',
}

export type ElementCounts = Record<ElementType, number>;
export type ElementScore = Record<ElementType, number>;

export interface ElementInfo {
  chinese?: string;
  english: string;
  keywords: string;
}

export interface Stem {
  name: string; // e.g., Jia
  chinese: string; // e.g., 甲
  element: ElementType;
  polarity: Polarity;
  deity?: string; // Ten Deity relative to Day Master (e.g., 比肩)
  // New Metadata
  natureImage?: string;
  personality?: string;
  fullEnglishName?: string;
}

export interface Branch {
  name: string; // e.g., Zi
  chinese: string; // e.g., 子
  element: ElementType; // Main Qi
  polarity: Polarity;
  zodiac: string; // e.g., Rat
  hiddenStems: Stem[]; // Now these stems will also carry deity info
  deity?: string; // Main Qi Deity
  // New Metadata
  time?: string;
  keywords?: string;
}

export interface InteractionInfo {
  relation: string;
  traditional?: string;
  modern: string;
  context: string;
  keyword?: string;
}

export interface Pillar {
  stem: Stem;
  branch: Branch;
  name: string; // e.g., Year, Month
}

export interface DaYun {
  startAge: number;
  endAge: number;
  year: number; // Start year
  pillar: Pillar;
}

export interface SystemMetric {
  label: string;
  value: number; // 0-100
  description: string;
  founderInsight?: string;
  status?: string;
}

export interface BaziChart {
  date?: Date;
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dayMaster: Stem; // The Day Stem
  daYun: DaYun[];
  elementCounts: ElementCounts;
  elementScores?: ElementScore; // Detailed strength scores
  systemMetrics?: Record<string, SystemMetric>;
  geneticId?: string; // e.g. "CHRONO-8829-X"
  solarTimeCorrection?: string; // e.g. "+12min"
}
