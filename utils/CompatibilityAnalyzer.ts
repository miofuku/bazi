import { ElementType, Favor, StrengthReading, YongshenReading } from '../types';
import { tenGods, TenGods } from './YongshenSelector';
import { BRANCHES } from './constants';

// 关系适配 (Phase 3) — compares two people's charts, built on the per-person
// 用神 engine. Two universal axes plus lens-specific detail:
//   1. 能量供需 (universal): does A's chart supply B's 喜神 / feed B's 忌? ASYMMETRIC.
//   2. 角色互补 (partner lens): do their 十神 domains cover the key business roles,
//      where are the gaps, and how high is 比劫 rivalry risk?
//   3. 配偶宫互藏 (marriage lens): does each person's 日支 (spouse palace) hold the
//      other's 用神/喜?

export type RelationLens = 'partner' | 'marriage';

export interface Person {
  label: string;
  strength: StrengthReading;
  yongshen: YongshenReading;
  dayBranch: string; // 日支 char (spouse palace)
}

export interface SupplyDirection {
  from: string;
  to: string;
  score: number;
  brings: { element: ElementType; share: number; favor: Favor }[];
}

export interface RoleCoverage {
  covered: string[];  // key roles at least one partner is strong in
  gaps: string[];     // key roles neither covers (blind spots)
  overlaps: string[]; // roles both are strong in (collision risk)
}

export interface Rivalry {
  level: 'low' | 'medium' | 'high';
  reason: string;
}

export interface SpousePalace {
  from: string; // whose palace
  holds: ElementType[]; // other's favorable elements held in the palace
  clashes: ElementType[]; // other's 忌 held in the palace
  score: number;
}

export type GroupProfile = Record<keyof TenGods, number>; // 十神-group shares

export interface CompatibilityReading {
  lens: RelationLens;
  aToB: SupplyDirection;
  bToA: SupplyDirection;
  mutualScore: number;
  asymmetry: number;
  samePeers: boolean;
  domainA: string;
  domainB: string;
  divergentDomains: boolean;
  profiles: { a: GroupProfile; b: GroupProfile }; // for the role radar
  roleCoverage?: RoleCoverage;         // partner
  rivalry?: Rivalry;                   // partner
  spousePalace?: [SpousePalace, SpousePalace]; // marriage
  note: string;
}

const FAVOR_WEIGHT: Record<Favor, number> = { favorable: 1, neutral: 0, unfavorable: -1 };

// 十神 group → founder-role label (first word is the short radar label).
export const ROLE: Record<keyof TenGods, string> = {
  output: 'Product·Vision·Craft',
  wealth: 'Growth·Deals·Ops',
  authority: 'Execution·Rigor',
  resource: 'Ballast·Knowledge',
  self: 'Drive·Leadership',
};
// Radar axis order (key roles first).
export const ROLE_ORDER: (keyof TenGods)[] = ['output', 'wealth', 'authority', 'resource', 'self'];
// The roles a founding team most needs to cover.
const KEY_ROLES: (keyof TenGods)[] = ['output', 'wealth', 'authority'];
const STRONG = 0.22; // a 十神 group above this share is a personal strength

const shares = (power: Record<ElementType, number>): Record<ElementType, number> => {
  const total = Object.values(power).reduce((a, b) => a + b, 0) || 1;
  return Object.fromEntries(
    (Object.keys(power) as ElementType[]).map((e) => [e, power[e] / total]),
  ) as Record<ElementType, number>;
};

// 十神-group shares for a person, relative to their own day master.
const groupShares = (p: Person): Record<keyof TenGods, number> => {
  const g = tenGods(p.strength.dayElement);
  const pw = p.strength.elementPower;
  const raw = {
    self: pw[g.self], resource: pw[g.resource], output: pw[g.output],
    wealth: pw[g.wealth], authority: pw[g.authority],
  };
  const total = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
  return Object.fromEntries(
    (Object.keys(raw) as (keyof TenGods)[]).map((k) => [k, raw[k] / total]),
  ) as Record<keyof TenGods, number>;
};

const strongGroups = (p: Person): Set<keyof TenGods> => {
  const gs = groupShares(p);
  return new Set((Object.keys(gs) as (keyof TenGods)[]).filter((k) => gs[k] >= STRONG));
};

const dominantGroup = (p: Person): keyof TenGods => {
  const gs = groupShares(p);
  return (Object.keys(gs) as (keyof TenGods)[]).reduce((a, b) => (gs[b] > gs[a] ? b : a));
};

const supply = (from: Person, to: Person): SupplyDirection => {
  const fromShare = shares(from.strength.elementPower);
  const favor = to.yongshen.favor;
  let score = 0;
  const contribs = (Object.keys(fromShare) as ElementType[]).map((e) => {
    const v = fromShare[e] * FAVOR_WEIGHT[favor[e]];
    score += v;
    return { element: e, share: fromShare[e], favor: favor[e], v };
  });
  const brings = contribs
    .filter((c) => c.favor !== 'neutral' && c.share > 0.08)
    .sort((a, b) => Math.abs(b.v) - Math.abs(a.v))
    .slice(0, 3)
    .map(({ element, share, favor }) => ({ element, share, favor }));
  return { from: from.label, to: to.label, score, brings };
};

const roleCoverage = (a: Person, b: Person): RoleCoverage => {
  const sa = strongGroups(a);
  const sb = strongGroups(b);
  const covered: string[] = [];
  const gaps: string[] = [];
  const overlaps: string[] = [];
  KEY_ROLES.forEach((r) => {
    const inA = sa.has(r);
    const inB = sb.has(r);
    if (inA && inB) overlaps.push(ROLE[r]);
    if (inA || inB) covered.push(ROLE[r]);
    else gaps.push(ROLE[r]);
  });
  return { covered, gaps, overlaps };
};

const rivalryRisk = (a: Person, b: Person, samePeers: boolean): Rivalry => {
  const sa = strongGroups(a);
  const sb = strongGroups(b);
  const bothSelfDriven = sa.has('self') && sb.has('self');
  const overlap = [...sa].some((g) => g !== 'self' && sb.has(g));
  const balancedPower =
    a.strength.category === b.strength.category; // no natural 主辅

  let score = 0;
  const reasons: string[] = [];
  if (samePeers) { score += 1; reasons.push(`both ${(a.strength.dayElement as string).toLowerCase()} day masters (比劫)`); }
  if (bothSelfDriven) { score += 1; reasons.push('both driven to lead'); }
  if (overlap) { score += 1; reasons.push('overlapping strengths'); }
  if (balancedPower) { score += 1; reasons.push('evenly matched, no natural lead'); }
  else { score -= 1; reasons.push('different weights, a natural lead & second'); }

  const level = score <= 0 ? 'low' : score === 1 ? 'medium' : 'high';
  return { level, reason: reasons.join('; ') };
};

// Elements held in a person's 日支 (spouse palace), via hidden stems.
const palaceElements = (p: Person): ElementType[] => {
  const branch = BRANCHES[p.dayBranch];
  const els = (branch?.hiddenStems ?? []).map((s) => s.element);
  return [...new Set(els)];
};

const spousePalace = (holder: Person, receiver: Person): SpousePalace => {
  const els = palaceElements(holder);
  const favor = receiver.yongshen.favor;
  const holds = els.filter((e) => favor[e] === 'favorable');
  const clashes = els.filter((e) => favor[e] === 'unfavorable');
  const score = els.reduce((s, e) => s + FAVOR_WEIGHT[favor[e]], 0) / (els.length || 1);
  return { from: holder.label, holds, clashes, score };
};

export const analyzeCompatibility = (
  a: Person,
  b: Person,
  lens: RelationLens,
): CompatibilityReading => {
  const aToB = supply(a, b);
  const bToA = supply(b, a);
  const mutualScore = (aToB.score + bToA.score) / 2;
  const asymmetry = Math.abs(aToB.score - bToA.score);
  const samePeers = a.strength.dayElement === b.strength.dayElement;
  const dA = dominantGroup(a);
  const dB = dominantGroup(b);
  const divergentDomains = dA !== dB;

  const els = (arr: ElementType[]) => arr.map((e) => (e as string).toLowerCase()).join(' & ');
  // Directional supply score; the elements each brings are shown visually in the
  // SupplyRow above, so the note keeps just the numbers.
  const feed = (d: SupplyDirection) =>
    `${d.from} → ${d.to}: ${d.score >= 0 ? '+' : ''}${d.score.toFixed(2)}`;

  const reading: CompatibilityReading = {
    lens, aToB, bToA, mutualScore, asymmetry, samePeers,
    domainA: ROLE[dA], domainB: ROLE[dB], divergentDomains,
    profiles: { a: groupShares(a), b: groupShares(b) },
    note: '',
  };

  let note = `${feed(aToB)}; ${feed(bToA)}.`;
  if (asymmetry > 0.25) {
    const s = aToB.score > bToA.score ? aToB : bToA;
    note += ` It runs uneven — ${s.from} nourishes ${s.to} more than the other way round.`;
  }

  if (lens === 'partner') {
    const cov = roleCoverage(a, b);
    const riv = rivalryRisk(a, b, samePeers);
    reading.roleCoverage = cov;
    reading.rivalry = riv;

    // 用神互补 = chemistry — for co-founders only the spark, not durability. Staying
    // power rests on the role split + rivalry axes below (相吸 ≠ 长久有效).
    note += mutualScore > 0.15
      ? ' Your energies draw together — real chemistry (用神互补). But a spark is only the start; whether it lasts rests on the split of roles and the pull for control below.'
      : ' The energy exchange is quiet — less natural draw, more worked out in the doing; it stands or falls on the role split and rivalry below.';
    note += divergentDomains
      ? ` Your strengths point different ways (${a.label} toward ${ROLE[dA].split('·')[0]}, ${b.label} toward ${ROLE[dB].split('·')[0]}) — a natural division of labour.`
      : ` You lead with the same strength (both ${ROLE[dA].split('·')[0]}) — you may reach for the same seat.`;
    note += ` Key roles covered: ${cov.covered.map((r) => r.split('·')[0]).join(', ') || 'none'}`;
    if (cov.gaps.length) note += `; blind spots in ${cov.gaps.map((r) => r.split('·')[0]).join(', ')} (worth a third person)`;
    if (cov.overlaps.length) note += `; both strong in ${cov.overlaps.map((r) => r.split('·')[0]).join(', ')} — risk of collision`;
    note += `. Rivalry for the lead (比劫): ${riv.level} — ${riv.reason}.`;
  } else {
    const sp: [SpousePalace, SpousePalace] = [spousePalace(a, b), spousePalace(b, a)];
    reading.spousePalace = sp;

    note += samePeers ? ' Same day-master element — kindred temperaments, more like siblings.' : ' Different day masters — opposites that draw each other in.';
    // 用神互补 measures chemistry/attraction, NOT longevity — validated inverted on
    // royal marriages (docs/王室家庭关系边表.csv): 相吸 ≠ 相守.
    note += mutualScore > 0.15
      ? ' Your energies attract (用神互补) — strong chemistry. But attraction isn’t endurance; lasting comes down to tending and the spouse palace.'
      : ' The energy pull is faint — little born-in draw, so the bond leans on tending rather than natural fit.';
    const desc = (s: SpousePalace, other: string) =>
      s.holds.length
        ? `${s.from}’s holds ${els(s.holds)} — just what ${other} thrives on${s.clashes.length ? `, though it also carries ${els(s.clashes)} they’d rather avoid` : ''}`
        : `${s.from}’s holds none of what ${other} thrives on${s.clashes.length ? `, and carries ${els(s.clashes)} against them` : ''}`;
    note += ` Spouse palace (配偶宫): ${desc(sp[0], b.label)}; ${desc(sp[1], a.label)}.`;
  }

  reading.note = note;
  return reading;
};
