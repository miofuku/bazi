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

// 十神 group → founder-role label, masked as parts of one growing thing (first
// word is the short radar label; the gloss after it surfaces in the a11y text).
export const ROLE: Record<keyof TenGods, string> = {
  output: 'Fruit·what you make',
  wealth: 'Harvest·growth & resources',
  authority: 'Pruning·rigor & follow-through',
  resource: 'Roots·knowledge & ballast',
  self: 'Trunk·drive & leadership',
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

  const reading: CompatibilityReading = {
    lens, aToB, bToA, mutualScore, asymmetry, samePeers,
    domainA: ROLE[dA], domainB: ROLE[dB], divergentDomains,
    profiles: { a: groupShares(a), b: groupShares(b) },
    note: '',
  };

  // The note is a short human SYNTHESIS — the "so what". The scores, role coverage,
  // rivalry, and spouse-palace elements are all shown in the cards above, so the note
  // interprets rather than re-lists them.
  let note = '';
  if (lens === 'partner') {
    const cov = roleCoverage(a, b);
    const riv = rivalryRisk(a, b, samePeers);
    reading.roleCoverage = cov;
    reading.rivalry = riv;

    const spark = mutualScore > 0.15
      ? 'You’d take to each other quickly — each of you supplies what the other runs short on'
      : 'There’s no instant spark here; the fit is something you’d build in the work, not feel at the start';
    const roles = divergentDomains
      ? 'and you lead from different strengths, so the work splits naturally between you'
      : `and you’re strongest in the same place (${ROLE[dA].split('·')[0]}), so you’d reach for the same calls and leave the same gaps`;
    note = `${spark}, ${roles}.`;
    if (cov.gaps.length) note += ` The gap you’d share is ${cov.gaps.map((r) => r.split('·')[0]).join(' & ')} — worth a third person who lives there.`;
    if (riv.level === 'high') note += ' And with no natural lead between you, agree early who owns which calls, before the pull for control settles it for you.';
  } else {
    reading.spousePalace = [spousePalace(a, b), spousePalace(b, a)];

    const kin = samePeers ? 'You’re cut from the same cloth — kindred more than opposite' : 'You meet as opposites, each holding what the other doesn’t';
    const spark = mutualScore > 0.15
      ? 'and there’s a real, born-in pull between you'
      : 'and the pull between you is quiet — a bond you’d grow into rather than fall into';
    note = `${kin}, ${spark}.`;
  }

  reading.note = note;
  return reading;
};
