import { BaziChart } from '../../types';
import { XiangfaReading, buildXiangfaReading, ThriveNeed } from './index';
import { RELATIONSHIPS, RelationshipId, relationBetween, buildLifeSeasons, LifeSeason } from './relationships';
import { FORCE, BranchRelation, buildCrossRelations } from './interactions';

// The paired reading's composition layer: weave two complete single readings
// into one relational narrative — what you are to each other, who holds whose
// needs, where the charts rub or lock, and how your decades run in step.

const lf = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

// ── A1 · what you are to each other ──────────────────────────────────────────
// Direction-specific gloss per mode: what `other` being X means for `self`.
const MODE_LINE: Record<RelationshipId, (self: string, other: string) => string> = {
  nourish: (self, other) => `Care and steadiness flow from ${other} toward ${self} — shelter, feeding, things quietly learned.`,
  express: (self, other) => `${self} opens up around ${other} — making, playing, and pouring out more than usual. ${other} is where ${self}'s expression lands.`,
  tend: (self, other) => `${other} is ground ${self} wants to work — ${self} provides, builds, and carries responsibility here, and the harvest shows.`,
  shape: (self, other) => `${other} presses on ${self} — expectation and challenge that can sharpen ${self} or chafe, depending on the season.`,
  kin: (self, other) => `${other} is ${self}'s own kind — instant familiarity and shared appetite, with the rivalry that sameness brings.`,
};

export interface MutualDirection {
  self: string;          // who this is read FOR
  other: string;         // who is being read
  id: RelationshipId;
  naturePhrase: string;  // "the rain and deep soil that feed a growing thing"
  line: string;
}

// ── A2 · what you each need, and who holds it ────────────────────────────────
export interface NeedSupplyRow {
  who: string;
  other: string;
  need: ThriveNeed;
  ownStatus: 'scarce' | 'present' | 'abundant';
  otherLevel: 'plenty' | 'some' | 'thin';
  line: string;
}

const needRowsFor = (who: string, other: string, reading: XiangfaReading, otherReading: XiangfaReading): NeedSupplyRow[] =>
  reading.needStatus.slice(0, 2).map(({ need, status }) => {
    const share = otherReading.elementShare[need.element];
    const otherLevel: NeedSupplyRow['otherLevel'] = share > 0.3 ? 'plenty' : share >= 0.12 ? 'some' : 'thin';
    const force = FORCE[need.element].toLowerCase();
    let line: string;
    if (otherLevel === 'plenty') {
      line = status === 'scarce'
        ? `${other} carries ${force} in plenty — exactly the weather ${who} runs short on.`
        : `${other} carries ${force} in plenty, adding to what ${who} already holds.`;
    } else if (otherLevel === 'some') {
      line = `${other} has a fair measure of it to share.`;
    } else {
      line = status === 'scarce'
        ? `${other} runs thin on it too — this one you'd both have to find outside the pair.`
        : `${other} runs thin on it, though ${who} carries their own.`;
    }
    return { who, other, need, ownStatus: status, otherLevel, line };
  });

// ── B · decades in step ──────────────────────────────────────────────────────
export interface SeasonBand {
  label: string;
  segments: { fromYear: number; toYear: number; favor: number }[]; // clipped to window
}
export interface JointWindow { fromYear: number; toYear: number }

const favorAt = (seasons: LifeSeason[], year: number): number => {
  const s = seasons.find((x) => year >= x.startYear && year < x.startYear + 10);
  return s ? s.favor : 0;
};

const bandFor = (label: string, seasons: LifeSeason[], from: number, to: number): SeasonBand => {
  const segments: SeasonBand['segments'] = [];
  for (let y = from; y < to; y++) {
    const favor = favorAt(seasons, y);
    const last = segments[segments.length - 1];
    if (last && Math.abs(last.favor - favor) < 0.001) last.toYear = y + 1;
    else segments.push({ fromYear: y, toYear: y + 1, favor });
  }
  return { label, segments };
};

const TAIL = 0.15;
const jointWindows = (a: LifeSeason[], b: LifeSeason[], from: number, to: number): JointWindow[] => {
  const out: JointWindow[] = [];
  for (let y = from; y < to; y++) {
    const joint = favorAt(a, y) > TAIL && favorAt(b, y) > TAIL;
    const last = out[out.length - 1];
    if (joint) {
      if (last && last.toYear === y) last.toYear = y + 1;
      else out.push({ fromYear: y, toYear: y + 1 });
    }
  }
  return out.filter((w) => w.toYear - w.fromYear >= 2);
};

const windWord = (f: number) => (f > TAIL ? 'tailwind' : f < -TAIL ? 'headwind' : 'even wind');

// ── the assembled narrative ──────────────────────────────────────────────────
export interface PairNarrative {
  readingA: XiangfaReading;
  readingB: XiangfaReading;
  mutual: [MutualDirection, MutualDirection];
  mutualNote: string;
  needRows: NeedSupplyRow[];   // A's top needs first, then B's
  cross: BranchRelation[];
  bands: [SeasonBand, SeasonBand];
  windowFrom: number;
  windowTo: number;
  joint: JointWindow[];
  nowLine: string;
  beats: string[];
}

export function buildPairNarrative(
  a: { label: string; chart: BaziChart },
  b: { label: string; chart: BaziChart },
  lens: 'partner' | 'marriage',
  nowYear: number,
): PairNarrative {
  const readingA = buildXiangfaReading(a.chart);
  const readingB = buildXiangfaReading(b.chart);
  const dmA = a.chart.dayMaster.chinese;
  const dmB = b.chart.dayMaster.chinese;

  // A1 — both directions
  const idAB = relationBetween(dmA, dmB); // what B is to A
  const idBA = relationBetween(dmB, dmA);
  const mutual: [MutualDirection, MutualDirection] = [
    { self: a.label, other: b.label, id: idAB, naturePhrase: RELATIONSHIPS[idAB].naturePhrase, line: MODE_LINE[idAB](a.label, b.label) },
    { self: b.label, other: a.label, id: idBA, naturePhrase: RELATIONSHIPS[idBA].naturePhrase, line: MODE_LINE[idBA](b.label, a.label) },
  ];
  const mutualNote = idAB === idBA
    ? 'A rare symmetry — the same current runs both ways between you.'
    : 'Notice the asymmetry: what flows one way is not what flows back. Most pairs live on exactly this difference.';

  // A2 — needs, cross-supplied
  const needRows = [
    ...needRowsFor(a.label, b.label, readingA, readingB),
    ...needRowsFor(b.label, a.label, readingB, readingA),
  ];

  // C — the charts, palace to palace
  const cross = buildCrossRelations(a.chart, b.chart);

  // B — decades in step
  const windowFrom = nowYear;
  const windowTo = nowYear + 30;
  const seasonsA = buildLifeSeasons(a.chart, readingA, nowYear);
  const seasonsB = buildLifeSeasons(b.chart, readingB, nowYear);
  const bands: [SeasonBand, SeasonBand] = [
    bandFor(a.label, seasonsA, windowFrom, windowTo),
    bandFor(b.label, seasonsB, windowFrom, windowTo),
  ];
  const joint = jointWindows(seasonsA, seasonsB, windowFrom, windowTo);

  const wA = windWord(favorAt(seasonsA, nowYear));
  const wB = windWord(favorAt(seasonsB, nowYear));
  const nowLine =
    wA === wB
      ? `Right now you are both in ${wA === 'tailwind' ? 'a tailwind — the weather carries you both' : wA === 'headwind' ? 'a headwind — a stretch to conserve and root, together' : 'even wind — steady tending weather for you both'}.`
      : `Right now ${a.label} runs ${wA} while ${b.label} runs ${wB} — one of you has more to spare; pace yourselves accordingly.`;

  // D — the joint storyline
  const gift = needRows.find((r) => r.otherLevel === 'plenty' && r.ownStatus === 'scarce');
  const gap = needRows.find((r) => r.otherLevel === 'thin' && r.ownStatus === 'scarce');
  const beats: string[] = [];
  beats.push(
    `${a.label} began as ${readingA.stem.archetypeName} — ${lf(readingA.stem.imageTitle)}. ${b.label} began as ${readingB.stem.archetypeName} — ${lf(readingB.stem.imageTitle)}. Two weathers, meeting.`,
  );
  beats.push(
    `To ${a.label}, ${b.label} is ${mutual[0].naturePhrase}. To ${b.label}, ${a.label} is ${mutual[1].naturePhrase}. ${mutualNote}`,
  );
  if (gift) {
    beats.push(
      `The clearest gift between you: ${lf(gift.need.label)}. ${gift.line}${gap ? ` The honest gap: ${lf(gap.need.label)} — ${lf(gap.line)}` : ''}`,
    );
  } else if (gap) {
    beats.push(`The honest gap between you: ${lf(gap.need.label)}. ${gap.line}`);
  } else {
    beats.push(`Neither of you leans hard on the other for weather — what you exchange is chosen, not needed. That is its own kind of freedom.`);
  }
  if (cross.length) {
    const c = cross[0];
    beats.push(`Where your charts meet: ${c.poleA.toLowerCase()} against ${c.poleB.toLowerCase()} — ${lf(c.theme)}`);
  }
  const nextJoint = joint.find((w) => w.toYear > nowYear);
  beats.push(
    `${nowLine}${nextJoint ? ` Your next shared tailwind runs ${nextJoint.fromYear}–${nextJoint.toYear - 1}.` : ''} ${
      lens === 'partner'
        ? 'Split the roles along your real strengths, name who owns which calls, and time the big pushes to the years that carry you both.'
        : 'The spark is read; the keeping is tended — season by season, in weather you can now both see.'
    }`,
  );

  return { readingA, readingB, mutual, mutualNote, needRows, cross, bands, windowFrom, windowTo, joint, nowLine, beats };
}
