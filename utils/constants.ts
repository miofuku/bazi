import { ElementType, Polarity, Stem, Branch, ElementInfo, InteractionInfo } from '../types';

// Simplified static data for mapping if library returns raw strings, 
// or for UI display purposes.


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
// Symbol type mappings for 地支 (Earthly Branches)
export const FIVE_ELEMENTS_INFO: Record<ElementType, ElementInfo> = {
  [ElementType.WOOD]: {
    english: 'The Growth Engine',
    keywords: 'Expansion, Benevolence, Long-term Vision, Vitality'
  },
  [ElementType.FIRE]: {
    english: 'The Thermal Intensity',
    keywords: 'Passion, Dissemination, Visibility, Spiritual Dedication'
  },
  [ElementType.EARTH]: {
    english: 'The Grounding Matrix',
    keywords: 'Stability, Credit, Capacity, Resource Integration'
  },
  [ElementType.METAL]: {
    english: 'The Structural Precision',
    keywords: 'Decision, Order, Contraction, Logical Rigor'
  },
  [ElementType.WATER]: {
    english: 'The Fluid Intelligence',
    keywords: 'Insight, Communication, Mobility, Deep Connection'
  }
};

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

export interface TenGodInfo {
  name: string;
  chronosophyName: string;
  description: string;
}

export const TEN_GODS_INFO: Record<string, TenGodInfo> = {
  'Friend': { name: 'Friend', chronosophyName: 'The Peer Resonance', description: 'Self-awareness, Horizontal Synergy, Independence' },
  'Rob Wealth': { name: 'Rob Wealth', chronosophyName: 'The Competitive Drive', description: 'Social Explosiveness, Resource Acquisition, Expansion Desire' },
  'Eating God': { name: 'Eating God', chronosophyName: 'The Natural Alchemist', description: 'Primal Creativity, Life Aesthetics, Gentle Output' },
  'Hurting Officer': { name: 'Hurting Officer', chronosophyName: 'The Disruptive Innovator', description: 'Rebellious Talent, Rule Breaking, Radical Expression' },
  'Direct Wealth': { name: 'Direct Wealth', chronosophyName: 'The Systematic Accumulator', description: 'Stable Asset Management, Pragmatic Logic, Result-Oriented' },
  'Indirect Wealth': { name: 'Indirect Wealth', chronosophyName: 'The Venture Opportunist', description: 'VC Acumen, Macro Financial Planning, Non-linear Growth' },
  'Direct Officer': { name: 'Direct Officer', chronosophyName: 'The Integrity Guardian', description: 'Executive Power, Institutional Compliance, Social Responsibility' },
  'Seven Killings': { name: 'Seven Killings', chronosophyName: 'The Strategic Aggressor', description: 'Crisis Decision-making, Deterrence, Reshaping Rules under Pressure' },
  'Direct Resource': { name: 'Direct Resource', chronosophyName: 'The Foundational Mentor', description: 'Systematic Knowledge, Security, Traditional Protection' },
  'Indirect Resource': { name: 'Indirect Resource', chronosophyName: 'The Transcendental Visionary', description: 'Supernatural Intuition, Niche Insight, Obsessive Deep-dive' },
};

export const INTERACTIONS: InteractionInfo[] = [
  // Synergistic Cycles (Formerly Creation)
  { relation: 'Fueling Phase', modern: 'Amplification / Nourishing', context: 'One system empowers another.', keyword: 'Amplification' },
  { relation: 'Stabilizing Phase', modern: 'Amplification / Nourishing', context: 'Dynamic Energy consolidates into baseline stability.', keyword: 'Consolidation' },
  { relation: 'Refining Phase', modern: 'Amplification / Nourishing', context: 'Infrastructure yields high-precision analytical structures.', keyword: 'Refinement' },
  { relation: 'Clarifying Phase', modern: 'Amplification / Nourishing', context: 'Analytical logic clarifies systemic intelligence and flow.', keyword: 'Clarity' },
  { relation: 'Regenerative Phase', modern: 'Amplification / Nourishing', context: 'Systemic intelligence nourishes new growth architecture.', keyword: 'Nurture' },
  // Friction Cycles (Formerly Control)
  { relation: 'External Friction', modern: 'Structural Constraint / Friction', context: 'Necessary constraints or systemic consumption.', keyword: 'Constraint' },
  { relation: 'Regulatory Friction', modern: 'Structural Constraint / Friction', context: 'Baseline stability creates boundaries for systemic intelligence.', keyword: 'Regulation' },
  { relation: 'Dynamic Friction', modern: 'Structural Constraint / Friction', context: 'Systemic intelligence regulates impulsive energy output.', keyword: 'Modulation' },
  { relation: 'Interventionist Friction', modern: 'Structural Constraint / Friction', context: 'High-intensity energy reshapes analytical structures.', keyword: 'Forging' },
  { relation: 'Constraint Friction', modern: 'Structural Constraint / Friction', context: 'Axiomatic rigor defines the limits of expansionary growth.', keyword: 'Constraint' },
];

export const RELATIONSHIP_LEXICON: Record<string, { team: string; intimate: string }> = {
  'produce': { team: 'Resource Support', intimate: 'Emotional Nourishment' },
  'fuel': { team: 'Strategic Ignition', intimate: 'Passion Fueling' },
  'control': { team: 'Management / Order', intimate: 'Dynamic Tension & Growth' },
  'clash': { team: 'Structural Reconfiguration', intimate: 'Transformative Friction' },
  'combine': { team: 'Strategic Alignment', intimate: 'Deep Soul Resonance' },
};
