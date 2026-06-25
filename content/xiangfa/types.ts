import { ElementType } from '../../types';

// 八字象法 ("image method") content model.
// Each heavenly stem (day master) is read as a living natural image, and the
// birth month is the season/climate it was born into. The reading describes a
// person's nature and the conditions that help them flourish — not fortune.

export type StemChar = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type BranchChar =
  | '子' | '丑' | '寅' | '卯' | '辰' | '巳'
  | '午' | '未' | '申' | '酉' | '戌' | '亥';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

// One condition a living thing needs in order to thrive, expressed in the 象法
// imagery (ground to root, water to drink, sun to grow…) and tied to the five
// element that classically supplies it, so we can read it off the chart's
// element scores.
export interface ThriveNeed {
  id: string;              // stable id referenced by seasonal "emphasized" lists
  label: string;          // e.g. "Solid ground to root"
  element: ElementType;   // the element that provides this need
  classicStems: StemChar[]; // the stem(s) that classically embody it (e.g. ['戊'])
  why: string;            // a psychological / ecological reason, 1–2 sentences
}

// The natural image of a day master.
export interface StemImageProfile {
  stem: StemChar;
  element: ElementType;
  polarity: 'Yang' | 'Yin';
  symbol: string;          // key into STEM_SYMBOLS / NatureArt (tree/sun/river…)
  archetypeName: string;   // plain-English name shown on the surface, e.g. "The Tree"
  imageTitle: string;      // e.g. "A tree reaching for the sky"
  imageSubtitle: string;   // short poetic line under the title
  essence: string;         // 2–3 sentence psychological core
  strengths: string[];
  growthEdges: string[];   // blind spots, gently framed as growth edges
  needs: ThriveNeed[];     // what this living thing needs to flourish
  inLife: string;          // how the nature shows up in daily life
  thrivingLine: string;    // one line: what "flourishing" looks like for them
}

// The climate of the month a person was born into, authored per stem + season.
export interface SeasonalModifier {
  season: Season;
  climate: string;          // e.g. "deep winter frost"
  environmentTitle: string; // e.g. "Born into the frost"
  reading: string;          // adapted from the essay's per-season passage
  emphasizedNeedIds: string[]; // which needs this season makes most urgent
  mood: 'harsh' | 'tender' | 'abundant' | 'balanced';
}
