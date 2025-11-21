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

export interface Stem {
  name: string; // e.g., Jia
  chinese: string; // e.g., 甲
  element: ElementType;
  polarity: Polarity;
}

export interface Branch {
  name: string; // e.g., Zi
  chinese: string; // e.g., 子
  element: ElementType; // Main Qi
  polarity: Polarity;
  zodiac: string; // e.g., Rat
  hiddenStems: Stem[];
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

export interface BaziChart {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dayMaster: Stem; // The Day Stem
  daYun: DaYun[];
  elementCounts: Record<ElementType, number>;
}
