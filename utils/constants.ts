import { ElementType, Polarity, Stem, Branch } from '../types';

// Simplified static data for mapping if library returns raw strings, 
// or for UI display purposes.

export const STEMS: Record<string, Stem> = {
  '甲': { name: 'Jia', chinese: '甲', element: ElementType.WOOD, polarity: Polarity.YANG },
  '乙': { name: 'Yi', chinese: '乙', element: ElementType.WOOD, polarity: Polarity.YIN },
  '丙': { name: 'Bing', chinese: '丙', element: ElementType.FIRE, polarity: Polarity.YANG },
  '丁': { name: 'Ding', chinese: '丁', element: ElementType.FIRE, polarity: Polarity.YIN },
  '戊': { name: 'Wu', chinese: '戊', element: ElementType.EARTH, polarity: Polarity.YANG },
  '己': { name: 'Ji', chinese: '己', element: ElementType.EARTH, polarity: Polarity.YIN },
  '庚': { name: 'Geng', chinese: '庚', element: ElementType.METAL, polarity: Polarity.YANG },
  '辛': { name: 'Xin', chinese: '辛', element: ElementType.METAL, polarity: Polarity.YIN },
  '壬': { name: 'Ren', chinese: '壬', element: ElementType.WATER, polarity: Polarity.YANG },
  '癸': { name: 'Gui', chinese: '癸', element: ElementType.WATER, polarity: Polarity.YIN },
};

// Helper to create partial branches (hidden stems logic is complex, simplifying for display)
const createBranch = (char: string, name: string, element: ElementType, polarity: Polarity, zodiac: string, hiddenChars: string[]): Branch => ({
  chinese: char,
  name,
  element,
  polarity,
  zodiac,
  hiddenStems: hiddenChars.map(c => STEMS[c]),
});

export const BRANCHES: Record<string, Branch> = {
  '子': createBranch('子', 'Zi', ElementType.WATER, Polarity.YANG, 'Rat', ['癸']),
  '丑': createBranch('丑', 'Chou', ElementType.EARTH, Polarity.YIN, 'Ox', ['己', '癸', '辛']),
  '寅': createBranch('寅', 'Yin', ElementType.WOOD, Polarity.YANG, 'Tiger', ['甲', '丙', '戊']),
  '卯': createBranch('卯', 'Mao', ElementType.WOOD, Polarity.YIN, 'Rabbit', ['乙']),
  '辰': createBranch('辰', 'Chen', ElementType.EARTH, Polarity.YANG, 'Dragon', ['戊', '乙', '癸']),
  '巳': createBranch('巳', 'Si', ElementType.FIRE, Polarity.YIN, 'Snake', ['丙', '庚', '戊']),
  '午': createBranch('午', 'Wu', ElementType.FIRE, Polarity.YANG, 'Horse', ['丁', '己']),
  '未': createBranch('未', 'Wei', ElementType.EARTH, Polarity.YIN, 'Goat', ['己', '丁', '乙']),
  '申': createBranch('申', 'Shen', ElementType.METAL, Polarity.YANG, 'Monkey', ['庚', '壬', '戊']),
  '酉': createBranch('酉', 'You', ElementType.METAL, Polarity.YIN, 'Rooster', ['辛']),
  '戌': createBranch('戌', 'Xu', ElementType.EARTH, Polarity.YANG, 'Dog', ['戊', '辛', '丁']),
  '亥': createBranch('亥', 'Hai', ElementType.WATER, Polarity.YIN, 'Pig', ['壬', '甲']),
};

export const ELEMENT_COLORS: Record<ElementType, string> = {
  [ElementType.WOOD]: 'text-wood border-wood',
  [ElementType.FIRE]: 'text-fire border-fire',
  [ElementType.EARTH]: 'text-earth border-earth',
  [ElementType.METAL]: 'text-metal border-metal',
  [ElementType.WATER]: 'text-water border-water',
};

export const ELEMENT_BG_COLORS: Record<ElementType, string> = {
  [ElementType.WOOD]: 'bg-wood',
  [ElementType.FIRE]: 'bg-fire',
  [ElementType.EARTH]: 'bg-earth',
  [ElementType.METAL]: 'bg-metal',
  [ElementType.WATER]: 'bg-water',
};
