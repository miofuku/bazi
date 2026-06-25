import { ElementType } from '../../types';
import { StemChar, StemImageProfile, ThriveNeed } from './types';

// Adapted, in warm English, from the 《从象法理解…》 essays — one natural image
// per day master. Need ids are referenced by the seasonal modifiers.

const { WOOD, FIRE, EARTH, METAL, WATER } = ElementType;

// Reusable need fragments ------------------------------------------------------
const N = {
  groundToRoot: (why: string): ThriveNeed => ({
    id: 'root', label: 'Solid ground to root in', element: EARTH, classicStems: ['戊', '己'], why,
  }),
  waterToDrink: (why: string): ThriveNeed => ({
    id: 'water', label: 'Water to be nourished by', element: WATER, classicStems: ['癸', '壬'], why,
  }),
  sunToGrow: (why: string): ThriveNeed => ({
    id: 'sun', label: 'Sunlight to grow toward', element: FIRE, classicStems: ['丙'], why,
  }),
};

export const JIA: StemImageProfile = {
  stem: '甲', element: WOOD, polarity: 'Yang',
  symbol: 'tree',
  imageTitle: 'A great tree reaching for the sky',
  imageSubtitle: 'The first of the ten — built to grow upward and be seen.',
  essence:
    'You are a tree that wants to grow tall, visibly, toward the light. Before you can become timber that shelters others, you first need to simply live and put down roots — only then does your reach mean something.',
  strengths: ['Upward drive and ambition', 'A backbone others lean on', 'Direct, principled, hard to bend'],
  growthEdges: ['Can feel rootless without something stable to stand on', 'Turns rigid or brittle when starved of warmth'],
  needs: [
    N.groundToRoot('Without roots in something solid, even great talent has nothing to stand on. Stable ground is your security and your starting point.'),
    N.waterToDrink('Steady nourishment keeps you growing instead of drying out. It is the care and support that lets you keep reaching.'),
    N.sunToGrow('Warmth and a stage turn raw growth into something luminous — the difference, in the old image, between a tree that gives shade and one that no one ever sees.'),
  ],
  inLife: 'You do your best with ground to stand on, people who nourish you, and a place in the sun to grow into.',
  thrivingLine: 'Rooted, nourished, and growing toward the light — a tree that shelters others.',
};

export const YI: StemImageProfile = {
  stem: '乙', element: WOOD, polarity: 'Yin',
  symbol: 'sprout',
  imageTitle: 'Grass, flowers, and climbing vines',
  imageSubtitle: 'Soft, adaptive, and quietly unkillable.',
  essence:
    'You are a flowering, climbing plant — gentle and pliant rather than towering. You cannot root as deep as the great tree, so you adapt, lean, and find your way around obstacles. Your strength is not force but the human arts: reading people, bending with the season, surviving.',
  strengths: ['Flexible and adaptable', 'Emotionally fluent, reads people well', 'A survivor who endures what breaks others'],
  growthEdges: ['Can over-attach to people or things you lean on', 'May chase what is beyond your reach instead of tending your own ground'],
  needs: [
    N.sunToGrow('Warmth is what opens you. With light, your sociability and grace flower; without it, life turns roundabout and you can fold inward.'),
    N.waterToDrink('Gentle, steady nourishment — dew, not a flood. It keeps you soft and growing rather than parched and grasping.'),
    {
      id: 'support', label: 'Something to lean on and climb', element: WOOD, classicStems: ['甲'],
      why: 'A vine grows highest beside a tree. The right person, structure, or community to grow alongside lets you reach far past your own size.',
    },
  ],
  inLife: 'You flourish in fair weather and good company — understanding people opens doors; understanding the world keeps them open.',
  thrivingLine: 'Reading people and seasons wisely — walking the human path with grace.',
};

export const BING: StemImageProfile = {
  stem: '丙', element: FIRE, polarity: 'Yang',
  symbol: 'sun',
  imageTitle: 'The sun high in the sky',
  imageSubtitle: 'Radiant by nature — it shines on everyone the same.',
  essence:
    'You are the sun: bright, generous, impossible to dim from the outside. Clouds may pass, but they only block your light for a while — they cannot touch the source. Your one real task is not to grow brighter, but to see yourself clearly.',
  strengths: ['Warm, generous, gives freely to all', 'Expressive and impossible to ignore', 'Resilient — outside forces rarely shake your core'],
  growthEdges: ['Can burn too hot — impatient, scorching, all-or-nothing', 'Runs forward without pausing to know yourself or your direction'],
  needs: [
    {
      id: 'clarity', label: 'Clear water to see yourself in', element: WATER, classicStems: ['壬'],
      why: 'You are like a runner who only knows how to sprint ahead — you may take a wrong turn, rattle at rivals, or rush. Clarity (壬水) is what lets you look inward and truly see yourself; no outside help can do this for you.',
    },
    {
      id: 'land', label: 'Land to shine upon', element: EARTH, classicStems: ['戊', '己'],
      why: 'Light only matters when it falls on something living. A world to warm and make grow turns your radiance into generosity rather than glare.',
    },
    {
      id: 'kindling', label: 'A spark of quick fuel', element: WOOD, classicStems: ['乙'],
      why: 'Not to make you burn hotter — the sun needs no fuel — but to satisfy your restlessness: a quick start, the courage to act in one decisive push.',
    },
  ],
  inLife: 'You give light and warmth wherever you go; your growth is learning to see yourself as clearly as you see everything you shine on.',
  thrivingLine: 'Radiant and self-aware — warmth that knows its own direction.',
};

export const DING: StemImageProfile = {
  stem: '丁', element: FIRE, polarity: 'Yin',
  symbol: 'lantern',
  imageTitle: 'The hearth-fire and the lantern',
  imageSubtitle: 'The human flame — kept alive so it is always there when needed.',
  essence:
    'You are made fire — the torch, the hearth, the flame that warms a room and carries civilization forward. Where the sun blazes for all, you are intimate and focused. Your way is not to blaze brightest but to endure: to be kept alight, ready whenever someone needs you.',
  strengths: ['Steady, dependable, emotionally warm', 'Focused and attentive to what is close', 'Carries and preserves what matters'],
  growthEdges: ['Can run on past experience rather than fresh thinking', 'Fragile when isolated — loses heart if the inner flame is left untended'],
  needs: [
    {
      id: 'fuel', label: 'Lasting fuel to burn', element: WOOD, classicStems: ['甲'],
      why: 'A flame needs wood to keep going. Long-term purpose and substance (甲木) are what let you last through any winter without going out.',
    },
    {
      id: 'craft', label: 'A tool to make fuel usable', element: METAL, classicStems: ['庚'],
      why: 'Raw timber must be split into kindling before it can feed a flame. Steady work and skill (庚金) turn raw potential into something you can actually live on — your quiet, reliable form of perseverance.',
    },
    {
      id: 'restraint', label: 'Water to keep from burning out', element: WATER, classicStems: ['壬'],
      why: 'In a hot season a small flame can consume its own fuel too fast. A little water keeps you from burning yourself out and going dark.',
    },
  ],
  inLife: 'You keep things going — relationships, traditions, a warm room — and you do best when you have real fuel and the skill to tend the fire.',
  thrivingLine: 'A flame that never goes out — carrying warmth forward through every season.',
};

export const WU: StemImageProfile = {
  stem: '戊', element: EARTH, polarity: 'Yang',
  symbol: 'rock',
  imageTitle: 'The mountain and the wild land',
  imageSubtitle: 'What matters is not the mountain, but what lives on it.',
  essence:
    'You are a mountain — broad, solid, unhurried wild ground whose purpose is to carry life. A bare mountain is just a heap of earth; a mountain green with forest is a living landscape. Your worth is measured by what you let grow and shelter, and your lifelong work is to know honestly how much you can hold.',
  strengths: ['Steady and unshaken — calm when others panic', 'Trustworthy, carries real weight for others', 'Quietly resourceful, holds a great deal inside'],
  growthEdges: ['Can become a barren heap — solid but lifeless — if nothing is allowed to grow', 'Overreaches or stagnates when out of touch with your true capacity'],
  needs: [
    N.sunToGrow('Sun (丙) warms the mountain and lifts its spirit, so that whatever grows on you can actually flourish.'),
    N.waterToDrink('Water (癸) feeds the grass and trees on your slopes — your generosity needs replenishing to keep giving life.'),
    {
      id: 'cultivate', label: 'Cultivation to bring you to life', element: WOOD, classicStems: ['甲'],
      why: 'Roots break open hard ground and make it fertile. Being worked, planted, and put to use is what turns idle land into a living, valued landscape.',
    },
  ],
  inLife: 'People rely on you to stay steady; you flourish when your strength is actually carrying something living, not just sitting unused.',
  thrivingLine: 'A green mountain — steady ground that lets a whole world grow on it.',
};

export const JI: StemImageProfile = {
  stem: '己', element: EARTH, polarity: 'Yin',
  symbol: 'field',
  imageTitle: 'Tended farmland and garden soil',
  imageSubtitle: 'Its whole worth is in what it grows.',
  essence:
    'You are cultivated soil — the field, the garden, the tended earth. Unlike the wild mountain, you exist to be planted: empty soil with nothing growing is soil that has lost its point. You are nurturing and versatile, and you give quietly, asking only to be useful.',
  strengths: ['Nurturing and generous', 'Versatile — many things can take root in you', 'Humble and steady; lets others flourish'],
  growthEdges: ['Quietly fears being useless more than being burdened', 'Can give so silently that your own worth goes unnoticed'],
  needs: [
    {
      id: 'cultivate', label: 'Crops to nourish', element: WOOD, classicStems: ['甲', '乙'],
      why: 'A field with nothing growing has no purpose. Real work, people, or projects to tend (the "crops") are not a burden on you — they are the very reason you exist.',
    },
    N.waterToDrink('Rain (癸) lets your crops grow. Steady nourishment is what turns your care into a real harvest.'),
    N.sunToGrow('Sun (丙) ripens what you grow. The more you are tending, the more warmth and light you need to bring it to fruit.'),
  ],
  inLife: 'You give without fanfare and ask little; you flourish when your care visibly bears fruit in the people and work around you.',
  thrivingLine: 'A field in full harvest — quiet ground whose worth is plain in what it grows.',
};

export const GENG: StemImageProfile = {
  stem: '庚', element: METAL, polarity: 'Yang',
  symbol: 'sword',
  imageTitle: 'Raw ore, forged into a blade',
  imageSubtitle: 'From useless rock, to useful tool, to mastered instrument.',
  essence:
    'You begin as raw ore — strong, but unshaped. Your life is a forging: heated and hammered into a useful tool, then tempered so you bend without breaking. The whole arc is "from useless, to useful, to applied." Hardship is not your enemy; it is the fire that makes you into something that can cut.',
  strengths: ['Decisive, strong, gets things done', 'A reformer who reshapes what is broken', 'Tempered by hardship into real resilience'],
  growthEdges: ['Too rigid breaks — all edge and no give', 'Can keep "forging" past the point of usefulness, hardening when you should soften'],
  needs: [
    {
      id: 'forge', label: 'Fire to be forged by', element: FIRE, classicStems: ['丁'],
      why: 'Ore becomes a blade only in the fire (丁火). Trials and refinement early in life are what shape your raw strength into something genuinely capable.',
    },
    {
      id: 'temper', label: 'Water to be tempered by', element: WATER, classicStems: ['壬', '癸'],
      why: 'Once forged, a blade is quenched in water so it stays sharp without shattering. Reflection and flexibility keep your strength from turning into the brittleness that the old saying warns of: "too rigid, easily broken."',
    },
  ],
  inLife: 'You earn your edge through challenge; you do your best work when you are both sharp and resilient — hard enough to cut, supple enough to last.',
  thrivingLine: 'A tempered blade — strength forged by fire and made supple by water.',
};

export const XIN: StemImageProfile = {
  stem: '辛', element: METAL, polarity: 'Yin',
  symbol: 'gem',
  imageTitle: 'A jewel that wants to be seen',
  imageSubtitle: 'A gem that no one sees has lost the point of being a gem.',
  essence:
    'You are a precious stone — refined, elegant, sensitive to your own surface. A jewel is meant to shine and be seen; hidden away, it loses its meaning. You are exquisitely aware of yourself, and your gift lies not in brute strength but in clarity, taste, and being recognized for what you truly are.',
  strengths: ['Refined, tasteful, naturally elegant', 'Sharp, precise, attentive to detail', 'A quiet, magnetic presence'],
  growthEdges: ['Easily feels "tarnished" — sensitive to pressure and slights', 'Dimmed and unhappy when buried, overlooked, or unseen'],
  needs: [
    {
      id: 'cleanse', label: 'Clear water to be washed bright', element: WATER, classicStems: ['壬'],
      why: 'A gem is cleansed in water to reveal its shine. Clear-mindedness (壬水) — washing off the day, seeing your own desires honestly — is what keeps you bright and lets your quality show.',
    },
    {
      id: 'light', label: 'Gentle light to shine in', element: FIRE, classicStems: ['丙'],
      why: 'Soft, broad light (丙, the sun — never the harsh flame that pressures you) lets your facets catch and reflect, so others can finally see what you are.',
    },
    {
      id: 'space', label: 'Room to be seen, not buried', element: EARTH, classicStems: [],
      why: 'Too much earth buries a gem — "metal buried in soil." You need space and a stage where your gifts are noticed, not smothered by being endlessly relied upon.',
    },
  ],
  inLife: 'You shine when you are seen and appreciated for your real quality; your path is honest, clear-eyed awareness of what you want and who you are.',
  thrivingLine: 'A jewel catching the light — refined, clear, and rightly seen.',
};

export const REN: StemImageProfile = {
  stem: '壬', element: WATER, polarity: 'Yang',
  symbol: 'river',
  imageTitle: 'The river, the lake, the open sea',
  imageSubtitle: 'Vast moving water that can flow anywhere.',
  essence:
    'You are a great body of water — a river, a lake, the sea — flowing freely in any direction. You carry desire and a kind of lucidity: an instinctive read on where things are heading and what an action will cost. Your danger is muddied water; your growth is learning to stay clear, and to outgrow the wish for the world to bend to you.',
  strengths: ['Adaptable and free-flowing', 'Widely connected — at ease with all kinds of people', 'Quick to sense consequences and shifting currents'],
  growthEdges: ['Hard to commit to one fixed channel or rigid role', 'Clouded by self-absorption when the water turns muddy'],
  needs: [
    {
      id: 'direction', label: 'A channel to give you direction', element: METAL, classicStems: ['庚'],
      why: 'Water with no banks wanders everywhere. A guiding structure or principle (庚金) does not so much fill you as point you — it tells your boundless flow which way to run.',
    },
    {
      id: 'expression', label: 'A way to express your power', element: FIRE, classicStems: ['丙'],
      why: 'Light on water reveals its breadth. An outlet (丙火) that shows your ability and turns your reach into real results lets your vastness become visible value rather than aimless drift.',
    },
    {
      id: 'clarity', label: 'Clear water, free of mud', element: WATER, classicStems: ['壬'],
      why: 'You think most clearly when nothing clouds you. Guarding your lucidity — staying clear-headed instead of churned-up — is the whole basis of your wisdom.',
    },
  ],
  inLife: 'You connect people and read the current better than most; you mature as you let go of needing the world to satisfy you on demand, and simply flow clear.',
  thrivingLine: 'Clear, far-reaching water — wise, connected, and free.',
};

export const GUI: StemImageProfile = {
  stem: '癸', element: WATER, polarity: 'Yin',
  symbol: 'rain',
  imageTitle: 'Rain, dew, and the quiet stream',
  imageSubtitle: 'Falling softly to make things grow.',
  essence:
    'You are rain and dew — quiet water that falls to nourish living things. You give gently and often unseen, but unlike the sun your giving has a purpose: you fall so that the harvest will come. Tender, penetrating, and devoted, you do your finest work in mild weather — neither scorching nor storming.',
  strengths: ['Gentle, nurturing, devoted', 'Penetrating — reaches places others cannot', 'Sensitive and emotionally deep'],
  growthEdges: ['Giving can be quietly conditional — you need to see it bear fruit', 'Can grow cold or withdrawn when your care goes unrewarded'],
  needs: [
    N.sunToGrow('Rain alone makes a grey, sodden world; rain with sun (丙癸 together) is the perfect weather for growing things. Warmth and optimism turn your care into a harvest.'),
    {
      id: 'purpose', label: 'Living things to nourish', element: WOOD, classicStems: ['甲', '乙'],
      why: 'Rain on barren ground is wasted. People, work, or causes that visibly grow from your care give your devotion its meaning and its reward.',
    },
  ],
  inLife: 'You nourish quietly and want to see your care take root; you flourish in warm, hopeful conditions where your giving clearly makes things grow.',
  thrivingLine: 'A gentle rain in fair weather — quiet care that brings a harvest.',
};

export const STEM_PROFILES: Record<StemChar, StemImageProfile> = {
  '甲': JIA, '乙': YI, '丙': BING, '丁': DING, '戊': WU,
  '己': JI, '庚': GENG, '辛': XIN, '壬': REN, '癸': GUI,
};
