// Smoke test for the paired-report depth layer (content/xiangfa/pair.ts).
// Run: npx tsx scripts/checkPairNarrative.ts
import { calculateBazi } from '../services/baziService';
import { buildPairNarrative } from '../content/xiangfa/pair';
import { Gender } from '../types';

const a = { label: 'Ana', chart: calculateBazi(1992, 3, 8, 9, 30, Gender.FEMALE) };
const b = { label: 'Ben', chart: calculateBazi(1990, 6, 15, 22, 0, Gender.MALE) };
const NOW = 2026;

let fail = 0;
const check = (cond: boolean, what: string) => {
  if (!cond) { fail++; console.log('FAIL:', what); } else console.log('ok  ', what);
};

for (const lens of ['partner', 'marriage'] as const) {
  const n = buildPairNarrative(a, b, lens, NOW);

  check(n.mutual.length === 2 && n.mutual.every((m) => m.line.length > 20 && m.naturePhrase.length > 5), `${lens}: two mutual directions with real copy`);
  check(n.needRows.length === 4 && n.needRows.every((r) => r.line.length > 10), `${lens}: four need rows with lines`);
  check(n.bands.every((band) => band.segments.reduce((s, x) => s + (x.toYear - x.fromYear), 0) === 30), `${lens}: bands cover the full 30-year window`);
  check(n.beats.length >= 4 && n.beats.length <= 5, `${lens}: ${n.beats.length} storyline beats`);

  const all = JSON.stringify(n);
  check(!all.includes('undefined') && !all.includes('NaN'), `${lens}: no undefined/NaN leaked into copy`);
}

// Eyeball sample
const n = buildPairNarrative(a, b, 'partner', NOW);
console.log('\n— sample —');
console.log('mutual A←B:', n.mutual[0].line);
console.log('mutual B←A:', n.mutual[1].line);
console.log('need row:', n.needRows[0].need.label, '→', n.needRows[0].line);
console.log('cross:', n.cross.length ? `${n.cross[0].title}: ${n.cross[0].poleA}·${n.cross[0].poleB}` : '(none — even meeting)');
console.log('joint windows:', n.joint.map((w) => `${w.fromYear}–${w.toYear - 1}`).join(', ') || '(none)');
console.log('now:', n.nowLine);
console.log('beat 5:', n.beats[n.beats.length - 1]);

console.log(fail === 0 ? '\nALL PASS' : `\n${fail} FAILURES`);
if (fail) process.exit(1);
