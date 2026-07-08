// Individual (旺衰/用神) + relationship readings for the 17 AA charts, computed
// with 真太阳时. Qualitative check against each 命运总结, plus the compatibility
// engine on the real family pairs in the set.
// Run: npx tsx scripts/checkFamousReadings.ts

import * as fs from 'fs';
import { calculateBazi, Geo } from '../services/baziService';
import { Gender, ElementType } from '../types';
import { analyzeCompatibility, Person } from '../utils/CompatibilityAnalyzer';

const NOUN: Record<ElementType, string> = {
  [ElementType.WOOD]: '木', [ElementType.FIRE]: '火', [ElementType.EARTH]: '土',
  [ElementType.METAL]: '金', [ElementType.WATER]: '水',
};
const CAT: Record<string, string> = {
  'follow-weak': '从弱', 'weak': '身弱', 'balanced': '中和', 'strong': '身强', 'follow-strong': '从强',
};

const csv = fs.readFileSync('docs/名人AA级八字验证集_1.csv', 'utf8').replace(/^﻿/, '');
const rows = csv.split('\n').slice(1).filter((l) => l.trim());

interface Rec { name: string; person: Person; chart: ReturnType<typeof calculateBazi>; summary: string; }
const recs: Rec[] = [];

for (const line of rows) {
  const f = line.split(',');
  const name = f[0].split(' ')[0];
  const [y, mo, d] = f[2].split('-').map(Number);
  const [ch, cm] = f[3].split(':').map(Number);
  const lon = Number(f[6]);
  const off = f[7].match(/\(([-+]?\d+)\)/);
  const geo: Geo = { longitude: lon, tzOffsetHours: off ? Number(off[1]) : lon / 15 };
  const summary = f[17] ?? '';

  const chart = calculateBazi(y, mo, d, ch, cm, Gender.MALE, geo);
  const person: Person = {
    label: name,
    strength: chart.strength!,
    yongshen: chart.yongshen!,
    dayBranch: chart.dayPillar.branch.chinese,
  };
  recs.push({ name, person, chart, summary });

  const s = chart.strength!;
  const ys = chart.yongshen!;
  const bazi = [chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar]
    .map((p) => p.stem.chinese + p.branch.chinese).join(' ');
  console.log(
    `${name.padEnd(6)} ${bazi}  ${CAT[s.category]}(${(s.supportShare * 100).toFixed(0)}%)` +
    ` 用${NOUN[ys.primaryYong]}忌${NOUN[ys.primaryJi]}  | ${summary.slice(0, 40)}`,
  );
}

// ── Real family pairs in the set ─────────────────────────────────────────────
const find = (n: string) => recs.find((r) => r.name.includes(n))!;
const pairs: [string, string, string][] = [
  ['李小龙', '李国豪', '父子'],
  ['伊丽莎白二世', '查尔斯', '母子'],
  ['查尔斯', '威廉', '父子'],
  ['威廉', '乔治', '父子'],
];

console.log('\n── 真实亲属关系(合伙镜头供需) ──');
for (const [an, bn, rel] of pairs) {
  const a = find(an), b = find(bn);
  const r = analyzeCompatibility(a.person, b.person, 'partner');
  console.log(`\n【${a.name} × ${b.name}（${rel}）】`);
  console.log(`  ${a.name}→${b.name} ${r.aToB.score.toFixed(2)}；${b.name}→${a.name} ${r.bToA.score.toFixed(2)}；互补 ${r.mutualScore.toFixed(2)} ${r.samePeers ? '同类' : '异类'}`);
}
