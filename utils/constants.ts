import { ElementType, Polarity, Stem, Branch, ElementInfo, InteractionInfo } from '../types';

// Simplified static data for mapping if library returns raw strings, 
// or for UI display purposes.

export const FIVE_ELEMENTS_INFO: Record<ElementType, ElementInfo> = {
  [ElementType.WOOD]: {
    chinese: '木',
    english: 'Wood',
    keywords: 'Growth, Vision, Benevolence'
  },
  [ElementType.FIRE]: {
    chinese: '火',
    english: 'Fire',
    keywords: 'Passion, Visibility, Action'
  },
  [ElementType.EARTH]: {
    chinese: '土',
    english: 'Earth',
    keywords: 'Stability, Trust, Storage'
  },
  [ElementType.METAL]: {
    chinese: '金',
    english: 'Metal',
    keywords: 'Order, Precision, Structure'
  },
  [ElementType.WATER]: {
    chinese: '水',
    english: 'Water',
    keywords: 'Wisdom, Flow, Adaptability'
  }
};

export const STEMS: Record<string, Stem> = {
  '甲': { name: 'Jia', chinese: '甲', element: ElementType.WOOD, polarity: Polarity.YANG, fullEnglishName: 'Yang Wood', natureImage: 'The Mighty Oak', personality: 'Resilient, direct, uncompromising' },
  '乙': { name: 'Yi', chinese: '乙', element: ElementType.WOOD, polarity: Polarity.YIN, fullEnglishName: 'Yin Wood', natureImage: 'The Climbing Ivy', personality: 'Flexible, gentle, survivor' },
  '丙': { name: 'Bing', chinese: '丙', element: ElementType.FIRE, polarity: Polarity.YANG, fullEnglishName: 'Yang Fire', natureImage: 'The Radiant Sun', personality: 'Generous, radiant, expressive' },
  '丁': { name: 'Ding', chinese: '丁', element: ElementType.FIRE, polarity: Polarity.YIN, fullEnglishName: 'Yin Fire', natureImage: 'The Candle Light', personality: 'Delicate, focused, sensitive' },
  '戊': { name: 'Wu', chinese: '戊', element: ElementType.EARTH, polarity: Polarity.YANG, fullEnglishName: 'Yang Earth', natureImage: 'The Mountain', personality: 'Stable, stubborn, trustworthy' },
  '己': { name: 'Ji', chinese: '己', element: ElementType.EARTH, polarity: Polarity.YIN, fullEnglishName: 'Yin Earth', natureImage: 'The Garden Soil', personality: 'Nurturing, versatile, talented' },
  '庚': { name: 'Geng', chinese: '庚', element: ElementType.METAL, polarity: Polarity.YANG, fullEnglishName: 'Yang Metal', natureImage: 'The Raw Iron', personality: 'Strong, decisive, reformer' },
  '辛': { name: 'Xin', chinese: '辛', element: ElementType.METAL, polarity: Polarity.YIN, fullEnglishName: 'Yin Metal', natureImage: 'The Precious Gem', personality: 'Refined, proud, detail-oriented' },
  '壬': { name: 'Ren', chinese: '壬', element: ElementType.WATER, polarity: Polarity.YANG, fullEnglishName: 'Yang Water', natureImage: 'The Ocean', personality: 'Vast, impulsive, wise' },
  '癸': { name: 'Gui', chinese: '癸', element: ElementType.WATER, polarity: Polarity.YIN, fullEnglishName: 'Yin Water', natureImage: 'The Morning Dew', personality: 'Penetrating, mysterious, sentimental' },
};

// Helper to create partial branches (hidden stems logic is complex, simplifying for display)
// Helper to create partial branches
const createBranch = (char: string, name: string, element: ElementType, polarity: Polarity, zodiac: string, hiddenChars: string[], time: string, keywords: string): Branch => ({
  chinese: char,
  name,
  element,
  polarity,
  zodiac,
  hiddenStems: hiddenChars.map(c => STEMS[c]),
  time,
  keywords
});

export const BRANCHES: Record<string, Branch> = {
  '子': createBranch('子', 'Zi', ElementType.WATER, Polarity.YANG, 'Rat', ['癸'], 'Midnight', 'Initiate, Secretive'),
  '丑': createBranch('丑', 'Chou', ElementType.EARTH, Polarity.YIN, 'Ox', ['己', '癸', '辛'], 'Late Night', 'Endure, Prepare'),
  '寅': createBranch('寅', 'Yin', ElementType.WOOD, Polarity.YANG, 'Tiger', ['甲', '丙', '戊'], 'Early Morning', 'Awaken, Bold'),
  '卯': createBranch('卯', 'Mao', ElementType.WOOD, Polarity.YIN, 'Rabbit', ['乙'], 'Morning', 'Network, Gentle'),
  '辰': createBranch('辰', 'Chen', ElementType.EARTH, Polarity.YANG, 'Dragon', ['戊', '乙', '癸'], 'Late Morning', 'Transform, Complex'),
  '巳': createBranch('巳', 'Si', ElementType.FIRE, Polarity.YIN, 'Snake', ['丙', '庚', '戊'], 'Early Noon', 'Strategize, Observant'),
  '午': createBranch('午', 'Wu', ElementType.FIRE, Polarity.YANG, 'Horse', ['丁', '己'], 'High Noon', 'Peak, Visibility'),
  '未': createBranch('未', 'Wei', ElementType.EARTH, Polarity.YIN, 'Goat', ['己', '丁', '乙'], 'Afternoon', 'Nurture, Artistic'),
  '申': createBranch('申', 'Shen', ElementType.METAL, Polarity.YANG, 'Monkey', ['庚', '壬', '戊'], 'Late Afternoon', 'Perform, Agile'),
  '酉': createBranch('酉', 'You', ElementType.METAL, Polarity.YIN, 'Rooster', ['辛'], 'Sunset', 'Detail, Perfection'),
  '戌': createBranch('戌', 'Xu', ElementType.EARTH, Polarity.YANG, 'Dog', ['戊', '辛', '丁'], 'Evening', 'Loyal, Guarding'),
  '亥': createBranch('亥', 'Hai', ElementType.WATER, Polarity.YIN, 'Pig', ['壬', '甲'], 'Late Night', 'Content, Wise'),
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

// Symbol type mappings for 天干 (Heavenly Stems)
// These map to custom SVG icons
export const STEM_SYMBOLS: Record<string, string> = {
  '甲': 'tree',      // Big Tree - Yang Wood
  '乙': 'sprout',    // Grass/Sprout - Yin Wood
  '丙': 'sun',       // Sun - Yang Fire
  '丁': 'lantern',   // Lantern/Candle - Yin Fire
  '戊': 'rock',      // Rock/Mountain - Yang Earth
  '己': 'field',     // Field/Farmland - Yin Earth
  '庚': 'sword',     // Sword - Yang Metal
  '辛': 'gem',       // Gem/Jewelry - Yin Metal
  '壬': 'river',     // River - Yang Water
  '癸': 'rain',      // Rain/Dew - Yin Water
};

// Symbol type mappings for 地支 (Earthly Branches)
export const BRANCH_SYMBOLS: Record<string, string> = {
  '寅': 'tree',      // Tiger - Wood (Tree)
  '卯': 'sprout',    // Rabbit - Wood (Sprout)
  '巳': 'lantern',   // Snake - Fire (Candle/Lantern)
  '午': 'sun',       // Horse - Fire (Sun)
  '丑': 'field',     // Ox - Earth (Field)
  '未': 'field',     // Goat - Earth (Field)
  '辰': 'rock',      // Dragon - Earth (Rock)
  '戌': 'rock',      // Dog - Earth (Rock)
  '申': 'sword',     // Monkey - Metal (Sword)
  '酉': 'gem',       // Rooster - Metal (Gem)
  '子': 'river',      // Rat - Water (Rain/Dew)
  '亥': 'rain',     // Pig - Water (River)
};

export const INTERACTIONS: InteractionInfo[] = [
  // Creation / Support
  { relation: 'Wood feeds Fire', traditional: '木生火', modern: 'Fueling the Passion', context: 'Your creativity (Wood) transforms into action (Fire).', keyword: 'Ignition' },
  { relation: 'Fire creates Earth', traditional: '火生土', modern: 'Consolidating Results', context: 'Your actions (Fire) build solid trust and assets (Earth).', keyword: 'Consolidation' },
  { relation: 'Earth bears Metal', traditional: '土生金', modern: 'Mining for Value', context: 'Your accumulation (Earth) yields core structure and rules (Metal).', keyword: 'Refinement' },
  { relation: 'Metal holds Water', traditional: '金生水', modern: 'Structuring the Wisdom', context: 'Your logic and discipline (Metal) clarify your flow of thought (Water).', keyword: 'Clarity' },
  { relation: 'Water nourishes Wood', traditional: '水生木', modern: 'Nurturing Growth', context: 'Your wisdom and network (Water) nourish new development (Wood).', keyword: 'Nurture' },
  // Control / Shape
  { relation: 'Wood parts Earth', traditional: '木克土', modern: 'Breaking New Ground', context: 'Innovation (Wood) breaks through stagnation (Earth).', keyword: 'Expansion' },
  { relation: 'Earth dams Water', traditional: '土克水', modern: 'Channeling the Flow', context: 'Stability (Earth) focuses scattered emotions (Water).', keyword: 'Focus' },
  { relation: 'Water extinguishes Fire', traditional: '水克火', modern: 'Cooling the Heat', context: 'Wisdom (Water) regulates impulsive action (Fire).', keyword: 'Regulation' },
  { relation: 'Fire melts Metal', traditional: '火克金', modern: 'Forging the Tool', context: 'Passion (Fire) reshapes rigid structures (Metal).', keyword: 'Transformation' },
  { relation: 'Metal chops Wood', traditional: '金克木', modern: 'Pruning for Growth', context: 'Discipline (Metal) cuts away distractions (Wood) for better growth.', keyword: 'Discipline' },
];
