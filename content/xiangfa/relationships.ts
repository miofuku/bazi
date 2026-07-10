import { BaziChart, ElementType } from '../../types';
import { STEMS } from '../../utils/constants';
import { calculateDeity, DEITY_FULL_NAMES } from '../../utils/baziCalculator';
import { pillarFavor } from '../../utils/timeFavor';
import { structuralFavor } from '../../utils/structural';
import { stageOf, vitalityMatch, LifeStage } from '../../utils/twelveStage';
import { XiangfaReading } from './index';

// ── The five relationships (the Ten Gods 十神, masked as nature) ──────────────
// Every living thing stands in five relationships to the world: what feeds it,
// what it gives off, what it tends, what prunes it, and its own kind. These are
// the Ten Gods — five pairs (a "proper" and an "eccentric" flavour) — but the
// surface never says so.

export type RelationshipId = 'nourish' | 'express' | 'tend' | 'shape' | 'kin';
type Polarity = 'proper' | 'off';

interface RelationshipCopy {
  title: string;
  icon: string;        // ElementIcon id
  naturePhrase: string;
  meaning: string;
  proper: string;      // when the "proper" flavour leads (正)
  off: string;         // when the "eccentric" flavour leads (偏 / 七杀)
  faint: string;       // when this relationship is quiet in the person
}

export const RELATIONSHIPS: Record<RelationshipId, RelationshipCopy> = {
  nourish: {
    title: 'What nourishes you',
    icon: 'rain',
    naturePhrase: 'the rain and deep soil that feed a growing thing',
    meaning: 'Support, care, and learning — where you draw strength before you give it out. Mentors, roots, the feeling of being held.',
    proper: 'You take nourishment in steady, trusted forms — family, teachers, solid roots and well-worn learning.',
    off: 'You are fed in unusual ways — intuition, niche obsessions, and your own inner world more than the marked path.',
    faint: 'Little outside nourishment shapes you. You tend to feed yourself, learning by your own lights — more self-reliant, but with less shelter to fall back on.',
  },
  express: {
    title: 'What you give off',
    icon: 'sun',
    naturePhrase: 'the fruit, the shade, the light a living thing puts into the world',
    meaning: 'Your expression and output — what you make, perform, and pour out for others to receive.',
    proper: 'A gentle, generous output — you create for the warmth of it, and it flows easily.',
    off: 'A brilliant, restless output — you express with edge and originality, bending the rules to make something striking.',
    faint: 'You give off little outwardly — more inward than expressive. Your gifts are real but may need coaxing into the open.',
  },
  tend: {
    title: 'What you tend',
    icon: 'field',
    naturePhrase: 'the ground a creature works and the harvest it gathers',
    meaning: 'What you shape, provide, and make grow — work, resources, the material world you tend and the people you provide for.',
    proper: 'You build steadily — earned, reliable, careful with what you gather.',
    off: 'You move with opportunity — fluid and generous, drawn to the venture and the windfall more than the slow save.',
    faint: 'Tending the material world is not your centre of gravity — you may care little for gathering and holding, for better and worse.',
  },
  shape: {
    title: 'What shapes you',
    icon: 'sword',
    naturePhrase: 'the wind that bends a tree and the blade that prunes it',
    meaning: 'The pressures, duties, and challenges that discipline you — responsibility, authority, the forces that test and form your character.',
    proper: 'You are shaped by fair structure — duty, order, and roles you respect; you do well with clear expectations.',
    off: 'You are shaped by hard pressure — high stakes and intensity. The forge is fierce, but it makes you formidable.',
    faint: 'Few outside forces prune you. Life asks little discipline of you, so the structure has to come from within — or it goes missing.',
  },
  kin: {
    title: 'Your kin',
    icon: 'tree',
    naturePhrase: 'the other trees in the grove, the rest of the herd',
    meaning: 'Companions, rivals, and your sense of self among others — independence, cooperation, and competition with those like you.',
    proper: 'You stand among equals — cooperative, self-possessed, steady in who you are.',
    off: 'You live amid rivalry — competitive and bold, quick to act, sometimes giving away too much to keep pace.',
    faint: 'You stand rather alone — few of your own kind in your makeup. It can read as independence, or as a certain solitude.',
  },
};

const CAT_POL_BY_SHORT: Record<string, [RelationshipId, Polarity]> = {
  '比': ['kin', 'proper'], '劫': ['kin', 'off'],
  '食': ['express', 'proper'], '伤': ['express', 'off'],
  '财': ['tend', 'proper'], '才': ['tend', 'off'],
  '官': ['shape', 'proper'], '杀': ['shape', 'off'],
  '印': ['nourish', 'proper'], '枭': ['nourish', 'off'],
};
// pillar deities are stored as English names; invert for lookup
const CAT_POL_BY_ENGLISH: Record<string, [RelationshipId, Polarity]> = Object.fromEntries(
  Object.entries(DEITY_FULL_NAMES).map(([short, eng]) => [eng, CAT_POL_BY_SHORT[short]]),
);

// What one day master IS to another, through the same five-mode mask — the
// heart of the paired reading ("to Ana, Ben is the rain that feeds a growing
// thing"). Direction matters: this is what `other` is to `self`.
export function relationBetween(selfDm: string, otherDm: string): RelationshipId {
  const short = calculateDeity(selfDm, otherDm);
  return (CAT_POL_BY_SHORT[short]?.[0]) ?? 'kin';
}

export interface RelationshipReading {
  id: RelationshipId;
  title: string;
  icon: string;
  naturePhrase: string;
  meaning: string;
  prominence: 'strong' | 'present' | 'faint';
  flavorText: string;
  share: number;
}

// Aggregate the relationship "weight" across the chart (the self/day stem is
// excluded — that is you, not a relationship).
export function buildRelationships(chart: BaziChart): RelationshipReading[] {
  const weight: Record<RelationshipId, number> = { nourish: 0, express: 0, tend: 0, shape: 0, kin: 0 };
  const polWeight: Record<RelationshipId, { proper: number; off: number }> = {
    nourish: { proper: 0, off: 0 }, express: { proper: 0, off: 0 }, tend: { proper: 0, off: 0 },
    shape: { proper: 0, off: 0 }, kin: { proper: 0, off: 0 },
  };

  const add = (deityEnglish: string | undefined, w: number) => {
    if (!deityEnglish) return;
    const cp = CAT_POL_BY_ENGLISH[deityEnglish];
    if (!cp) return;
    weight[cp[0]] += w;
    polWeight[cp[0]][cp[1]] += w;
  };

  const pillars = [chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar].filter(Boolean);
  pillars.forEach((p) => {
    if (p !== chart.dayPillar) add(p.stem.deity, 3); // day stem is the self
    p.branch.hiddenStems.forEach((hs, i) => add(hs.deity, i === 0 ? 2 : 1));
  });

  const total = Object.values(weight).reduce((a, b) => a + b, 0) || 1;

  return (Object.keys(RELATIONSHIPS) as RelationshipId[])
    .map((id) => {
      const share = weight[id] / total;
      const prominence: RelationshipReading['prominence'] =
        share >= 0.26 ? 'strong' : share >= 0.12 ? 'present' : 'faint';
      const copy = RELATIONSHIPS[id];
      const pol = polWeight[id];
      const flavorText =
        prominence === 'faint' ? copy.faint : pol.off > pol.proper ? copy.off : copy.proper;
      return { id, title: copy.title, icon: copy.icon, naturePhrase: copy.naturePhrase, meaning: copy.meaning, prominence, flavorText, share };
    })
    .sort((a, b) => b.share - a.share);
}

// ── The seasons ahead (Da Yun 大运) ───────────────────────────────────────────

const SEASON_THEME: Record<RelationshipId, string> = {
  nourish: 'A nourishing stretch — support, learning, and care come more easily.',
  express: 'A season of giving — your work and expression want to come out into the world.',
  tend: 'A season of tending — building, resources, and responsibility take the foreground.',
  shape: 'A season that shapes you — pressure, duty, and growth through real challenge.',
  kin: 'A season among others — peers, rivalry, and questions of standing on your own.',
};
// A distinct label per exact relationship (the proper / eccentric flavour),
// so consecutive decades never read the same.
const SEASON_LABEL_BY_DEITY: Record<string, string> = {
  '印': 'Nourishing', '枭': 'Inward',
  '食': 'Creative', '伤': 'Expressive',
  '财': 'Building', '才': 'Opportunity',
  '官': 'Structured', '杀': 'Tested',
  '比': 'Companioned', '劫': 'Competitive',
};
const TONE_BY_DEITY: Record<string, LifeSeason['tone']> = {
  '印': 'kind', '枭': 'steady',
  '食': 'kind', '伤': 'kind',
  '财': 'steady', '才': 'steady',
  '官': 'steady', '杀': 'demanding',
  '比': 'steady', '劫': 'demanding',
};
// A short, unique essence per decade so no two cards read alike.
const SEASON_BLURB_BY_DEITY: Record<string, string> = {
  '印': 'support & learning', '枭': 'introspection & instinct',
  '食': 'gentle making', '伤': 'bold, original output',
  '财': 'work & resources', '才': 'ventures & windfalls',
  '官': 'duty & order', '杀': 'pressure & high stakes',
  '比': 'peers & allies', '劫': 'rivalry & drive',
};

export interface LifeSeason {
  startAge: number;
  endAge: number;
  startYear: number;
  element: ElementType;
  label: string;
  blurb: string;
  theme: string;
  tone: 'kind' | 'steady' | 'demanding';
  favor: number;          // element favorability + structural + 十二长生 vitality, −1..1
  structuralEvents: string[]; // 天克地冲 / 合冲会 with the natal chart
  stage: LifeStage;       // day master's 十二长生 phase in this 大运's branch
  note?: string;
  current: boolean;
}

export function buildLifeSeasons(chart: BaziChart, reading: XiangfaReading, nowYear: number): LifeSeason[] {
  const dm = chart.dayPillar.stem.chinese;
  const scarce = new Set(reading.needStatus.filter((n) => n.status === 'scarce').map((n) => n.need.element));
  const dominant = reading.dominantElement;

  return chart.daYun.map((cyc, i) => {
    const stemChar = cyc.pillar.stem.chinese;
    const short = calculateDeity(dm, stemChar);
    const cat = (CAT_POL_BY_SHORT[short]?.[0]) ?? 'kin';
    const element = STEMS[stemChar]?.element ?? ElementType.WOOD;

    const next = chart.daYun[i + 1];
    const current = nowYear >= cyc.year && (!next || nowYear < next.year);

    let tone: LifeSeason['tone'] = TONE_BY_DEITY[short] ?? 'steady';
    let note: string | undefined;
    if (scarce.has(element)) { tone = 'kind'; note = 'It brings a kind of force you have been short on.'; }
    else if (element === dominant) { tone = tone === 'kind' ? 'steady' : 'demanding'; note = 'It adds more of what you already carry in plenty.'; }

    // Decade favorability = 用神 element supply + structural interactions
    // (天克地冲/合冲会) + 十二长生 vitality-vs-life-stage (老怕帝旺、少怕衰…).
    const stage = stageOf(dm, cyc.pillar.branch.chinese);
    let favor = 0;
    let structuralEvents: string[] = [];
    if (chart.yongshen) {
      const base = pillarFavor(chart.yongshen.favor, cyc.pillar);
      const struct = structuralFavor(cyc.pillar, chart, chart.yongshen.favor);
      const vitality = vitalityMatch(dm, cyc.pillar.branch.chinese, cyc.startAge);
      structuralEvents = struct.events;
      favor = Math.max(-1, Math.min(1, base + struct.delta + vitality * 0.35));
    }

    return {
      startAge: cyc.startAge,
      endAge: cyc.endAge,
      startYear: cyc.year,
      element,
      label: SEASON_LABEL_BY_DEITY[short] ?? 'Steady',
      blurb: SEASON_BLURB_BY_DEITY[short] ?? '',
      theme: SEASON_THEME[cat],
      tone,
      favor,
      structuralEvents,
      stage,
      note,
      current,
    };
  });
}
