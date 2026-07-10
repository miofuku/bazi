// Roundtrip + rejection checks for the share-URL codec. Run: npx tsx scripts/checkShareUrl.ts
import { encodeBirth, decodeBirth, encodePair, decodePair, SharedBirth, SharedPairPerson } from '../utils/shareUrl';
import { Gender } from '../types';

// Key-order-insensitive equality (JSON.stringify alone is order-sensitive).
const canon = (o: object) => JSON.stringify(Object.fromEntries(Object.entries(o).sort()));
const eq = (x: object | null, y: object) => x !== null && canon(x) === canon(y);

const cases: SharedBirth[] = [
  { year: 2000, month: 6, day: 15, hour: 12, minute: 0, gender: Gender.MALE },
  { year: 1990, month: 1, day: 3, hour: undefined, minute: 0, gender: Gender.FEMALE },
  { year: 1988, month: 11, day: 30, hour: 23, minute: 59, gender: Gender.FEMALE, lon: 121.5, tzOffsetHours: 8 },
];

let fail = 0;
for (const c of cases) {
  const url = encodeBirth(c);
  const back = decodeBirth(url);
  const ok = eq(back, c);
  if (!ok) { fail++; console.log('FAIL roundtrip', c, '->', url, '->', back); }
  else console.log('ok  ', url);
}

// Garbage must decode to null, never a wrong reading.
for (const bad of ['?d=2000-13-01&g=m', '?d=junk&g=m', '?g=m', '?d=2000-06-15&g=x', '?d=2000-06-15&t=25:00&g=m', '?d=2000-06-15&g=m&lon=999&tz=8', '']) {
  const r = decodeBirth(bad);
  if (r !== null) { fail++; console.log('FAIL should-be-null:', bad, r); }
  else console.log('ok   null for', JSON.stringify(bad));
}

// Pair roundtrips, both lenses, geo on one side only.
const pa: SharedPairPerson = { label: 'Ana', year: 1992, month: 3, day: 8, hour: 9, minute: 30, gender: Gender.FEMALE, lon: 121.5, tzOffsetHours: 8 };
const pb: SharedPairPerson = { label: 'Ben', year: 1990, month: 6, day: 15, hour: undefined, minute: 0, gender: Gender.MALE };
for (const lens of ['partner', 'marriage'] as const) {
  const url = encodePair(pa, pb, lens);
  const back = decodePair(url);
  const ok = back && back.lens === lens && eq(back.a, pa) && eq(back.b, pb);
  if (!ok) { fail++; console.log('FAIL pair roundtrip', lens, url, back); }
  else console.log('ok  ', url.slice(0, 60) + '…');
}

// Single and pair URLs must not decode as each other.
const singleUrl = encodeBirth(cases[0]);
const pairUrl = encodePair(pa, pb, 'partner');
if (decodePair(singleUrl) !== null) { fail++; console.log('FAIL: single URL decoded as pair'); }
else console.log('ok   single URL is not a pair');
if (decodeBirth(pairUrl) !== null) { fail++; console.log('FAIL: pair URL decoded as single'); }
else console.log('ok   pair URL is not a single');
if (decodePair('?ad=2000-06-15&ag=m&lens=work') !== null) { fail++; console.log('FAIL: half a pair decoded'); }
else console.log('ok   null for half a pair');

console.log(fail === 0 ? 'ALL PASS' : `${fail} FAILURES`);
if (fail) process.exit(1);
