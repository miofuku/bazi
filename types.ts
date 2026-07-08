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

// Day-master strength (日干旺衰), multiplier method — see docs/wangshuai.md.
export type StrengthCategory =
  | 'follow-weak'   // 从弱
  | 'weak'          // 身弱
  | 'balanced'      // 中和
  | 'strong'        // 身强
  | 'follow-strong'; // 从强

export interface StrengthReading {
  elementPower: Record<ElementType, number>;
  totalPower: number;
  dayElement: ElementType;
  resourceElement: ElementType; // element that generates the day master (印)
  supportShare: number;         // 同党 (day element + resource) share, 0..1
  rooted: boolean;              // day master has a living root (未被冲拔)
  category: StrengthCategory;
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
  strength?: StrengthReading;   // Day-master strength (日干旺衰)
}
