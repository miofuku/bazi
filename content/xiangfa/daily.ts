import { ElementType } from '../../types';

// Daily "weather" for a living thing — not fortune.
//
// Each calendar day has its own heavenly stem. Read against a person's day
// master, that stem falls into one of five relationships (the 十神 grouped into
// five modes). We frame each mode the way Rootwise frames everything else: as a
// kind of climate, and how this particular nature can work with it. No luck,
// no destiny — just "this is the sort of day it is for you."

export type DailyMode = 'peer' | 'output' | 'wealth' | 'authority' | 'resource';

// 十神 (short char from calculateDeity) → daily mode.
export const DEITY_TO_MODE: Record<string, DailyMode> = {
  比: 'peer', 劫: 'peer',
  食: 'output', 伤: 'output',
  才: 'wealth', 财: 'wealth',
  杀: 'authority', 官: 'authority',
  枭: 'resource', 印: 'resource',
};

export interface DailyModeContent {
  title: string;       // short headline, e.g. "A day in your own element"
  body: string;        // 1–2 sentences in the ecological voice
  goodFor: string[];   // a few things the day naturally supports
  easeOff: string;     // one gentle caution
}

export const DAILY_MODES: Record<DailyMode, DailyModeContent> = {
  peer: {
    title: 'A day in your own element',
    body:
      'The world today is made of the same stuff you are. Energy comes easily and you feel most like yourself — a stand of trees in one wind, all leaning the same way.',
    goodFor: ['Acting on your own initiative', 'Being among your own kind', 'Trusting your instinct'],
    easeOff: 'With everyone pulling in your direction, it’s easy to overreach or compete where you could simply share.',
  },
  output: {
    title: 'A day to express and create',
    body:
      'Today the energy moves outward, from you into the world — flowering, fruiting, giving off what you’ve grown. A good day to make something and let it be seen.',
    goodFor: ['Creating and performing', 'Speaking and teaching', 'Spending built-up energy'],
    easeOff: 'Pouring out without pause drains the reserves; leave a little in the soil.',
  },
  wealth: {
    title: 'A day to do and to gather',
    body:
      'The world offers something to work for today — ground to till, fruit to pick. Effort meets reward more directly than usual, so it rewards practical, hands-on pursuit.',
    goodFor: ['Tangible tasks and follow-through', 'Tending what you’re building', 'Pursuing a clear aim'],
    easeOff: 'Chasing too many fields at once scatters you; tend the one that’s actually ripening.',
  },
  authority: {
    title: 'A day of structure and demand',
    body:
      'Today the world presses in — rules, duties, deadlines, the weight of expectation. Pressure that, met steadily, shapes you stronger, like wind that thickens a trunk.',
    goodFor: ['Discipline and finishing duties', 'Meeting commitments', 'Working within structure'],
    easeOff: 'Don’t let the demands harden into self-criticism; pressure is for shaping, not breaking.',
  },
  resource: {
    title: 'A day to receive and replenish',
    body:
      'Today the world feeds you — rain to the root, sun to the leaf. A nourishing, restoring kind of day, better for taking in than for pushing out.',
    goodFor: ['Rest and recovery', 'Learning and reflecting', 'Accepting help and support'],
    easeOff: 'Too much comfort can keep you from moving; receive, then carry it forward.',
  },
};

// A secondary note based on how much of today's element this person already
// carries — reusing the scarce/present/abundant idea from the main reading.
export type Balance = 'scarce' | 'present' | 'abundant';

const ELEMENT_NOUN: Record<ElementType, string> = {
  [ElementType.WOOD]: 'Wood',
  [ElementType.FIRE]: 'Fire',
  [ElementType.EARTH]: 'Earth',
  [ElementType.METAL]: 'Metal',
  [ElementType.WATER]: 'Water',
};

export function balanceNote(balance: Balance, element: ElementType): string {
  const noun = ELEMENT_NOUN[element];
  switch (balance) {
    case 'scarce':
      return `Today carries the ${noun} you usually run short on — worth leaning into while it’s here.`;
    case 'abundant':
      return `Today brings more ${noun}, an element you already carry in plenty — notice if it tips into too much.`;
    default:
      return `Today’s ${noun} sits easily alongside what you already carry.`;
  }
}
