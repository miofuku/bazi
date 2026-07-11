// Reverse lookup: four pillars (四柱) → candidate Gregorian birth datetimes.
//
// Why: validation cases (docs/命理分析.csv) arrive as bare pillars. Recovering
// the birth date unlocks the 大运 sequence + 司令, which year-labelled life
// events need (see docs/普通人案例验证.md, case #4's blocker).
//
// Method: the day pillar repeats every 60 days, so scan the first 60 days of
// the range for an anchor, then step by 60 and verify year+month pillars at
// noon; for full-pillar input, enumerate the twelve 时辰 windows and verify
// ALL four pillars at the exact time (子时 day-boundary handled by tyme4ts
// itself). Uses the same tyme4ts path as calculateBazi, so reverse and forward
// can never disagree.
//
// Note: matches are in apparent solar terms — if the birthplace is known, the
// civil clock time shifts by the 真太阳时 correction (longitude + equation of
// time); the pillars themselves are what matter for validation.
//
// Run:
//   npx tsx scripts/reverseBazi.ts 戊子 戊午 癸未 戊午
//   npx tsx scripts/reverseBazi.ts 甲申 甲戌 甲子        (三柱 — day-level only)
//   npx tsx scripts/reverseBazi.ts 丙寅 乙未 庚辰 戊寅 --from 1980 --to 1990

import { SolarTime } from 'tyme4ts';

const SEQ_S = '甲乙丙丁戊己庚辛壬癸';
const SEQ_B = '子丑寅卯辰巳午未申酉戌亥';
const isGanZhi = (s: string) => s.length === 2 && SEQ_S.includes(s[0]) && SEQ_B.includes(s[1]);

// All four pillar names at an exact moment, via the same chain as calculateBazi.
// getName() returns "庚辰日"-style suffixed strings — keep the 干支 only.
const gz = (name: string) => name.slice(0, 2);
const pillarsAt = (y: number, mo: number, d: number, h: number, mi: number) => {
  const hourObj = SolarTime.fromYmdHms(y, mo, d, h, mi, 0).getSixtyCycleHour();
  const dayObj = hourObj.getSixtyCycleDay();
  const monthObj = dayObj.getSixtyCycleMonth();
  return {
    year: gz(monthObj.getSixtyCycleYear().getName()),
    month: gz(monthObj.getName()),
    day: gz(dayObj.getName()),
    hour: gz(hourObj.getName()),
  };
};

// The twelve 时辰 windows by representative check-time on the SAME calendar
// date. 子时 is split: 00:30 (early morning) and 23:30 (late night — tyme4ts
// applies its own 换日 rule; the all-four-pillar check decides).
const HOUR_CHECKS: { h: number; mi: number; label: string }[] = [
  { h: 0, mi: 30, label: '00:00–00:59' },
  { h: 1, mi: 30, label: '01:00–02:59' },
  { h: 3, mi: 30, label: '03:00–04:59' },
  { h: 5, mi: 30, label: '05:00–06:59' },
  { h: 7, mi: 30, label: '07:00–08:59' },
  { h: 9, mi: 30, label: '09:00–10:59' },
  { h: 11, mi: 30, label: '11:00–12:59' },
  { h: 13, mi: 30, label: '13:00–14:59' },
  { h: 15, mi: 30, label: '15:00–16:59' },
  { h: 17, mi: 30, label: '17:00–18:59' },
  { h: 19, mi: 30, label: '19:00–20:59' },
  { h: 21, mi: 30, label: '21:00–22:59' },
  { h: 23, mi: 30, label: '23:00–23:59' },
];

// ── args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const pillars = args.filter(isGanZhi);
const flag = (name: string, dflt: number) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : dflt;
};
const FROM = flag('from', 1930);
const TO = flag('to', 2026);
const NOW = flag('now', new Date().getFullYear());

if (pillars.length < 3 || pillars.length > 4) {
  console.log('Usage: npx tsx scripts/reverseBazi.ts 年柱 月柱 日柱 [时柱] [--from 1930] [--to 2026] [--now 2026]');
  process.exit(1);
}
const [tYear, tMonth, tDay, tHour] = pillars;

// ── scan ──────────────────────────────────────────────────────────────────────
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const ymd = (d: Date) => [d.getFullYear(), d.getMonth() + 1, d.getDate()] as const;

// Anchor: first date in range whose day pillar matches (≤60 probes).
let anchor: Date | null = null;
for (let i = 0; i < 60; i++) {
  const d = addDays(new Date(FROM, 0, 1), i);
  if (pillarsAt(...ymd(d), 12, 0).day === tDay) { anchor = d; break; }
}
if (!anchor) { console.log('日柱无效？前 60 天内未出现。'); process.exit(1); }

interface Hit { date: Date; windows: string[] }
const hits: Hit[] = [];
const end = new Date(TO, 11, 31);

for (let d = anchor; d <= end; d = addDays(d, 60)) {
  const p = pillarsAt(...ymd(d), 12, 0);
  if (p.year !== tYear || p.month !== tMonth || p.day !== tDay) continue;

  if (!tHour) { hits.push({ date: d, windows: [] }); continue; }

  const windows = HOUR_CHECKS.filter((c) => {
    const q = pillarsAt(...ymd(d), c.h, c.mi);
    return q.year === tYear && q.month === tMonth && q.day === tDay && q.hour === tHour;
  }).map((c) => c.label);
  if (windows.length) hits.push({ date: d, windows });
}

// ── report ────────────────────────────────────────────────────────────────────
console.log(`四柱 ${pillars.join(' ')} · 范围 ${FROM}–${TO} · ${hits.length} 个候选\n`);
for (const h of hits) {
  const [y, mo, d] = ymd(h.date);
  const date = `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const age = NOW - y;
  console.log(`  ${date}  (${NOW}年${age}岁)${h.windows.length ? `  时辰 ${h.windows.join(' / ')}` : ''}`);
}
if (!hits.length) console.log('  无匹配 — 检查柱序（年 月 日 时）或放宽 --from/--to。');
