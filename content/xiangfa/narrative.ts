import { BaziChart, ElementType } from '../../types';
import { XiangfaReading } from './index';
import { FORCE, InteractionsReading, BranchRelation } from './interactions';
import { RelationshipId, RelationshipReading, LifeSeason } from './relationships';

// Weave every piece — nature, season, makeup, inner tension, needs, the people
// you draw, and the decades — into a single illustrated line: one person's
// growth, brick by brick.

const lf = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export interface StoryArt {
  kind: 'nature' | 'force' | 'tension' | 'decades' | 'thread';
  symbol?: string;
  element?: ElementType;
}
export interface StoryBeat {
  text: string;
  art: StoryArt;
}

const MOOD_CLAUSE: Record<string, string> = {
  harsh: 'a hard, formative start',
  tender: 'a soft, slow beginning',
  abundant: 'a generous, easy beginning',
  balanced: 'an even beginning',
};

const REL_NOUN: Record<RelationshipId, string> = {
  nourish: 'support and care',
  express: 'room to create',
  tend: 'things to tend and build',
  shape: 'pressure to grow against',
  kin: 'company and rivalry',
};

// turn the most salient branch relation into a concrete clause
function relClause(r: BranchRelation): string {
  switch (r.kind) {
    case 'clash':
      return `You also live along a fault line — ${r.poleA.toLowerCase()} on one side, ${r.poleB.toLowerCase()} on the other: ${r.theme}`;
    case 'punish':
      return r.poleA === r.poleB
        ? `You also carry an inner knot: ${r.theme}`
        : `You also carry a recurring friction — ${r.poleA.toLowerCase()} against ${r.poleB.toLowerCase()}: ${r.theme}`;
    case 'harm':
      return `A quieter strain runs under it too: ${r.theme}`;
    default:
      return `And one part of you pulls together rather than apart: ${r.theme}`;
  }
}

export function buildStoryline(
  chart: BaziChart,
  reading: XiangfaReading,
  relationships: RelationshipReading[],
  seasons: LifeSeason[],
  interactions: InteractionsReading,
): StoryBeat[] {
  const stem = reading.stem;
  const season = reading.season;
  const domF = FORCE[reading.dominantElement];
  const weakF = FORCE[reading.weakestElement];
  const primary = interactions.dynamics[0];
  const rel0 = interactions.relations[0];

  const topNeed = reading.needStatus.find((n) => n.status === 'scarce')?.need ?? reading.prioritizedNeeds[0];
  const topRel = relationships[0];
  const faintRel = [...relationships].reverse().find((r) => r.prominence === 'faint') ?? relationships[relationships.length - 1];

  const beats: StoryBeat[] = [];

  // 1 — origin
  beats.push({
    art: { kind: 'nature', symbol: stem.symbol },
    text: `You began as ${stem.archetypeName} — ${lf(stem.imageTitle)}. You took root in ${season.climate}: ${MOOD_CLAUSE[season.mood] ?? 'a beginning of its own kind'}, and that first weather still lives in you.`,
  });

  // 2 — inner makeup + central tension (+ the concrete branch axis)
  let p2 = `Inside, you run heaviest in ${domF.toLowerCase()} and lightest in ${weakF.toLowerCase()}. ${primary.phrase} — ${lf(primary.meaning)} This quiet push and pull is the engine under much of what you do.`;
  if (rel0) p2 += ` ${relClause(rel0)}`;
  beats.push({ art: { kind: 'tension' }, text: p2 });

  // 3 — what you reach for + the company life keeps for you
  beats.push({
    art: { kind: 'force', element: topNeed.element },
    text: `So the thing you keep reaching for is ${lf(topNeed.label)}: ${lf(topNeed.why)} Life has handed you no shortage of ${REL_NOUN[topRel.id]}, and asked far less of ${REL_NOUN[faintRel.id]} — and you have grown around both.`,
  });

  // 4 — the long arc of decades
  const cur = seasons.find((s) => s.current) ?? seasons[0];
  const idx = seasons.indexOf(cur);
  const past = seasons.slice(0, idx).slice(-2).map((s) => s.label.toLowerCase());
  const future = seasons.slice(idx + 1, idx + 3).map((s) => s.label.toLowerCase());
  const pastClause = past.length ? `Your earlier decades leaned ${past.join(', then ')}, and ` : '';
  const futureClause = future.length ? ` Ahead lie ${future.join(' and ')} seasons` : ' More seasons wait ahead';
  beats.push({
    art: { kind: 'decades' },
    text: `Your life moves in long weathers, each lasting about a decade. ${pastClause}right now you are in a ${cur.label.toLowerCase()} stretch — ages ${cur.startAge}–${cur.endAge}: ${lf(cur.theme)}${cur.note ? ' ' + cur.note : ''}${futureClause}, and you grow into each as it turns.`,
  });

  // 5 — the through-line
  beats.push({
    art: { kind: 'thread' },
    text: `The thread running through all of it: learning to let your ${weakF.toLowerCase()} breathe without losing the ${domF.toLowerCase()} that steadies you. ${stem.thrivingLine}`,
  });

  return beats;
}
