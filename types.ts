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

// 用神选取 (Phase 2). Per-element favorability + the primary 用/忌.
export type Favor = 'favorable' | 'neutral' | 'unfavorable'; // 喜用 / 闲 / 忌

export type YongshenMethod =
  | 'fuyi-weak'      // 扶抑·身弱 → 扶
  | 'fuyi-strong'    // 扶抑·身强 → 抑
  | 'binyao'         // 中和 → 病药
  | 'follow-weak'    // 从弱 → 顺势
  | 'follow-strong'; // 从强 → 顺势

export interface YongshenReading {
  method: YongshenMethod;
  primaryYong: ElementType; // 用神
  primaryJi: ElementType;   // 忌神
  favor: Record<ElementType, Favor>;
  tiaohou: ElementType[];   // 调候用神 elements for this day-master × month (穷通宝鉴)
  note: string;
}

export interface BaziChart {
  date?: Date;
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null; // null when the birth hour is unknown (三柱 reading)
  dayMaster: Stem; // The Day Stem
  daYun: DaYun[];
  elementCounts: ElementCounts;
  elementScores?: ElementScore; // Detailed strength scores
  strength?: StrengthReading;   // Day-master strength (日干旺衰)
  yongshen?: YongshenReading;   // 用神 (favorable elements)
}
