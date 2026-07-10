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

// Which palaces the pair sits between (局内 宫位): 年=roots/origins, 月=family &
// outer life, 日=self & closest bond, 时=later years & what you leave. This turns a
// bare 冲/刑 into a reading located in a real part of life (年月冲=离祖白手起家, etc.).
const PALACE_WHERE: Record<string, string> = {
  '01': 'It sits between where you come from and the family and work around you — early on, a pull to break from your origins and make your own ground.',
  '02': 'It sits between your early life and your own centre — the past keeps a hand on who you are.',
  '03': 'It sits between your beginnings and your later years — the two ends of your life ask for different things.',
  '12': 'It sits between your outer life — family and work — and your closest bond at the centre of you.',
  '13': 'It sits between your prime years and what you build for the end — the mid-to-late arc carries some turbulence.',
  '23': 'It sits between your closest bond and your later years — home and the long horizon pull apart.',
};
const palaceWhere = (i: number, j: number) => PALACE_WHERE[`${i}${j}`] ?? `Felt between ${DOMAIN[i]} and ${DOMAIN[j]}.`;

const CONTROLS_EL: Record<ElementType, ElementType> = { [WOOD]: EARTH, [EARTH]: WATER, [WATER]: FIRE, [FIRE]: METAL, [METAL]: WOOD };
const stemKe = (a: ElementType, b: ElementType) => CONTROLS_EL[a] === b || CONTROLS_EL[b] === a;

const hit = (pairs: string[][], a: string, b: string) => pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

function branchRelations(chart: BaziChart): BranchRelation[] {
  // hour dropped when the birth time is unknown; year/month/day keep indices 0/1/2 (宫位).
  const pillars = [chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar].filter(Boolean);
  const bs = pillars.map((p) => p.branch.chinese);
  const stems = pillars.map((p) => p.stem.chinese);
  const stemEls = pillars.map((p) => p.stem.element);
  const out: BranchRelation[] = [];
  const has = (c: string) => bs.includes(c);
  const claimedHarm = new Set<string>();
  const fuyinBranches = new Set<string>();

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
      const where = palaceWhere(i, j);

      // 伏吟 — the whole pillar repeated (stem AND branch), a note struck twice.
      if (stems[i] === stems[j] && a === b) {
        fuyinBranches.add(a);
        out.push({ kind: 'punish', title: 'An echo', poleA: 'Again', poleB: 'Again', theme: 'the same note struck twice — a part of your life repeats rather than moves on. It can harden into constancy, or settle into brooding over the same ground.', where });
        continue;
      }
      if (hit(CLASH_PAIRS, a, b) && CLASH[key]) {
        // 反吟 — 天克地冲: stem 克 on top of branch 冲, the whole season opposed.
        if (stemKe(stemEls[i], stemEls[j])) {
          out.push({ kind: 'clash', title: 'A reversal', poleA: CLASH[key].a, poleB: CLASH[key].b, theme: `${CLASH[key].theme} Here it runs deep — stem and branch both stand opposed — so it recurs: a part of your life that keeps overturning and rebuilding rather than settling.`, where });
        } else {
          out.push({ kind: 'clash', title: 'A clash', poleA: CLASH[key].a, poleB: CLASH[key].b, theme: CLASH[key].theme, where });
        }
      }
      else if (k(a, b) === k('子', '卯')) out.push({ kind: 'punish', title: 'Raw nerves', poleA: 'Closeness', poleB: 'Friction', theme: 'raw nerves with the people closest to you — impatience and sharp words where there should be ease.', where });
      else if (HARM[key] && !(claimedHarm.has(a) && claimedHarm.has(b))) out.push({ kind: 'harm', title: 'A quiet harm', poleA: HARM[key].a, poleB: HARM[key].b, theme: HARM[key].theme + ' Small and unseen, it asks for honesty before it festers.', where });
      else if (COMBINE[key]) out.push({ kind: 'combine', title: 'A bond', poleA: COMBINE[key].a, poleB: COMBINE[key].b, theme: COMBINE[key].theme, where });
    }
  }

  // self-punishment (a branch repeated) — but not when it's already an 伏吟 echo.
  const counts: Record<string, number> = {};
  bs.forEach((b) => { counts[b] = (counts[b] || 0) + 1; });
  for (const s of SELF_PUNISH) {
    if (counts[s] >= 2 && !fuyinBranches.has(s)) out.push({ kind: 'punish', title: 'An inner knot', poleA: 'Self', poleB: 'Self', theme: 'a knot you tie and untie within yourself — the friction is mostly internal, a fight you have with no one but you.', where: 'It lives largely inside you.' });
  }

  return out;
}

// ── heavenly-stem relations (天干五合 / 相冲) — the outward, visible drives ──────
// Stems are the parts of you that show on the surface; a 合 bonds two of them, a 冲
// sets them head-to-head. Data: docs/ganzhi-hekebiao.md.
const STEM_HE: Record<string, { with: string; hua: ElementType; theme: string }> = {
  甲: { with: '己', hua: EARTH, theme: 'a steadying bond — a part of you seeks fairness and a sensible middle, holding two drives to centre.' },
  己: { with: '甲', hua: EARTH, theme: 'a steadying bond — a part of you seeks fairness and a sensible middle, holding two drives to centre.' },
  乙: { with: '庚', hua: METAL, theme: 'a bond of principle — softness and resolve marry into a quiet sense of duty.' },
  庚: { with: '乙', hua: METAL, theme: 'a bond of principle — softness and resolve marry into a quiet sense of duty.' },
  丙: { with: '辛', hua: WATER, theme: 'a bond of poise — warmth reined into composure, presence held under a cool surface.' },
  辛: { with: '丙', hua: WATER, theme: 'a bond of poise — warmth reined into composure, presence held under a cool surface.' },
  丁: { with: '壬', hua: WOOD, theme: 'a tender, romantic bond — feeling and imagination entwine, drawn toward connection.' },
  壬: { with: '丁', hua: WOOD, theme: 'a tender, romantic bond — feeling and imagination entwine, drawn toward connection.' },
  戊: { with: '癸', hua: FIRE, theme: 'a cool, pragmatic bond — steadiness and depth pair without much heat; measured rather than sentimental.' },
  癸: { with: '戊', hua: FIRE, theme: 'a cool, pragmatic bond — steadiness and depth pair without much heat; measured rather than sentimental.' },
};
const STEM_CLASH: Record<string, string> = { 甲: '庚', 庚: '甲', 乙: '辛', 辛: '乙', 丙: '壬', 壬: '丙', 丁: '癸', 癸: '丁' };
const STEM_EL: Record<string, ElementType> = {
  甲: WOOD, 乙: WOOD, 丙: FIRE, 丁: FIRE, 戊: EARTH, 己: EARTH, 庚: METAL, 辛: METAL, 壬: WATER, 癸: WATER,
};

function stemRelations(chart: BaziChart, reading: XiangfaReading): BranchRelation[] {
  const ss = [chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar]
    .filter(Boolean)
    .map((p) => p.stem.chinese);
  const out: BranchRelation[] = [];
  const combos: { i: number; j: number; hua: ElementType; theme: string }[] = [];
  const combineCount: Record<number, number> = {};

  // Pass 1 — 五合. Count how many bonds each stem is in (for 争合 and 贪合忘冲).
  for (let i = 0; i < ss.length; i++) {
    for (let j = i + 1; j < ss.length; j++) {
      if (STEM_HE[ss[i]]?.with === ss[j]) {
        combineCount[i] = (combineCount[i] || 0) + 1;
        combineCount[j] = (combineCount[j] || 0) + 1;
        combos.push({ i, j, hua: STEM_HE[ss[i]].hua, theme: STEM_HE[ss[i]].theme });
      }
    }
  }

  // 贪合忘冲: a stem held in a clean 1-1 五合 lets go of its 冲 (same principle as
  // the branch layer). A 争合 (contended, never settles) does NOT bind, so its 冲 stays.
  const bound = new Set<number>();
  for (const c of combos) {
    if (combineCount[c.i] < 2 && combineCount[c.j] < 2) { bound.add(c.i); bound.add(c.j); }
  }

  // Pass 2 — 相冲, released when either pole is 合-bound (贪合忘冲).
  for (let i = 0; i < ss.length; i++) {
    for (let j = i + 1; j < ss.length; j++) {
      const a = ss[i], b = ss[j];
      if (STEM_CLASH[a] === b && !bound.has(i) && !bound.has(j)) {
        const mw = '甲乙庚辛'.includes(a); // 金木冲 vs 水火冲
        out.push({
          kind: 'clash', title: 'An open clash',
          poleA: FORCE[STEM_EL[a]], poleB: FORCE[STEM_EL[b]],
          theme: mw
            ? 'resolve against growth — an urge to cut and refine warring openly with the urge to expand; quick to spark on the surface.'
            : 'heat against depth — bright outward expression against cool reflection; a visible push-pull in how you meet the world.',
          where: palaceWhere(i, j),
        });
      }
    }
  }

  for (const c of combos) {
    // 化 (a supported 化神 element) vs 绊 (合而不化, mutual drag).
    const fused = (reading.elementShare[c.hua] ?? 0) >= 0.22;
    const contended = combineCount[c.i] >= 2 || combineCount[c.j] >= 2; // 争合/妒合
    const tail = contended
      ? ' But more than one part of you reaches for this same bond — a quiet rivalry over one connection, so it never fully settles (争合).'
      : fused
      ? ` These settle into ${FORCE[c.hua].toLowerCase()} — a productive union that makes something.`
      : ' Yet nothing quite forms from it — more a mutual holding-back, each drive quietly draining the other (合而不化，成绊).';
    out.push({
      kind: 'combine', title: 'An outward bond',
      poleA: FORCE[STEM_EL[ss[c.i]]], poleB: FORCE[STEM_EL[ss[c.j]]],
      theme: c.theme + tail, where: palaceWhere(c.i, c.j),
    });
  }
  return out;
}

// ── cross-chart relations (合婚 layer) — the same palaces, facing each other ──
// Set two charts side by side and compare like palace with like palace:
// year↔year (origins), month↔month (outer lives), day↔day (innermost seats),
// hour↔hour (later years). Reuses the same clash/harm/combine tables.
const CROSS_WHERE = [
  'It sits between where you each come from — family, origins, first ground.',
  'It sits between your outer lives — the everyday worlds you each move in.',
  'It sits between your two innermost seats — the private core each of you keeps.',
  'It sits between your later years — where your two long horizons meet.',
];
// Day palace first: it is the seat the relationship actually lives in.
const CROSS_ORDER = [2, 1, 0, 3];

export function buildCrossRelations(chartA: BaziChart, chartB: BaziChart): BranchRelation[] {
  const pa = [chartA.yearPillar, chartA.monthPillar, chartA.dayPillar, chartA.hourPillar];
  const pb = [chartB.yearPillar, chartB.monthPillar, chartB.dayPillar, chartB.hourPillar];
  const out: BranchRelation[] = [];

  for (const i of CROSS_ORDER) {
    if (!pa[i] || !pb[i]) continue;
    const a = pa[i].branch.chinese;
    const b = pb[i].branch.chinese;
    const key = k(a, b);
    const where = CROSS_WHERE[i];

    if (hit(CLASH_PAIRS, a, b) && CLASH[key]) {
      out.push({ kind: 'clash', title: 'A clash between you', poleA: CLASH[key].a, poleB: CLASH[key].b, theme: `${CLASH[key].theme} Between two people it is the friction that keeps returning — familiar ground you circle back to.`, where });
    } else if (k(a, b) === k('子', '卯')) {
      out.push({ kind: 'punish', title: 'Raw nerves between you', poleA: 'Closeness', poleB: 'Friction', theme: 'raw nerves where you are closest — impatience and sharp words where there should be ease.', where });
    } else if (HARM[key]) {
      out.push({ kind: 'harm', title: 'A quiet strain', poleA: HARM[key].a, poleB: HARM[key].b, theme: HARM[key].theme + ' Small and easy to miss between two people — it asks for honesty before it festers.', where });
    } else if (COMBINE[key]) {
      out.push({ kind: 'combine', title: 'A lock between you', poleA: COMBINE[key].a, poleB: COMBINE[key].b, theme: `${COMBINE[key].theme} Where charts lock like this, being together simply feels easier than being apart.`, where });
    }
  }
  return out.slice(0, 4);
}

const REL_RANK = { clash: 0, punish: 1, bond: 2, harm: 3, combine: 4 };

export function buildInteractions(chart: BaziChart, reading: XiangfaReading): InteractionsReading {
  const raw = [...branchRelations(chart), ...stemRelations(chart, reading)];
  const seen = new Set<string>();
  const relations = raw
    .filter((r) => (seen.has(r.theme) ? false : (seen.add(r.theme), true)))
    .sort((x, y) => REL_RANK[x.kind] - REL_RANK[y.kind])
    .slice(0, 4);
  return { dynamics: elementDynamics(reading), relations };
}
