import { BaziChart, ElementType } from '../../types';
import { XiangfaReading } from './index';

// How the five forces act on one another inside a person (五行生克), and how the
// branches of the chart pull and bond (地支刑冲合害) — rendered as concrete
// nature / psychology axes, never as jargon.

const { WOOD, FIRE, EARTH, METAL, WATER } = ElementType;

export const FORCE: Record<ElementType, string> = {
  [WOOD]: 'Growth', [FIRE]: 'Warmth', [EARTH]: 'Ground', [METAL]: 'Structure', [WATER]: 'Flow',
};

const CONTROLS: Record<ElementType, ElementType> = { [WOOD]: EARTH, [EARTH]: WATER, [WATER]: FIRE, [FIRE]: METAL, [METAL]: WOOD };

const CONTROL_COPY: Record<ElementType, { verb: string; meaning: string }> = {
  [WOOD]: { verb: 'breaks open', meaning: 'your drive to grow keeps unsettling your need for solid ground — you outgrow your own comfort before it has time to set.' },
  [EARTH]: { verb: 'dams', meaning: 'your steadiness can wall in your feelings and your flexibility — a safety bought at the cost of flow.' },
  [WATER]: { verb: 'cools', meaning: 'your reflection and caution can quietly dampen your spark — you think a feeling through until its heat is gone.' },
  [FIRE]: { verb: 'forges', meaning: 'your passion hammers on your structure — the same heat that can sharpen your discipline can also burn it up.' },
  [METAL]: { verb: 'prunes', meaning: 'your judgement and self-discipline keep cutting back your spontaneity — order kept at the expense of play.' },
};

export interface ElementDynamic {
  kind: 'tension';
  from: ElementType;
  to: ElementType;
  verb: string;
  relationCn: string; // faint heritage note: 克 (controls)
  title: string;
  phrase: string;
  meaning: string;
}

export interface BranchRelation {
  kind: 'clash' | 'punish' | 'harm' | 'combine' | 'bond';
  title: string;
  poleA: string;
  poleB: string;
  theme: string;
  where: string;
}

export interface InteractionsReading {
  dynamics: ElementDynamic[];
  relations: BranchRelation[];
}

// ── element dynamics (生克) ───────────────────────────────────────────────────
function elementDynamics(reading: XiangfaReading): ElementDynamic[] {
  const out: ElementDynamic[] = [];
  const dom = reading.dominantElement;
  const weak = reading.weakestElement;

  const target = CONTROLS[dom];
  const c = CONTROL_COPY[dom];
  out.push({
    kind: 'tension', from: dom, to: target, verb: c.verb, relationCn: '克',
    title: `${FORCE[dom]} over ${FORCE[target]}`,
    phrase: `Your ${FORCE[dom].toLowerCase()} ${c.verb} your ${FORCE[target].toLowerCase()}`,
    meaning: c.meaning,
  });

  const controllerOfWeak = (Object.keys(CONTROLS) as ElementType[]).find((e) => CONTROLS[e] === weak)!;
  const dup = controllerOfWeak === dom && target === weak;
  if (!dup && reading.elementShare[controllerOfWeak] >= 0.2) {
    const c2 = CONTROL_COPY[controllerOfWeak];
    out.push({
      kind: 'tension', from: controllerOfWeak, to: weak, verb: c2.verb, relationCn: '克',
      title: `Why your ${FORCE[weak]} stays quiet`,
      phrase: `Your ${FORCE[controllerOfWeak].toLowerCase()} ${c2.verb} your ${FORCE[weak].toLowerCase()}`,
      meaning: `${c2.meaning} It is part of why ${FORCE[weak].toLowerCase()} runs so quiet in you.`,
    });
  }
  return out;
}

// ── branch relations (刑冲合害), each with a concrete axis ─────────────────────
const k = (a: string, b: string) => [a, b].sort().join('');

const CLASH: Record<string, { a: string; b: string; theme: string }> = {
  [k('子', '午')]: { a: 'Stillness', b: 'Drive', theme: 'a pull between rest and motion — you need quiet, yet something keeps pulling you out to be seen and busy.' },
  [k('丑', '未')]: { a: 'Duty', b: 'Heart', theme: 'two kinds of holding on — obligation against sentiment, with a slow stubbornness about letting change in.' },
  [k('寅', '申')]: { a: 'Setting out', b: 'Reining in', theme: 'a pull between reaching outward and pulling back — restlessness and movement against the brakes you put on yourself.' },
  [k('卯', '酉')]: { a: 'Soft growth', b: 'Sharp edges', theme: 'a pull between tender growth and clean cutting — gentleness against the urge to refine and judge.' },
  [k('辰', '戌')]: { a: 'What you keep', b: 'What surfaces', theme: 'two locked vaults grinding open — buried things that keep insisting on coming to light.' },
  [k('巳', '亥')]: { a: 'Bright plans', b: 'Deep currents', theme: 'a pull between your ideals and your undertow — clear vision against the feelings running beneath it.' },
};

const HARM: Record<string, { a: string; b: string; theme: string }> = {
  [k('子', '未')]: { a: 'Giving', b: 'Being drawn on', theme: 'a quiet resentment where care is taken for granted.' },
  [k('丑', '午')]: { a: 'Patience', b: 'Heat', theme: 'a slow chafe between steadiness and a quicker temper.' },
  [k('寅', '巳')]: { a: 'Ambition', b: 'Itself', theme: 'eagerness that trips over its own feet.' },
  [k('卯', '辰')]: { a: 'Growth', b: 'Undertow', theme: 'progress that gets quietly undercut from below.' },
  [k('申', '亥')]: { a: 'Effort', b: 'Leakage', theme: 'work that seeps away before it is seen.' },
  [k('酉', '戌')]: { a: 'Precision', b: 'Stubbornness', theme: 'fine judgement worn down by sheer obstinacy.' },
};

const COMBINE: Record<string, { a: string; b: string; theme: string }> = {
  [k('子', '丑')]: { a: 'Depth', b: 'Ground', theme: 'feeling and stability lock together and steady each other.' },
  [k('寅', '亥')]: { a: 'Spark', b: 'Source', theme: 'your ideas and the wellspring that feeds them move as one.' },
  [k('卯', '戌')]: { a: 'Growth', b: 'Guard', theme: 'tender growth and steady guardianship reinforce each other.' },
  [k('辰', '酉')]: { a: 'Depth', b: 'Edge', theme: 'inner reserves and clear precision bond into real craft.' },
  [k('巳', '申')]: { a: 'Vision', b: 'Craft', theme: 'ideas and skill lock together — you can build what you imagine.' },
  [k('午', '未')]: { a: 'Warmth', b: 'Care', theme: 'warmth and nurture bond into a natural generosity.' },
};

const TRINES: { set: [string, string, string]; force: ElementType }[] = [
  { set: ['申', '子', '辰'], force: WATER }, { set: ['寅', '午', '戌'], force: FIRE },
  { set: ['巳', '酉', '丑'], force: METAL }, { set: ['亥', '卯', '未'], force: WOOD },
];

const CLASH_PAIRS = [['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥']];
const SELF_PUNISH = ['辰', '午', '酉', '亥'];
const DOMAIN = ['your early life', 'your everyday nature', 'your inner core', 'your later years'];

const hit = (pairs: string[][], a: string, b: string) => pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

function branchRelations(chart: BaziChart): BranchRelation[] {
  const bs = [
    chart.yearPillar.branch.chinese, chart.monthPillar.branch.chinese,
    chart.dayPillar.branch.chinese, chart.hourPillar.branch.chinese,
  ];
  const out: BranchRelation[] = [];
  const has = (c: string) => bs.includes(c);
  const claimedHarm = new Set<string>();

  // strong three-part currents (三合)
  for (const t of TRINES) {
    if (t.set.every(has)) {
      out.push({ kind: 'bond', title: 'A strong current', poleA: 'Three parts', poleB: 'one pull', theme: `a powerful ${FORCE[t.force].toLowerCase()} current runs through much of who you are — when it points where you want to go, it carries you a long way.`, where: 'It threads through several parts of you.' });
    }
  }

  // three-part punishments (恃势 / 无恩) — partial (2) or full (3)
  if (['寅', '巳', '申'].filter(has).length >= 2) {
    out.push({ kind: 'punish', title: 'A recurring tangle', poleA: 'Push', poleB: 'Overreach', theme: 'a tangle of ambition and overstep — drive that keeps doubling back on you, where good intentions and overreach trade places.', where: 'It returns at the edges of your ambition.' });
    ['寅', '巳'].forEach((c) => claimedHarm.add(c));
  }
  if (['丑', '戌', '未'].filter(has).length >= 2) {
    out.push({ kind: 'punish', title: 'A contest of wills', poleA: 'Will', poleB: 'Yielding', theme: 'stubborn collisions of will — a quiet contest over who gives way, fought slowly and held long.', where: 'It surfaces wherever pride is on the line.' });
  }

  // pairwise
  for (let i = 0; i < bs.length; i++) {
    for (let j = i + 1; j < bs.length; j++) {
      const a = bs[i], b = bs[j], key = k(a, b);
      const where = `Felt between ${DOMAIN[i]} and ${DOMAIN[j]}.`;
      if (hit(CLASH_PAIRS, a, b) && CLASH[key]) out.push({ kind: 'clash', title: 'A clash', poleA: CLASH[key].a, poleB: CLASH[key].b, theme: CLASH[key].theme, where });
      else if (k(a, b) === k('子', '卯')) out.push({ kind: 'punish', title: 'Raw nerves', poleA: 'Closeness', poleB: 'Friction', theme: 'raw nerves with the people closest to you — impatience and sharp words where there should be ease.', where });
      else if (HARM[key] && !(claimedHarm.has(a) && claimedHarm.has(b))) out.push({ kind: 'harm', title: 'A quiet harm', poleA: HARM[key].a, poleB: HARM[key].b, theme: HARM[key].theme + ' Small and unseen, it asks for honesty before it festers.', where });
      else if (COMBINE[key]) out.push({ kind: 'combine', title: 'A bond', poleA: COMBINE[key].a, poleB: COMBINE[key].b, theme: COMBINE[key].theme, where });
    }
  }

  // self-punishment (a branch repeated)
  const counts: Record<string, number> = {};
  bs.forEach((b) => { counts[b] = (counts[b] || 0) + 1; });
  for (const s of SELF_PUNISH) {
    if (counts[s] >= 2) out.push({ kind: 'punish', title: 'An inner knot', poleA: 'Self', poleB: 'Self', theme: 'a knot you tie and untie within yourself — the friction is mostly internal, a fight you have with no one but you.', where: 'It lives largely inside you.' });
  }

  const rank = { clash: 0, punish: 1, bond: 2, harm: 3, combine: 4 };
  // de-duplicate by theme, prioritise, cap at 3
  const seen = new Set<string>();
  return out
    .filter((r) => (seen.has(r.theme) ? false : (seen.add(r.theme), true)))
    .sort((x, y) => rank[x.kind] - rank[y.kind])
    .slice(0, 3);
}

export function buildInteractions(chart: BaziChart, reading: XiangfaReading): InteractionsReading {
  return { dynamics: elementDynamics(reading), relations: branchRelations(chart) };
}
